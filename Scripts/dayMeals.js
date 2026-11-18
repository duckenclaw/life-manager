// Daily note view: the day's meals (groups in the ```macros block) with − / + / ✕ per meal, and
// buttons to apply a meal plan, add a recipe or save the day as a plan. The nutrition summary below
// (Scripts/nutrition.js) refreshes by itself when the block changes.
//
// Called from a js-engine block with args = { path, component }. Returns an HTMLElement.

const { Modal, Setting, Notice } = obsidian;
const run = async (script, a) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, a); };
const M = await run("Scripts/lib/meals.js");

const root = createDiv({ cls: "day-meals" });
root.style.cssText = "display:flex;flex-direction:column;gap:6px;margin-bottom:8px;";
let busy = false;
let generation = 0;

const act = async (fn) => {
	if (busy) return;
	busy = true;
	root.style.opacity = "0.6";
	try { await fn(); } catch (e) { console.error(e); new Notice(`Meals: ${e.message}`); }
	finally { busy = false; root.style.opacity = ""; }
	render(); // change events during the edit were skipped
};

const askAmount = (title, servingG, current) =>
	new Promise((resolve) => {
		const modal = new Modal(app);
		let value = String(current);
		let confirmed = false;
		const confirm = () => { confirmed = true; modal.close(); };
		modal.titleEl.setText(title);
		new Setting(modal.contentEl)
			.setName("Servings or grams")
			.setDesc(servingG ? `1 serving ≈ ${Math.round(servingG)} g. Type "1.5" or "450g".` : `Type the number of servings, e.g. "1.5".`)
			.addText((t) => {
				t.setValue(value).onChange((v) => (value = v));
				t.inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") confirm(); });
				setTimeout(() => t.inputEl.select(), 0);
			});
		new Setting(modal.contentEl).addButton((b) => b.setButtonText("Save").setCta().onClick(confirm));
		modal.onClose = () => {
			if (!confirmed) return resolve(null);
			const n = parseFloat(String(value).replace(",", "."));
			if (!(n > 0)) return resolve(null);
			resolve(/g\s*$/i.test(value) && servingG ? M.r2(n / servingG) : n);
		};
		modal.open();
	});

const button = (parent, text, onClick, { cta = false, title } = {}) => {
	const b = parent.createEl("button", { text, cls: cta ? "mod-cta" : "" });
	if (title) b.title = title;
	b.style.cssText = "padding:2px 8px;height:auto;";
	b.onclick = (e) => { e.preventDefault(); onClick(); };
	return b;
};

async function render() {
	const file = app.vault.getAbstractFileByPath(args.path);
	if (!file) return;
	const my = ++generation;
	const meals = M.dayMeals(await app.vault.read(file));
	const all = M.foods();
	const infos = new Map();
	for (const meal of meals) {
		const recipe = M.findRecipe(meal.recipe);
		if (recipe && !infos.has(recipe.path)) infos.set(recipe.path, await M.recipeInfo(recipe, all));
	}
	if (my !== generation) return; // a newer render started meanwhile
	root.empty();

	const bar = root.createDiv();
	bar.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;";
	button(bar, "📋 Apply meal plan", () => act(() => run("Scripts/applyMealPlan.js", { path: file.path })), { cta: true });
	button(bar, "🍽️ Add recipe", () => act(() => run("Scripts/addRecipeToDay.js", { path: file.path })));
	if (meals.length) button(bar, "💾 Save day as plan", () => act(() => run("Scripts/saveDayAsPlan.js", { path: file.path })));

	if (!meals.length) return;

	const table = root.createEl("table");
	table.style.cssText = "width:100%;";
	const head = table.createEl("thead").createEl("tr");
	for (const h of ["Meal", "Amount", "kcal", "Protein", ""]) head.createEl("th", { text: h });
	const body = table.createEl("tbody");

	for (const meal of meals) {
		const recipe = M.findRecipe(meal.recipe);
		const info = recipe ? infos.get(recipe.path) : null;
		const { total, weight } = M.itemsNutrition(meal.items, all);
		const servingG = info?.servingG ?? (meal.servings ? weight / meal.servings : 0);
		const portionG = info ? meal.servings * info.servingG : weight;
		// Batch dishes step by 50 g of the finished dish; single-serving recipes by half a serving.
		const step = info && info.servings > 1 && info.servingG ? 50 / info.servingG : 0.5;

		const tr = body.createEl("tr");
		const name = tr.createEl("td");
		if (meal.slot) name.createEl("small", { text: `${meal.slot} · `, cls: "mod-muted" });
		if (recipe) {
			const a = name.createEl("a", { text: meal.recipe, cls: "internal-link", href: recipe.path });
			a.onclick = (e) => { e.preventDefault(); app.workspace.openLinkText(recipe.path, file.path, e.ctrlKey || e.metaKey); };
		} else name.createSpan({ text: meal.recipe });

		const amount = tr.createEl("td");
		amount.style.whiteSpace = "nowrap";
		button(amount, "−", () => act(async () => {
			const next = M.r2(meal.servings - step);
			if (next > 0) await M.rescaleMeal(file, meal.i, next);
		}), { title: info?.servings > 1 ? "−50 g" : "−½ serving" });
		const label = amount.createEl("a", { text: ` ×${M.r2(meal.servings)} · ${Math.round(portionG)} g ` });
		label.title = "Change the amount";
		label.style.cursor = "pointer";
		label.onclick = (e) => { e.preventDefault(); act(async () => {
			const n = await askAmount(meal.recipe, servingG, M.r2(meal.servings));
			if (n) await M.rescaleMeal(file, meal.i, n);
		}); };
		button(amount, "+", () => act(() => M.rescaleMeal(file, meal.i, M.r2(meal.servings + step))), { title: info?.servings > 1 ? "+50 g" : "+½ serving" });

		tr.createEl("td", { text: String(Math.round(total.kcal)) });
		tr.createEl("td", { text: `${M.r1(total.protein)} g` });
		const del = tr.createEl("td");
		button(del, "✕", () => act(() => M.removeMeal(file, meal.i)), { title: "Remove this meal (I didn't eat it)" });
	}
}

await render();
args.component?.registerEvent(app.metadataCache.on("changed", (f) => { if (f.path === args.path && !busy) render(); }));
return root;
