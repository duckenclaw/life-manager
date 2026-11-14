// Meta Bind button (daily note): plan today's superset workout.
//  1. Pick a grouping (chest + upper back, …) and 3 or 4 pairs.
//  2. Heavy/light flips from the last session of that grouping (periodisation).
//  3. Keeps part of last session's exercises and swaps the rest for variations not done in the
//     last sessions; imports one from the free-exercise-db when the library has nothing fresh.
//  4. Writes workout_split, workout_load, workout_plan, planned_exercises and stretch_plan to the
//     note's frontmatter. Scripts/workoutPlan.js and Scripts/stretchPlan.js render them.
// Settings: Scripts/trainingConfig.json.

const { Modal, Setting, SuggestModal, Notice } = obsidian;
const run = async (script, a) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, a); };
const DAILY = "Daily";

const file = args?.path ? app.vault.getAbstractFileByPath(args.path) : app.workspace.getActiveFile();
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(file.basename)) {
	new Notice("Open a daily note first.");
	return;
}
const today = file.basename;
const config = JSON.parse(await app.vault.adapter.read("Scripts/trainingConfig.json"));
const P = await run("Scripts/lib/planner.js");
const lib = await run("Scripts/lib/exerciseDb.js");
const planner = app.plugins.plugins["workout-planner"];
const api = window.WorkoutPlannerAPI;
const inc = Number(planner?.settings?.weightIncrement) || 2.5;
const meta = (f) => app.metadataCache.getFileCache(f)?.frontmatter ?? {};
const list = (v) => (Array.isArray(v) ? v : v == null || v === "" ? [] : [v]);
const fm = meta(file);

// ── History: earlier daily notes with a plan ───────────────────────────────
const sessions = app.vault.getMarkdownFiles()
	.filter((f) => f.path.startsWith(`${DAILY}/`) && /^\d{4}-\d{2}-\d{2}$/.test(f.basename) && f.basename < today)
	.map((f) => ({ f, m: meta(f) }))
	.filter(({ m }) => m.workout_split || m.stretch_plan)
	.map(({ f, m }) => ({
		date: f.basename,
		split: m.workout_split ?? null,
		loads: m.workout_load ?? null,
		exercises: list(m.workout_plan).map((p) => ({ exercise: p.exercise, group: p.group })),
		stretches: list(m.stretch_plan),
	}));

// ── Ask: grouping, pairs, loads ────────────────────────────────────────────
const label = (g) => config.groups[g].label;
const loadText = (loads, split) => split.groups.map((g) => `${config.loads[loads[g]].icon} ${label(g)} ${loads[g]}`).join(" · ");
const suggested = P.suggestSplit(config, sessions);
const fmtDate = (d) => window.moment(d, "YYYY-MM-DD").format("ddd D MMM");

const split = await new Promise((resolve) => {
	class SplitModal extends SuggestModal {
		getSuggestions(q) {
			const items = [suggested, ...config.splits.filter((s) => s !== suggested)];
			return items.filter((s) => s.label.toLowerCase().includes(q.toLowerCase()));
		}
		renderSuggestion(s, el) {
			const { loads, last } = P.nextLoads(s, sessions);
			el.createDiv({ text: `${s === suggested ? "⭐ " : ""}${s.label}` });
			el.createEl("small", {
				cls: "mod-muted",
				text: last ? `Last ${fmtDate(last.date)} → today ${loadText(loads, s)}` : `First time → ${loadText(loads, s)}`,
			});
		}
		onChooseSuggestion(s) { resolve(s); }
		onClose() { setTimeout(() => resolve(null), 0); }
	}
	const m = new SplitModal(app);
	m.setPlaceholder("Which superset day?");
	m.open();
});
if (!split) return;

const { loads: flipped, last } = P.nextLoads(split, sessions);
const options = await new Promise((resolve) => {
	const m = new Modal(app);
	let pairs = String(config.defaultPairs);
	let heavy = split.groups.find((g) => flipped[g] === "heavy");
	let ok = false;
	m.titleEl.setText(split.label);
	if (last) m.contentEl.createEl("p", { cls: "mod-muted", text: `Last time (${fmtDate(last.date)}): ${loadText(last.loads, split)}` });
	new Setting(m.contentEl).setName("Superset pairs").setDesc("3 pairs = 6 exercises, 4 pairs = 8")
		.addDropdown((d) => d.addOptions({ 3: "3 pairs", 4: "4 pairs" }).setValue(pairs).onChange((v) => (pairs = v)));
	new Setting(m.contentEl).setName("Heavy today").setDesc("The other group goes light")
		.addDropdown((d) => {
			split.groups.forEach((g) => d.addOption(g, `${label(g)}${g === split.groups.find((x) => flipped[x] === "heavy") ? " (flipped from last time)" : ""}`));
			d.setValue(heavy).onChange((v) => (heavy = v));
		});
	new Setting(m.contentEl).addButton((b) => b.setButtonText("Plan workout").setCta().onClick(() => { ok = true; m.close(); }));
	m.onClose = () => resolve(ok ? { pairs: Number(pairs), heavy } : null);
	m.open();
});
if (!options) return;
const loads = Object.fromEntries(split.groups.map((g) => [g, g === options.heavy ? "heavy" : "light"]));

