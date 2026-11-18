// Meta Bind button (daily note): pick a recipe from Food/Recipes and an amount, then append its
// ingredients, scaled to that amount, to the note's ```macros block as
//   meal:Oatmeal ×1
//   - Oats:40g
// The amount is servings ("1.5") or grams of the finished dish ("450g"). Also updates the `meals` counter.
// Optional args: { path } (defaults to the active note).

const { FuzzySuggestModal, Modal, Setting, Notice } = obsidian;
const run = async (script, a) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, a); };
const M = await run("Scripts/lib/meals.js");

const opts = typeof args === "object" && args ? args : {};
const file = opts.path ? app.vault.getAbstractFileByPath(opts.path) : app.workspace.getActiveFile();
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(file.basename)) {
	new Notice("Open a daily note first.");
	return;
}
const recipes = M.recipes();
if (!recipes.length) {
	new Notice(`No recipes yet. Create one in ${M.RECIPES}.`);
	return;
}

const pickRecipe = () =>
	new Promise((resolve) => {
		class RecipeModal extends FuzzySuggestModal {
			getItems() { return recipes; }
			getItemText(f) { return f.basename; }
			renderSuggestion(match, el) {
				const fm = M.fmOf(match.item);
				el.createDiv({ text: match.item.basename });
				el.createEl("small", {
					text: [fm.meal_type, fm.kcal_per_serving != null && `${fm.kcal_per_serving} kcal`, fm.protein_per_serving != null && `${fm.protein_per_serving} g protein`]
						.filter(Boolean).join(" · ") + " per serving",
					cls: "mod-muted",
				});
			}
			onChooseItem(f) { resolve(f); }
			onClose() { setTimeout(() => resolve(null), 0); } // runs before onChooseItem; defer so a pick wins
		}
		const modal = new RecipeModal(app);
		modal.setPlaceholder("Add which recipe?");
		modal.open();
	});

const askAmount = (info) =>
	new Promise((resolve) => {
		const modal = new Modal(app);
		let value = "1";
		let confirmed = false;
		const confirm = () => { confirmed = true; modal.close(); };
		modal.titleEl.setText(info.name);
		new Setting(modal.contentEl)
			.setName("Servings or grams")
			.setDesc(`1 serving ≈ ${Math.round(info.servingG)} g${info.cookedG ? " (finished dish)" : ""}. Type "1.5" or "450g".`)
			.addText((t) => {
				t.setValue(value).onChange((v) => (value = v));
				t.inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") confirm(); });
				setTimeout(() => t.inputEl.select(), 0);
			});
		new Setting(modal.contentEl).addButton((b) => b.setButtonText("Add").setCta().onClick(confirm));
		modal.onClose = () => {
			if (!confirmed) return resolve(null);
			const n = parseFloat(String(value).replace(",", "."));
			resolve(/g\s*$/i.test(value) ? M.itemServings(info, { grams: n }) : n);
		};
		modal.open();
	});

const recipe = await pickRecipe();
if (!recipe) return;
const info = await M.recipeInfo(recipe);
if (!info.items.length) {
	new Notice(`${recipe.basename} has no ingredients yet.`);
	return;
}
const servings = await askAmount(info);
if (!servings || !(servings > 0)) return;

if (!(await M.appendMeals(file, [{ slot: null, info, servings }]))) {
	new Notice("This daily note has no ```macros block. Add the Meals section from Templates/Daily.md.");
	return;
}
new Notice(`Added ${recipe.basename} ×${M.r2(servings)}`);
