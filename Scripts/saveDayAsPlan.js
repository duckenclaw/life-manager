// Meta Bind button (daily note): save the day's meals as a new meal plan in Food/Meal Plans.
// Only meals that match a recipe are saved (Add recipe / Apply meal plan headers). Batch recipes are
// stored as grams of the finished dish, single-serving ones as servings.
// Optional args: { path } (defaults to the active note).

const { Modal, Setting, Notice, normalizePath } = obsidian;
const run = async (script, a) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, a); };
const M = await run("Scripts/lib/meals.js");

const opts = typeof args === "object" && args ? args : {};
const file = opts.path ? app.vault.getAbstractFileByPath(opts.path) : app.workspace.getActiveFile();
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(file.basename)) {
	new Notice("Open a daily note first.");
	return;
}

const meals = M.dayMeals(await app.vault.read(file));
const items = [];
const skipped = [];
const cache = new Map();
for (const m of meals) {
	const recipe = M.findRecipe(m.recipe);
	if (!recipe) { skipped.push(m.header); continue; }
	if (!cache.has(recipe.path)) cache.set(recipe.path, await M.recipeInfo(recipe));
	items.push(M.itemFromMeal(cache.get(recipe.path), m.slot, m.servings));
}
if (!items.length) {
	new Notice("No recipe meals in this day yet. Add some with 🍽️ Add recipe or 📋 Apply meal plan.");
	return;
}

const ask = () =>
	new Promise((resolve) => {
		const modal = new Modal(app);
		let name = `Day plan ${file.basename}`;
		let isDefault = M.plans().length === 0;
		let confirmed = false;
		const confirm = () => { confirmed = true; modal.close(); };
		modal.titleEl.setText("Save day as meal plan");
		modal.contentEl.createEl("p", { text: `${items.length} meals${skipped.length ? `; not recipes, skipped: ${skipped.join(", ")}` : ""}.`, cls: "mod-muted" });
		new Setting(modal.contentEl).setName("Plan name").addText((t) => {
			t.setValue(name).onChange((v) => (name = v));
			t.inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") confirm(); });
			setTimeout(() => t.inputEl.select(), 0);
		});
		new Setting(modal.contentEl).setName("Make it the default plan").addToggle((t) => t.setValue(isDefault).onChange((v) => (isDefault = v)));
		new Setting(modal.contentEl).addButton((b) => b.setButtonText("Save").setCta().onClick(confirm));
		modal.onClose = () => resolve(confirmed && name.trim() ? { name: name.trim(), isDefault } : null);
		modal.open();
	});

const answer = await ask();
if (!answer) return;
const safe = answer.name.replace(/[\\/:*?"<>|#^[\]]/g, "-");
const path = normalizePath(`${M.PLANS}/${safe}.md`);
if (app.vault.getAbstractFileByPath(path)) {
	new Notice(`${path} already exists. Pick another name.`);
	return;
}
if (!app.vault.getAbstractFileByPath(M.PLANS)) await app.vault.createFolder(M.PLANS);
if (answer.isDefault) {
	for (const p of M.plans()) if (M.fmOf(p).default_plan === true) await app.fileManager.processFrontMatter(p, (fm) => { fm.default_plan = false; });
}
const created = await app.vault.create(path, M.planNote(items, { isDefault: answer.isDefault }));
new Notice(`Saved meal plan ${safe}`);
await app.workspace.getLeaf("tab").openFile(created);
