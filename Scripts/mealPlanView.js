// Meal plan note view (Food/Meal Plans/*.md): edit the plan's meals and see its statistics.
// - Editor: − / + per item (50 g for batch dishes kept in grams, ½ serving otherwise), click the
//   amount or slot to type it, ✕ to remove, ➕ Add recipe, ⭐ default plan.
// - Statistics: totals vs daily targets, per-meal breakdown, macro energy split, protein per kg
//   (latest weight in Daily/), and how many days each meal-prep batch lasts on this plan.
// Totals are saved to frontmatter (plan_kcal, plan_protein_g, …) for Dashboards/Food.md.
//
// Called from a js-engine block with args = { path, component }. Returns an HTMLElement.

const { FuzzySuggestModal, Modal, Setting, Notice, debounce } = obsidian;
const run = async (script, a) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, a); };
const M = await run("Scripts/lib/meals.js");

const root = createDiv({ cls: "meal-plan" });
root.style.cssText = "display:flex;flex-direction:column;gap:10px;";
let generation = 0;
let busy = false;

const file = () => app.vault.getAbstractFileByPath(args.path);
const editItems = async (fn) => {
	if (busy) return;
	busy = true;
	try {
		await app.fileManager.processFrontMatter(file(), (fm) => { fm.meals = fn(M.list(fm.meals).map((m) => ({ ...m }))); });
	} finally { busy = false; }
	render();
};

const button = (parent, text, onClick, { cta = false, title } = {}) => {
	const b = parent.createEl("button", { text, cls: cta ? "mod-cta" : "" });
	if (title) b.title = title;
	b.style.cssText = "padding:2px 8px;height:auto;";
	b.onclick = (e) => { e.preventDefault(); onClick(); };
	return b;
};

const prompt = (title, fields) =>
	new Promise((resolve) => {
		const modal = new Modal(app);
		const values = Object.fromEntries(fields.map((f) => [f.key, String(f.value ?? "")]));
		let confirmed = false;
		const confirm = () => { confirmed = true; modal.close(); };
		modal.titleEl.setText(title);
		fields.forEach((f, i) => {
			new Setting(modal.contentEl).setName(f.name).setDesc(f.desc ?? "").addText((t) => {
				t.setValue(values[f.key]).onChange((v) => (values[f.key] = v));
				if (f.options?.length) {
					const id = `meal-plan-${f.key}-${Date.now()}`;
					const dl = modal.contentEl.createEl("datalist", { attr: { id } });
					for (const o of f.options) dl.createEl("option", { attr: { value: o } });
					t.inputEl.setAttr("list", id);
				}
				t.inputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") confirm(); });
				if (i === 0) setTimeout(() => t.inputEl.select(), 0);
			});
		});
		new Setting(modal.contentEl).addButton((b) => b.setButtonText("Save").setCta().onClick(confirm));
		modal.onClose = () => resolve(confirmed ? values : null);
		modal.open();
	});

// "450g" → { grams: 450 }, "1.5" → { servings: 1.5 }
const parseAmount = (s) => {
	const n = parseFloat(String(s).replace(",", "."));
	if (!(n > 0)) return null;
	return /g\s*$/i.test(s) ? { grams: Math.round(n) } : { servings: M.r2(n) };
};
const withAmount = (item, amount) => {
	const out = { slot: item.slot ?? "", recipe: item.recipe };
	return amount.grams != null ? { ...out, grams: amount.grams } : { ...out, servings: amount.servings };
};

const pickRecipe = () =>
	new Promise((resolve) => {
		class RecipeModal extends FuzzySuggestModal {
			getItems() { return M.recipes(); }
			getItemText(f) { return f.basename; }
			renderSuggestion(match, el) {
				const fm = M.fmOf(match.item);
				el.createDiv({ text: match.item.basename });
				el.createEl("small", { text: [fm.meal_type, fm.kcal_per_serving != null && `${fm.kcal_per_serving} kcal/serving`].filter(Boolean).join(" · "), cls: "mod-muted" });
			}
			onChooseItem(f) { resolve(f); }
			onClose() { setTimeout(() => resolve(null), 0); }
		}
		const modal = new RecipeModal(app);
		modal.setPlaceholder("Add which recipe to the plan?");
		modal.open();
	});

