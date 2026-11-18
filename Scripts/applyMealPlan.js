// Meta Bind button (daily note): add every meal of a meal plan (Food/Meal Plans) to the day's
// ```macros block in one go. With one plan it's applied straight away; with several, a picker opens
// with the ⭐ default plan on top (Enter applies it). Sets `meal_plan` in frontmatter.
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
const plans = M.plans().sort((a, b) => (M.fmOf(b).default_plan === true) - (M.fmOf(a).default_plan === true) || a.basename.localeCompare(b.basename));
if (!plans.length) {
	new Notice(`No meal plans yet. Make one on the Food dashboard or with 💾 Save day as plan.`);
	return;
}

const pickPlan = () =>
	new Promise((resolve) => {
		class PlanModal extends FuzzySuggestModal {
			getItems() { return plans; }
			getItemText(f) { return f.basename; }
			renderSuggestion(match, el) {
				const fm = M.fmOf(match.item);
				el.createDiv({ text: `${fm.default_plan === true ? "⭐ " : ""}${match.item.basename}` });
				el.createEl("small", {
					text: [`${M.planItems(match.item).length} meals`, fm.plan_kcal != null && `${fm.plan_kcal} kcal`, fm.plan_protein_g != null && `${fm.plan_protein_g} g protein`].filter(Boolean).join(" · "),
					cls: "mod-muted",
				});
			}
			onChooseItem(f) { resolve(f); }
			onClose() { setTimeout(() => resolve(null), 0); }
		}
		const modal = new PlanModal(app);
		modal.setPlaceholder("Apply which meal plan?");
		modal.open();
	});

const confirmAgain = (name) =>
	new Promise((resolve) => {
		const modal = new Modal(app);
		let ok = false;
		modal.titleEl.setText("Apply again?");
		modal.contentEl.createEl("p", { text: `This day already has ${name} applied. Add all its meals a second time?` });
		new Setting(modal.contentEl)
			.addButton((b) => b.setButtonText("Cancel").onClick(() => modal.close()))
			.addButton((b) => b.setButtonText("Add again").setWarning().onClick(() => { ok = true; modal.close(); }));
		modal.onClose = () => resolve(ok);
		modal.open();
	});

const plan = plans.length === 1 ? plans[0] : await pickPlan();
if (!plan) return;

const applied = M.list(M.fmOf(file).meal_plan).map(String);
if (applied.some((p) => p.includes(plan.basename)) && !(await confirmAgain(plan.basename))) return;

const { entries, unknown } = await M.resolvePlan(M.planItems(plan));
if (!entries.length) {
	new Notice(`${plan.basename} has no meals${unknown.length ? ` (recipes not found: ${unknown.join(", ")})` : ""}.`);
	return;
}
const ok = await M.appendMeals(file, entries.map((e) => ({ slot: e.item.slot, info: e.info, servings: e.servings })));
if (!ok) {
	new Notice("This daily note has no ```macros block. Add the Meals section from Templates/Daily.md.");
	return;
}
await app.fileManager.processFrontMatter(file, (fm) => {
	const link = `[[${plan.basename}]]`;
	const cur = M.list(fm.meal_plan);
	fm.meal_plan = cur.includes(link) ? cur : [...cur, link];
});
new Notice(`Added ${entries.length} meals from ${plan.basename}${unknown.length ? `. Recipes not found: ${unknown.join(", ")}` : ""}`);
