// Weekly sets per muscle from Workout Planner logs, using each exercise's
// primary_muscles (1 set) and secondary_muscles (½ set). More precise than the
// plugin's heatmap, which only knows the `tags` muscle groups.
//
// Called from a js-engine block with args = { days = 7 }. Returns markdown.

const days = args.days ?? 7;
const SECONDARY_WEIGHT = 0.5;
const TARGET = [10, 20]; // common guideline: 10–20 weekly sets per muscle for growth
const MUSCLES = [
	"chest", "shoulders", "triceps", "biceps", "forearms", "lats", "middle back", "lower back", "traps", "neck",
	"abdominals", "glutes", "quadriceps", "hamstrings", "adductors", "abductors", "calves",
];

const api = window.WorkoutPlannerAPI;
if (!api) return "> [!warning] Install the Workout Planner plugin to see sets per muscle.";

const folder = app.plugins.plugins["workout-planner"]?.settings?.exerciseFolderPath ?? "Training/Exercises";
const exercises = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${folder}/`));
const meta = (f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const byName = new Map();
for (const f of exercises) {
	byName.set(f.basename.toLowerCase(), f);
	if (meta(f).exercise_name) byName.set(String(meta(f).exercise_name).toLowerCase(), f);
}

const start = window.moment().subtract(days - 1, "days").startOf("day");
const logs = ((await api.getWorkoutLogs({ dateRange: { start: start.format("YYYY-MM-DD") } })) ?? [])
	.filter((l) => window.moment(l.timestamp ? Number(l.timestamp) : l.date).isSameOrAfter(start));

const rows = new Map(MUSCLES.map((m) => [m, { primary: 0, secondary: 0 }]));
const unknown = new Set();
for (const l of logs) {
	const f = byName.get(String(l.exercise).toLowerCase());
	if (!f) { unknown.add(l.exercise); continue; }
	const prim = [...new Set(list(meta(f).primary_muscles))];
	const sec = [...new Set(list(meta(f).secondary_muscles))].filter((x) => !prim.includes(x));
	for (const m of prim) { if (!rows.has(m)) rows.set(m, { primary: 0, secondary: 0 }); rows.get(m).primary += 1; }
	for (const m of sec) { if (!rows.has(m)) rows.set(m, { primary: 0, secondary: 0 }); rows.get(m).secondary += 1; }
}

const fmt = (n) => (Number.isInteger(n) ? n : n.toFixed(1));
const status = (n) => (n === 0 ? "–" : n < TARGET[0] ? "🔸 low" : n > TARGET[1] ? "🔺 high" : "✅");
const table = [...rows]
	.map(([m, r]) => ({ m, ...r, total: r.primary + r.secondary * SECONDARY_WEIGHT }))
	.sort((a, b) => b.total - a.total)
	.map((r) => `| ${r.m} | **${fmt(r.total)}** | ${r.primary} | ${r.secondary} | ${status(r.total)} |`);

return [
	`*Last ${days} days · ${logs.length} sets logged · secondary muscles count ½ · guideline ${TARGET[0]}–${TARGET[1]} sets per muscle per week*`,
	"",
	"| Muscle | Sets | as primary | as secondary | |",
	"|---|---:|---:|---:|---|",
	...table,
	unknown.size ? `\n> [!warning] No exercise page for: ${[...unknown].join(", ")}. Import them so their muscles count.` : "",
].join("\n");