const latestWeight = () => {
	const days = app.vault.getMarkdownFiles()
		.filter((f) => f.path.startsWith("Daily/") && /^\d{4}-\d{2}-\d{2}$/.test(f.basename))
		.sort((a, b) => b.basename.localeCompare(a.basename));
	for (const d of days) {
		const w = parseFloat(M.fmOf(d).weight);
		if (w > 0) return { kg: w, date: d.basename };
	}
	return null;
};

const table = (parent, headers, rows, { align } = {}) => {
	const t = parent.createEl("table");
	const tr = t.createEl("thead").createEl("tr");
	headers.forEach((h, i) => { const th = tr.createEl("th", { text: h }); if (align?.[i] === "r") th.style.textAlign = "right"; });
	const body = t.createEl("tbody");
	for (const row of rows) {
		const r = body.createEl("tr");
		row.forEach((cell, i) => {
			const td = r.createEl("td");
			if (align?.[i] === "r") td.style.textAlign = "right";
			if (typeof cell === "function") cell(td);
			else td.setText(String(cell ?? ""));
		});
	}
	return t;
};

async function render() {
	const f = file();
	if (!f) return;
	const my = ++generation;
	const fm = M.fmOf(f);
	const items = M.list(fm.meals);
	const { entries, unknown } = await M.resolvePlan(items.filter((m) => m && m.recipe));
	if (my !== generation) return;
	root.empty();

	const targets = M.targets();
	const total = M.zero();
	let totalG = 0;
	const rows = entries.map((e) => {
		const n = M.add(M.zero(), e.info.perServing, e.servings);
		M.add(total, n);
		const g = e.servings * e.info.servingG;
		totalG += g;
		return { ...e, n, g, index: items.indexOf(e.item) };
	});

	// ── header: default + add ──
	const bar = root.createDiv();
	bar.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;align-items:center;";
	button(bar, "➕ Add recipe", async () => {
		const recipe = await pickRecipe();
		if (!recipe) return;
		const info = await M.recipeInfo(recipe);
		const slots = [...new Set(items.map((m) => m.slot).filter(Boolean))];
		const v = await prompt(recipe.basename, [
			{ key: "slot", name: "Meal", desc: "e.g. Lunch. Meals with the same name are grouped.", value: slots.at(-1) ?? "", options: slots },
			{ key: "amount", name: "Servings or grams", desc: `1 serving ≈ ${Math.round(info.servingG)} g. Type "1" or "450g".`, value: info.servings > 1 ? `${Math.round(info.servingG / 10) * 10}g` : "1" },
		]);
		const amount = v && parseAmount(v.amount);
		if (!amount) return;
		await editItems((list) => [...list, withAmount({ slot: v.slot.trim(), recipe: recipe.basename }, amount)]);
	}, { cta: true });
	if (fm.default_plan === true) bar.createSpan({ text: "⭐ Default plan: 📋 Apply meal plan uses it first." });
	else button(bar, "☆ Make default", async () => {
		for (const p of M.plans()) if (p.path !== f.path && M.fmOf(p).default_plan === true) await app.fileManager.processFrontMatter(p, (x) => { x.default_plan = false; });
		await app.fileManager.processFrontMatter(f, (x) => { x.default_plan = true; });
		render();
	});

	if (!rows.length) {
		root.createEl("p", { text: "No meals yet. Press ➕ Add recipe.", cls: "mod-muted" });
		return;
	}

	// ── editor + per-meal breakdown ──
	root.createEl("h3", { text: "Meals" });
	let lastSlot = null;
	table(root, ["Meal", "Recipe", "Amount", "kcal", "Protein", "Carbs", "Fat", "Fiber", "% kcal", ""],
		rows.map((r) => {
			const showSlot = r.item.slot !== lastSlot;
			lastSlot = r.item.slot;
			const byGrams = r.item.grams != null;
			return [
				(td) => {
					if (!showSlot) return;
					const a = td.createEl("a", { text: r.item.slot || "—" });
					a.title = "Rename this meal";
					a.style.cursor = "pointer";
					a.onclick = async () => {
						const v = await prompt("Rename meal", [{ key: "slot", name: "Meal", value: r.item.slot ?? "" }]);
						if (v) await editItems((list) => list.map((m) => (m.slot === r.item.slot ? { ...m, slot: v.slot.trim() } : m)));
					};
				},
				(td) => {
					const a = td.createEl("a", { text: r.info.name, cls: "internal-link", href: r.info.file.path });
					a.onclick = (e) => { e.preventDefault(); app.workspace.openLinkText(r.info.file.path, f.path, e.ctrlKey || e.metaKey); };
				},
				(td) => {
					td.style.whiteSpace = "nowrap";
					const step = (dir) => editItems((list) => list.map((m, i) => {
						if (i !== r.index) return m;
						if (m.grams != null) return { ...m, grams: Math.max(10, Number(m.grams) + dir * 50) };
						return { ...m, servings: Math.max(0.25, M.r2((Number(m.servings) || 1) + dir * 0.5)) };
					}));
					button(td, "−", () => step(-1), { title: byGrams ? "−50 g" : "−½ serving" });
					const label = td.createEl("a", { text: byGrams ? ` ${r.item.grams} g ` : ` ×${M.r2(r.servings)} · ${Math.round(r.g)} g ` });
					label.title = byGrams ? `×${M.r2(r.servings)} servings. Click to change.` : "Click to change";
					label.style.cursor = "pointer";
					label.onclick = async () => {
						const v = await prompt(r.info.name, [{ key: "amount", name: "Servings or grams", desc: `1 serving ≈ ${Math.round(r.info.servingG)} g. Type "1" or "450g".`, value: byGrams ? `${r.item.grams}g` : M.r2(r.servings) }]);
						const amount = v && parseAmount(v.amount);
						if (amount) await editItems((list) => list.map((m, i) => (i === r.index ? withAmount(m, amount) : m)));
					};
					button(td, "+", () => step(1), { title: byGrams ? "+50 g" : "+½ serving" });
				},
				Math.round(r.n.kcal),
				`${M.r1(r.n.protein)} g`,
				`${M.r1(r.n.carbs)} g`,
				`${M.r1(r.n.fat)} g`,
				`${M.r1(r.n.fiber)} g`,
				total.kcal ? `${Math.round((r.n.kcal / total.kcal) * 100)}%` : "",
				(td) => button(td, "✕", () => editItems((list) => list.filter((_, i) => i !== r.index)), { title: "Remove from plan" }),
			];
		}),
		{ align: [null, null, null, "r", "r", "r", "r", "r", "r", null] });

	// Per meal slot
	const slots = new Map();
	for (const r of rows) {
		const k = r.item.slot || "—";
		const s = slots.get(k) ?? { n: M.zero(), g: 0 };
		M.add(s.n, r.n);
		s.g += r.g;
		slots.set(k, s);
	}

	// ── statistics ──
	root.createEl("h3", { text: "Statistics" });
	table(root, ["", "Plan", "Target", ""],
		[["kcal", "kcal", ""], ["protein", "Protein", " g"], ["carbs", "Carbs", " g"], ["fat", "Fat", " g"], ["fiber", "Fiber", " g"]].map(([k, label, unit]) => {
			const pct = targets[k] ? (total[k] / targets[k]) * 100 : 0;
			return [label, `${M.fmt(k, total[k])}${unit}`, `${targets[k]}${unit}`, `${M.bar(pct)} ${Math.round(pct)}%`];
		}),
		{ align: [null, "r", "r", null] });

	const pK = total.protein * 4, cK = total.carbs * 4, fK = total.fat * 9, mK = pK + cK + fK || 1;
	const w = latestWeight();
	const facts = root.createEl("ul");
	facts.createEl("li", { text: `Energy from protein ${Math.round((pK / mK) * 100)}% · carbs ${Math.round((cK / mK) * 100)}% · fat ${Math.round((fK / mK) * 100)}%` });
	if (w) facts.createEl("li", { text: `Protein ${M.r1(total.protein / w.kg)} g per kg (weight ${w.kg} kg on ${w.date}) · ${Math.round(total.kcal / w.kg)} kcal per kg` });
	facts.createEl("li", { text: `${rows.length} items in ${slots.size} meals · ~${Math.round(totalG / 100) / 10} kg of food · ${M.r1(total.fiber / (total.kcal / 1000 || 1))} g fiber per 1000 kcal` });
	const gap = targets.kcal - total.kcal;
	facts.createEl("li", { text: gap > 0 ? `${Math.round(gap)} kcal under the target: add a snack, bread or a bigger portion.` : `${Math.round(-gap)} kcal over the target.` });

	root.createEl("h4", { text: "Per meal" });
	table(root, ["Meal", "kcal", "Protein", "Carbs", "Fat", "g", "% kcal"],
		[...slots].map(([k, s]) => [k, Math.round(s.n.kcal), `${M.r1(s.n.protein)} g`, `${M.r1(s.n.carbs)} g`, `${M.r1(s.n.fat)} g`, Math.round(s.g), total.kcal ? `${Math.round((s.n.kcal / total.kcal) * 100)}%` : ""]),
		{ align: [null, "r", "r", "r", "r", "r", "r"] });

	// Batch coverage: servings of each multi-serving recipe eaten per day.
	const batches = new Map();
	for (const r of rows) {
		if (r.info.servings <= 1) continue;
		const b = batches.get(r.info.file.path) ?? { info: r.info, perDay: 0 };
		b.perDay += r.servings;
		batches.set(r.info.file.path, b);
	}
	if (batches.size) {
		root.createEl("h4", { text: "Meal prep: how long a batch lasts" });
		table(root, ["Recipe", "Batch", "Per day", "Lasts"],
			[...batches.values()].map(({ info, perDay }) => [
				info.name,
				`${info.servings} servings · ${Math.round(info.cookedG ?? info.rawG)} g${info.cookedG ? "" : " raw"}`,
				`×${M.r2(perDay)} · ${Math.round(perDay * info.servingG)} g`,
				`${M.r1(info.servings / perDay)} days`,
			]),
			{ align: [null, "r", "r", "r"] });
		const raw = [...batches.values()].filter((b) => !b.info.cookedG).map((b) => b.info.name);
		if (raw.length) root.createEl("p", { text: `Gram portions of ${raw.join(", ")} use the raw ingredient weight. Weigh the finished batch once and set its cooked_g (Cooked weight) for exact portions.`, cls: "mod-muted" });
	}

	const missing = [...new Set(entries.flatMap((e) => e.info.missing))];
	if (unknown.length || missing.length) {
		const warn = root.createDiv({ cls: "callout", attr: { "data-callout": "warning" } });
		warn.style.padding = "8px 12px";
		if (unknown.length) warn.createDiv({ text: `Recipes not found in ${M.RECIPES}: ${unknown.join(", ")}` });
		if (missing.length) warn.createDiv({ text: `Ingredients not found (not counted): ${missing.join(", ")}` });
	}

	// Save totals for the dashboard (only when they change, so this doesn't loop).
	const updates = {
		plan_kcal: M.fmt("kcal", total.kcal),
		plan_protein_g: M.fmt("protein", total.protein),
		plan_carbs_g: M.fmt("carbs", total.carbs),
		plan_fat_g: M.fmt("fat", total.fat),
		plan_fiber_g: M.fmt("fiber", total.fiber),
	};
	if (Object.entries(updates).some(([k, v]) => fm[k] !== v)) {
		busy = true;
		try { await app.fileManager.processFrontMatter(f, (x) => Object.assign(x, updates)); } finally { busy = false; }
	}
}

await render();
const refresh = debounce(() => { if (!busy) render(); }, 300, true);
args.component?.registerEvent(app.metadataCache.on("changed", (changed) => {
	if (changed.path === args.path || changed.path.startsWith(`${M.RECIPES}/`) || changed.path.startsWith("Food/Ingredients/")) refresh();
}));
return root;
