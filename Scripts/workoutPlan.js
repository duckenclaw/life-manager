// Renders today's superset plan (frontmatter `workout_plan`, written by Scripts/planWorkout.js):
// pairs with heavy/light, target sets × reps @ kg, last session, sets done today and a
// prefilled "Log set" button per exercise. Refreshes when the note or the workout log changes.
//
// Called from a js-engine block with args = { path, component }. Returns an HTMLElement.

const run = async (script, a) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, a); };
const config = JSON.parse(await app.vault.adapter.read("Scripts/trainingConfig.json"));
const list = (v) => (Array.isArray(v) ? v : v == null || v === "" ? [] : [v]);
const csv = app.plugins.plugins["workout-planner"]?.settings?.csvLogFilePath ?? "Training/Logs/workout_logs.csv";
const root = createDiv({ cls: "workout-plan" });
root.style.cssText = "display:flex;flex-direction:column;gap:8px;";

async function render() {
	const file = app.vault.getAbstractFileByPath(args.path);
	if (!file) return;
	const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
	const plan = list(fm.workout_plan);
	root.empty();

	if (!plan.length) {
		const row = root.createDiv();
		row.createSpan({ text: "No workout planned yet. " });
		const b = row.createEl("button", { text: "🏋️ Plan workout", cls: "mod-cta" });
		b.onclick = () => run("Scripts/planWorkout.js", { path: args.path });
		return;
	}

	const split = config.splits.find((s) => s.id === fm.workout_split);
	const loads = fm.workout_load ?? {};

	// Sets logged today, by exercise
	const day = file.basename;
	const done = new Map();
	const api = window.WorkoutPlannerAPI;
	if (api) {
		const d = window.moment(day, "YYYY-MM-DD");
		const logs = (await api.getWorkoutLogs({ dateRange: { start: d.clone().subtract(1, "day").format("YYYY-MM-DD"), end: d.clone().add(1, "day").format("YYYY-MM-DD") } })) ?? [];
		for (const l of logs) {
			if (window.moment(l.timestamp ? Number(l.timestamp) : l.date).format("YYYY-MM-DD") !== day) continue;
			const k = String(l.exercise).toLowerCase();
			if (!done.has(k)) done.set(k, []);
			done.get(k).push(l);
		}
	}

	// Header: grouping and what heavy/light means today
	const head = root.createDiv();
	head.createEl("strong", { text: split?.label ?? fm.workout_split ?? "Workout" });
	for (const g of split?.groups ?? Object.keys(loads)) {
		const L = config.loads[loads[g]];
		if (!L) continue;
		head.createDiv({ cls: "mod-muted", text: `${L.icon} ${config.groups[g]?.label ?? g}: ${L.label.toLowerCase()} · ${L.sets}×${L.repsMin}–${L.repsMax} · rest ${L.rest} · ${L.cue}` });
	}

	// One card per superset pair
	const pairs = new Map();
	for (const p of plan) {
		const k = String(p.slot ?? "?")[0];
		if (!pairs.has(k)) pairs.set(k, []);
		pairs.get(k).push(p);
	}
	let totalDone = 0, totalSets = 0;
	for (const [k, items] of pairs) {
		const card = root.createDiv();
		card.style.cssText = "border:1px solid var(--background-modifier-border);border-radius:8px;padding:8px 10px;";
		card.createDiv({ cls: "mod-muted", text: `Superset ${k} · alternate, rest after both` }).style.fontSize = "var(--font-ui-smaller)";
		for (const p of items) {
			const L = config.loads[p.load] ?? {};
			const sets = done.get(String(p.exercise).toLowerCase()) ?? [];
			totalDone += Math.min(sets.length, Number(p.sets) || 0);
			totalSets += Number(p.sets) || 0;
			const row = card.createDiv();
			row.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;padding:4px 0;";
			const info = row.createDiv();
			info.style.cssText = "flex:1 1 220px;min-width:0;";
			const title = info.createDiv();
			title.createEl("strong", { text: `${p.slot} ` });
			const a = title.createEl("a", { text: p.exercise, cls: "internal-link", href: p.exercise });
			a.onclick = (e) => { e.preventDefault(); app.workspace.openLinkText(p.exercise, args.path, e.ctrlKey || e.metaKey); };
			title.createSpan({ text: ` ${L.icon ?? ""}` });
			const weight = p.weight === null || p.weight === undefined || p.weight === "" ? "? kg" : Number(p.weight) === 0 ? "bodyweight" : `${p.weight} kg`;
			const detail = [`${p.sets} × ${String(p.reps).replace("-", "–")} @ ${weight}`, p.last ? `last ${p.last}` : "new: find a working weight", p.kept ? "kept" : p.replaces ? `swap for ${p.replaces}` : ""].filter(Boolean).join(" · ");
			info.createDiv({ cls: "mod-muted", text: detail }).style.fontSize = "var(--font-ui-smaller)";
			const status = info.createDiv({ text: sets.length ? `${sets.length >= p.sets ? "✅" : "⏳"} ${sets.length}/${p.sets}: ${sets.map((l) => `${l.weight}×${l.reps}`).join(", ")}` : `⬜ 0/${p.sets}` });
			status.style.fontSize = "var(--font-ui-smaller)";

			const btn = row.createEl("button", { text: "Log set", cls: sets.length >= p.sets ? "" : "mod-cta" });
			btn.onclick = () => {
				const lastSet = sets[sets.length - 1];
				run("Scripts/logPlannedSet.js", {
					exercise: p.exercise,
					reps: lastSet ? Number(lastSet.reps) : Number(String(p.reps).split("-").pop()) || "",
					weight: lastSet ? Number(lastSet.weight) : p.weight ?? "",
					workout: split?.label ?? fm.workout_split ?? "",
					page: file.basename,
				});
			};
		}
	}
	root.createDiv({ cls: "mod-muted", text: `Progress: ${totalDone}/${totalSets} sets` });
}

await render();
let pending = null;
const refresh = () => { clearTimeout(pending); pending = setTimeout(() => render().catch(console.error), 150); };
args.component?.registerEvent(app.metadataCache.on("changed", (f) => { if (f.path === args.path) refresh(); }));
args.component?.registerEvent(app.vault.on("modify", (f) => { if (f.path === csv) refresh(); }));
return root;
