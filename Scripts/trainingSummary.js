// Training summary for a daily note: planned exercises (frontmatter `planned_exercises`)
// vs sets logged that day with Workout Planner, plus muscles, equipment and volume.
// Sets `training: true` once a set is logged and stores `training_sets` / `training_volume`.
//
// Called from a js-engine block with args = { path }. Returns markdown.

const file = app.vault.getAbstractFileByPath(args.path);
if (!file) return "";
const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
const day = file.basename;
const api = window.WorkoutPlannerAPI;
const folder = app.plugins.plugins["workout-planner"]?.settings?.exerciseFolderPath ?? "Training/Exercises";
const exerciseFiles = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${folder}/`));
const meta = (f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const findExercise = (name) => {
	const n = String(name).toLowerCase();
	return exerciseFiles.find((f) => f.basename.toLowerCase() === n || String(meta(f).exercise_name ?? "").toLowerCase() === n);
};

// Planned exercises: links like "[[Barbell Squat]]" or plain names
const planned = list(fm.planned_exercises).map((entry) => {
	const link = String(entry).replace(/^\[\[|\]\]$/g, "").split("|")[0];
	const f = app.metadataCache.getFirstLinkpathDest(link, file.path) ?? findExercise(link);
	return { name: f ? f.basename : link, file: f };
});

// Sets logged on this (local) day
let logs = [];
if (api) {
	const d = window.moment(day, "YYYY-MM-DD");
	const all = await api.getWorkoutLogs({
		dateRange: { start: d.clone().subtract(1, "day").format("YYYY-MM-DD"), end: d.clone().add(1, "day").format("YYYY-MM-DD") },
	});
	logs = (all ?? []).filter((l) => window.moment(l.timestamp ? Number(l.timestamp) : l.date).format("YYYY-MM-DD") === day);
}
const byExercise = new Map();
for (const l of logs) {
	const key = String(l.exercise).toLowerCase();
	if (!byExercise.has(key)) byExercise.set(key, []);
	byExercise.get(key).push(l);
}

// Planned first, then anything logged that wasn't planned
const rows = [...planned];
for (const [key, ls] of byExercise) {
	if (!rows.some((r) => r.name.toLowerCase() === key)) {
		const f = findExercise(ls[0].exercise);
		rows.push({ name: f ? f.basename : ls[0].exercise, file: f, unplanned: true });
	}
}
if (!rows.length) return "*Nothing planned yet. Pick exercises above, or log a set with **🏋️ Log set**.*";

const primary = new Map(), secondary = new Map(), equipment = new Set();
let totalSets = 0, totalVolume = 0;
const tableRows = [];
for (const r of rows) {
	const m = r.file ? meta(r.file) : {};
	const sets = byExercise.get(r.name.toLowerCase()) ?? byExercise.get(String(m.exercise_name ?? "").toLowerCase()) ?? [];
	list(m.primary_muscles).forEach((x) => primary.set(x, (primary.get(x) ?? 0) + 1));
	list(m.secondary_muscles).forEach((x) => secondary.set(x, (secondary.get(x) ?? 0) + 1));
	list(m.equipment).forEach((x) => equipment.add(x));

	const plan = m.default_sets ? `${m.default_sets}×${m.default_reps ?? "?"} @ ${m.default_weight ?? 0} kg` : "–";
	const volume = sets.reduce((s, l) => s + (Number(l.volume) || Number(l.reps) * Number(l.weight) || 0), 0);
	totalSets += sets.length;
	totalVolume += volume;
	const done = sets.length ? `${sets.length} × ${sets.map((l) => `${l.reps}@${l.weight}`).join(", ")}` : "";
	let best = "";
	if (api) {
		const s = await api.getExerciseStats(r.name).catch(() => null);
		if (s?.totalSets) best = `${s.prWeight} kg × ${s.prReps}`;
	}
	const status = sets.length ? (r.unplanned ? "➕" : "✅") : "⬜";
	const label = r.file ? `[[${r.file.path}\\|${r.name}]]` : r.name;
	tableRows.push(`| ${status} | ${label} | ${plan} | ${done || "–"} | ${Math.round(volume) || "–"} | ${best || "–"} |`);
}

// Keep the habit + stats in frontmatter in sync (only write when something changed)
const updates = { training_sets: totalSets, training_volume: Math.round(totalVolume) };
if (totalSets > 0 && fm.training !== true) updates.training = true;
if (Object.entries(updates).some(([k, v]) => fm[k] !== v) && (totalSets > 0 || fm.training_sets != null)) {
	await app.fileManager.processFrontMatter(file, (f) => Object.assign(f, updates));
}

const muscles = (map) => [...map].sort((a, b) => b[1] - a[1]).map(([x]) => x).join(", ") || "–";
return [
	"| | Exercise | Plan | Today (reps@kg) | Volume kg | PR |",
	"|---|---|---|---|---:|---|",
	...tableRows,
	"",
	`**🎯 Primary:** ${muscles(primary)} · **➕ Secondary:** ${muscles(secondary)}`,
	`**🏋️ Equipment:** ${[...equipment].join(", ") || "–"} · **Sets:** ${totalSets} · **Volume:** ${Math.round(totalVolume)} kg`,
	api ? "" : "\n> [!warning] Install the Workout Planner plugin to log sets.",
].join("\n");
