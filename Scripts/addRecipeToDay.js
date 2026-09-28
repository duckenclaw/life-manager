// Meta Bind button (daily note): pick a recipe from Food/Recipes and a number of servings,
// then append its ingredients, scaled to those servings, to the note's ```macros block as
//   meal: Oatmeal ×1
//   - Oats:40g
// Also bumps the `meals` habit counter.

const { FuzzySuggestModal, Modal, Setting, Notice } = obsidian;
const RECIPES = "Food/Recipes";

const file = app.workspace.getActiveFile();
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(file.basename)) {
	new Notice("Open a daily note first.");
	return;
}
const recipes = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${RECIPES}/`));
if (!recipes.length) {
	new Notice(`No recipes yet. Create one in ${RECIPES}.`);
	return;
}

const pickRecipe = () =>
	new Promise((resolve) => {
		class RecipeModal extends FuzzySuggestModal {
			getItems() { return recipes; }
			getItemText(f) { return f.basename; }
			renderSuggestion(match, el) {
				const fm = app.metadataCache.getFileCache(match.item)?.frontmatter ?? {};
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

const askServings = (recipe) =>
	new Promise((resolve) => {
		const modal = new Modal(app);
		let value = "1";
		let confirmed = false;
		const confirm = () => { confirmed = true; modal.close(); };
		modal.titleEl.setText(recipe.basename);
		new Setting(modal.contentEl).setName("Servings").addText((t) => {
			t.inputEl.type = "number";
			t.inputEl.step = "0.5";
			t.inputEl.min = "0.5";
			t.setValue(value).onChange((v) => (value = v));
			t.inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") confirm(); });
			setTimeout(() => t.inputEl.select(), 0);
		});
		new Setting(modal.contentEl).addButton((b) => b.setButtonText("Add").setCta().onClick(confirm));
		modal.onClose = () => resolve(confirmed ? parseFloat(value) : null);
		modal.open();
	});

const recipe = await pickRecipe();
if (!recipe) return;
const servings = await askServings(recipe);
if (!servings || !(servings > 0)) return;

// Recipe ingredients: every food line in its macros block, flattened.
const recipeText = await app.vault.read(recipe);
const block = recipeText.match(/```macros\n([\s\S]*?)```/)?.[1] ?? "";
const recipeServings = Math.max(1, Number(app.metadataCache.getFileCache(recipe)?.frontmatter?.servings) || 1);
const factor = servings / recipeServings;
const lines = [];
for (const raw of block.split("\n")) {
	const line = raw.split(" //")[0].trim();
	if (!line || /^id:/i.test(line) || /^(meal|group):/i.test(line)) continue;
	const [name, qty] = line.replace(/^-\s*/, "").split(":").map((s) => s.trim());
	const g = parseFloat(String(qty ?? "100").match(/(\d+(\.\d+)?)/)?.[1] ?? "100");
	if (name) lines.push(`- ${name}:${Math.round(g * factor)}g`);
}
if (!lines.length) {
	new Notice(`${recipe.basename} has no ingredients yet.`);
	return;
}

const mealName = `${recipe.basename.replace(/[:@]/g, " ")} ×${servings}`;
let inserted = false;
await app.vault.process(file, (text) =>
	text.replace(/```macros\n([\s\S]*?)```/, (_, body) => {
		inserted = true;
		const current = body.endsWith("\n") || body === "" ? body : `${body}\n`;
		return "```macros\n" + current + `meal:${mealName}\n${lines.join("\n")}\n` + "```";
	}),
);
if (!inserted) {
	new Notice("This daily note has no ```macros block. Add the Meals section from Templates/Daily.md.");
	return;
}
await app.fileManager.processFrontMatter(file, (fm) => { fm.meals = (Number(fm.meals) || 0) + 1; });
new Notice(`Added ${recipe.basename} ×${servings}`);
