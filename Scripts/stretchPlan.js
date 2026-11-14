// Renders the day's stretching: the fixed full-body routine (trainingConfig.json → stretching.fullBody)
// plus the targeted stretches for the muscles trained (frontmatter `stretch_plan`, picked by
// Scripts/planWorkout.js), each with free-exercise-db images and a cue. "Done" ticks `stretching`.
//
// Called from a js-engine block with args = { path, component }. Returns an HTMLElement.

const run = async (script, a) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, a); };
const config = JSON.parse(await app.vault.adapter.read("Scripts/trainingConfig.json"));
const S = config.stretching;
const lib = await run("Scripts/lib/exerciseDb.js");
const list = (v) => (Array.isArray(v) ? v : v == null || v === "" ? [] : [v]);
let db = [];
try { db = await lib.load(); } catch (e) { console.error(e); }
const byName = new Map(db.map((x) => [x.name.toLowerCase(), x]));
const groupOf = (name) => Object.entries(S.targeted).find(([, names]) => names.includes(name))?.[0];

const root = createDiv({ cls: "stretch-plan" });

function item(parent, name) {
	const custom = S.custom?.[name];
	const entry = byName.get(String(custom?.imagesFrom ?? name).toLowerCase());
	const card = parent.createDiv();
	card.style.cssText = "border:1px solid var(--background-modifier-border);border-radius:8px;padding:8px;display:flex;flex-direction:column;gap:4px;";
	card.createEl("strong", { text: name });
	const imgs = card.createDiv();
	imgs.style.cssText = "display:flex;gap:4px;";
	for (const url of lib.imageUrls(entry).slice(0, 2)) {
		const img = imgs.createEl("img", { attr: { src: url, alt: name, loading: "lazy" } });
		img.style.cssText = "width:calc(50% - 2px);max-width:160px;border-radius:4px;";
	}
	const cue = custom?.cue ?? entry?.instructions?.[0] ?? "";
	if (cue) card.createDiv({ text: cue }).style.fontSize = "var(--font-ui-smaller)";
	if (!entry && !custom) card.createDiv({ cls: "mod-muted", text: "Not found in the exercise database" });
}

function section(title, names) {
	if (!names.length) return;
	root.createEl("h4", { text: title });
	const grid = root.createDiv();
	grid.style.cssText = "display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;";
	names.forEach((n) => item(grid, n));
}

let lastKey = null;
async function render() {
	const file = app.vault.getAbstractFileByPath(args.path);
	if (!file) return;
	const fm = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
	const key = JSON.stringify([!!fm.stretching, list(fm.stretch_plan)]);
	if (key === lastKey) return; // other frontmatter edits: don't reload the images
	lastKey = key;
	root.empty();

	const top = root.createDiv();
	top.style.cssText = "display:flex;flex-wrap:wrap;align-items:center;gap:8px;";
	top.createSpan({ cls: "mod-muted", text: `Hold ${S.hold}. Breathe slowly, no bouncing.` });
	const btn = top.createEl("button", { text: fm.stretching ? "✅ Stretched" : "Done stretching", cls: fm.stretching ? "" : "mod-cta" });
	btn.onclick = () => app.fileManager.processFrontMatter(file, (f) => { f.stretching = !f.stretching; });

	const targeted = list(fm.stretch_plan);
	const byGroup = new Map();
	for (const n of targeted) {
		const g = groupOf(n) ?? "other";
		if (!byGroup.has(g)) byGroup.set(g, []);
		byGroup.get(g).push(n);
	}
	for (const [g, names] of byGroup) section(`🎯 ${config.groups[g]?.label ?? "Targeted"}`, names);
	section("🔁 Full-body routine", S.fullBody);
}

await render();
args.component?.registerEvent(app.metadataCache.on("changed", (f) => { if (f.path === args.path) render().catch(console.error); }));
return root;
