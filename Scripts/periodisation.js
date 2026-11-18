// Periodisation overview for Dashboards/Training.md: per muscle group, when it was last trained,
// heavy or light, and what comes next; then the most recent planned sessions.
// Reads `workout_split` / `workout_load` / `training_sets` / `training_volume` from daily notes.
//
// Called from a js-engine block with args = { sessions = 8 }. Returns markdown.

const config = JSON.parse(await app.vault.adapter.read("Scripts/trainingConfig.json"));
const DAILY = "Daily";
const today = window.moment().format("YYYY-MM-DD");
const since = window.moment().subtract(27, "days").format("YYYY-MM-DD");
const fmtDate = (d) => window.moment(d, "YYYY-MM-DD").format("ddd D MMM");

const sessions = app.vault.getMarkdownFiles()
	.filter((f) => f.path.startsWith(`${DAILY}/`) && /^\d{4}-\d{2}-\d{2}$/.test(f.basename))
	.map((f) => ({ date: f.basename, fm: app.metadataCache.getFileCache(f)?.frontmatter ?? {} }))
	.filter((s) => s.fm.workout_split && s.fm.workout_load)
	.sort((a, b) => b.date.localeCompare(a.date));

if (!sessions.length) return "*No planned workouts yet. Press **🏋️ Plan workout** in a daily note.*";

const L = config.loads;
const rows = [];
for (const [g, group] of Object.entries(config.groups)) {
	const mine = sessions.filter((s) => s.fm.workout_load[g]);
	const last = mine[0];
	const load = last?.fm.workout_load[g];
	const next = load ? (load === "heavy" ? "light" : "heavy") : "heavy";
	const split = config.splits.find((s) => s.groups.includes(g));
	rows.push(`| ${group.label} | ${split?.label ?? "–"} | ${last ? fmtDate(last.date) : "–"} | ${load ? `${L[load].icon} ${load}` : "–"} | ${L[next].icon} ${next} | ${mine.filter((s) => s.date >= since).length} |`);
}

const recent = sessions.slice(0, args.sessions ?? 8).map((s) => {
	const split = config.splits.find((x) => x.id === s.fm.workout_split);
	const loads = (split?.groups ?? Object.keys(s.fm.workout_load)).map((g) => `${L[s.fm.workout_load[g]]?.icon ?? ""} ${config.groups[g]?.label ?? g}`).join(" · ");
	return `| [[${DAILY}/${s.date}\\|${fmtDate(s.date)}]]${s.date === today ? " (today)" : ""} | ${split?.label ?? s.fm.workout_split} | ${loads} | ${s.fm.training_sets ?? "–"} | ${s.fm.training_volume ?? "–"} |`;
});

return [
	"| Muscle group | Day | Last trained | Last load | Next | Sessions (28 d) |",
	"|---|---|---|---|---|---:|",
	...rows,
	"",
	"| Session | Day | Loads | Sets | Volume kg |",
	"|---|---|---|---:|---:|",
	...recent,
].join("\n");