if (list(fm.workout_plan).length) {
	const replace = await new Promise((resolve) => {
		const m = new Modal(app);
		let ok = false;
		m.titleEl.setText("Replace today's plan?");
		m.contentEl.createEl("p", { text: "Sets you already logged stay in the log." });
		new Setting(m.contentEl)
			.addButton((b) => b.setButtonText("Replace").setWarning().onClick(() => { ok = true; m.close(); }))
			.addButton((b) => b.setButtonText("Cancel").onClick(() => m.close()));
		m.onClose = () => resolve(ok);
		m.open();
	});
	if (!replace) return;
}

// ── Exercise library + database candidates ────────────────────────────────
let db = [];
try { db = await lib.load(); } catch (e) { new Notice(`Exercise database unavailable (${e.message}); using your library only.`); }
const dbById = new Map(db.map((x) => [x.id, x]));
const dbByName = new Map(db.map((x) => [lib.safeName(x.name).toLowerCase(), x]));
const libraryFiles = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${lib.FOLDER}/`));
const library = libraryFiles.map((f) => {
	const m = meta(f);
	const src = String(m.source ?? "");
	const entry = (src.startsWith("free-exercise-db/") && dbById.get(src.slice(17))) || dbByName.get(f.basename.toLowerCase());
	return {
		name: f.basename, primary: list(m.primary_muscles), equipment: list(m.equipment),
		category: m.category ?? entry?.category ?? "strength", mechanic: entry?.mechanic ?? null, force: entry?.force ?? null,
	};
});
const inLibrary = new Set(library.map((e) => e.name.toLowerCase()));
const dbCandidates = db
	.filter((x) => !inLibrary.has(lib.safeName(x.name).toLowerCase()))
	.filter((x) => config.autoImportEquipment.includes(x.equipment ?? "body only") && config.autoImportLevels.includes(x.level))
	.filter((x) => !(config.autoImportExcludeWords ?? []).some((w) => x.name.toLowerCase().includes(w)))
	.map((x) => ({ name: lib.safeName(x.name), primary: x.primaryMuscles, equipment: x.equipment ? [x.equipment] : [], category: x.category, mechanic: x.mechanic, force: x.force, fromDb: true, entry: x }));

// ── Logged sets (local dates) ──────────────────────────────────────────────
const logs = ((api && (await api.getWorkoutLogs({}).catch(() => []))) ?? []).map((l) => ({
	exercise: l.exercise, reps: Number(l.reps) || 0, weight: Number(l.weight) || 0,
	date: window.moment(l.timestamp ? Number(l.timestamp) : l.date).format("YYYY-MM-DD"),
}));

// ── Plan ───────────────────────────────────────────────────────────────────
const picks = {};
for (const g of split.groups) {
	picks[g] = P.pickExercises({ config, split, groupKey: g, load: loads[g], count: options.pairs, library, dbCandidates, logs, sessions, today }).exercises;
}
const imported = [];
for (const g of split.groups) {
	for (const e of picks[g]) {
		if (!e.fromDb) continue;
		const { file: f } = await lib.createNote(e.entry);
		e.name = f.basename;
		imported.push(f.basename);
	}
}
const plan = P.buildPlan({ config, split, loads, picks, logs, today, inc });
const stretches = P.pickStretches(config, split.groups, sessions);

await ensureBlocks(file);
await app.fileManager.processFrontMatter(file, (f) => {
	f.workout_split = split.id;
	f.workout_load = loads;
	f.workout_plan = plan;
	f.planned_exercises = plan.map((p) => `[[${p.exercise}]]`);
	f.stretch_plan = stretches;
});
new Notice(`${split.label}: ${plan.length} exercises planned${imported.length ? `. Imported ${imported.join(", ")}` : ""}`, 6000);

// Older daily notes don't have the plan/stretching blocks yet: add them.
async function ensureBlocks(f) {
	const loader = 'const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };';
	const planBlock = ["```js-engine", loader, 'return await run("Scripts/workoutPlan.js", { path: context.file.path, component });', "```", ""].join("\n");
	const stretchBlock = ["## 🧘 Stretching", "", "```js-engine", loader, 'return await run("Scripts/stretchPlan.js", { path: context.file.path, component });', "```", "", ""].join("\n");
	await app.vault.process(f, (text) => {
		if (!text.includes("Scripts/workoutPlan.js")) {
			text = /^## 🏋️ Training\n\n?/m.test(text) ? text.replace(/^## 🏋️ Training\n\n?/m, (h) => `## 🏋️ Training\n\n${planBlock}\n`) : `${text}\n## 🏋️ Training\n\n${planBlock}`;
		}
		if (!text.includes("Scripts/stretchPlan.js")) {
			text = /^## Notes$/m.test(text) ? text.replace(/^## Notes$/m, `${stretchBlock}## Notes`) : `${text}\n${stretchBlock}`;
		}
		return text;
	});
}
