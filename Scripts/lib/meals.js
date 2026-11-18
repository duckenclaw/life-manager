// Shared meal helpers for the daily note and meal plans (Scripts/addRecipeToDay.js, applyMealPlan.js,
// saveDayAsPlan.js, dayMeals.js, mealPlanView.js). Load with run("Scripts/lib/meals.js").
// Returns an object of functions.
//
// A day's meals live in its ```macros block (Macros plugin syntax), one group per meal:
//   meal:Lunch · Creamy Chicken Soup ×1.04
//   - Chicken thigh:86.7g
//   - Rice:17.3g
// The header is "<slot> · <recipe> ×<servings>". The slot is optional (Add recipe leaves it out).
//
// A meal plan (Food/Meal Plans/*.md) keeps its items in frontmatter:
//   meals: [{ slot, recipe, servings } | { slot, recipe, grams }]
// `grams` is a portion of the finished dish. It's converted with the recipe's `cooked_g` (weight of
// the whole finished batch) when set, otherwise with the raw weight of its ingredients.

const RECIPES = "Food/Recipes";
const PLANS = "Food/Meal Plans";
const NUTRIENTS = {
	kcal: ["calories"],
	protein: ["protein"],
	carbs: ["carbs"],
	fat: ["fat"],
	fiber: ["fiber"],
};
const FIBER_TARGET = 35; // same as Scripts/nutrition.js

const list = (v) => (Array.isArray(v) ? v : v == null || v === "" ? [] : [v]);
const zero = () => Object.fromEntries(Object.keys(NUTRIENTS).map((k) => [k, 0]));
const add = (a, b, factor = 1) => { for (const k in a) a[k] += (b[k] ?? 0) * factor; return a; };
const r1 = (v) => Math.round(v * 10) / 10;
const r2 = (v) => Math.round(v * 100) / 100;
const fmt = (k, v) => (k === "kcal" ? Math.round(v) : r1(v));
const grams = (s) => {
	const m = String(s ?? "").match(/(\d+(\.\d+)?)/);
	return m ? parseFloat(m[1]) : NaN;
};
const fmOf = (file) => app.metadataCache.getFileCache(file)?.frontmatter ?? {};

// ── ingredients (same lookup as Scripts/nutrition.js and the Macros plugin) ──
const foodFolder = () => app.plugins?.plugins?.macros?.settings?.storageFolder ?? "Food/Ingredients";
const foods = () => app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${foodFolder()}/`));
function findFood(query, all = foods()) {
	const q = query.toLowerCase();
	const exact = all.filter((f) => f.basename.toLowerCase() === q);
	if (exact.length === 1) return exact[0];
	const partial = all.filter((f) => f.name.toLowerCase().includes(q));
	return partial.length === 1 ? partial[0] : null;
}
function foodNutrition(food, g) {
	const fm = fmOf(food);
	const serving = grams(fm.serving_size) || 100;
	const n = zero();
	for (const [k, keys] of Object.entries(NUTRIENTS)) {
		const key = keys.find((x) => fm[x] != null);
		n[k] = ((parseFloat(fm[key]) || 0) * g) / serving;
	}
	return n;
}

// ── macros block parsing ─────────────────────────────────────────────────────
const BLOCK = /```macros\n([\s\S]*?)```/;
const blockOf = (text) => text.match(BLOCK)?.[1] ?? "";

// Ingredient lines of a block: [{ name, g, group }], `g` NaN when no amount is given.
function parseItems(block) {
	const items = [];
	let group = null;
	for (const raw of block.split("\n")) {
		const line = raw.split(" //")[0].trim();
		if (!line || /^id:/i.test(line)) continue;
		const header = line.match(/^(?:meal|group):\s*(.*)$/i);
		if (header) { group = header[1].trim(); continue; }
		const bullet = line.startsWith("-");
		if (!bullet) group = null;
		const [name, qty] = (bullet ? line.slice(1).trim() : line).split(":").map((s) => s.trim());
		if (name) items.push({ name, g: qty == null ? NaN : grams(qty), group });
	}
	return items;
}

// Nutrition of a list of ingredient lines. Missing foods are listed, not counted.
function itemsNutrition(items, all = foods()) {
	const total = zero();
	const missing = [];
	let weight = 0;
	for (const it of items) {
		const food = findFood(it.name, all);
		if (!food) { missing.push(it.name); continue; }
		const g = Number.isFinite(it.g) ? it.g : grams(fmOf(food).serving_size) || 100;
		add(total, foodNutrition(food, g));
		weight += g;
	}
	return { total, weight, missing };
}

// ── recipes ──────────────────────────────────────────────────────────────────
const recipes = () => app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${RECIPES}/`));
const findRecipe = (name) => {
	const q = String(name ?? "").replace(/^\[\[|\]\]$/g, "").split("|")[0].split("/").pop().trim().toLowerCase();
	return recipes().find((f) => f.basename.toLowerCase() === q) ?? null;
};

// { file, name, servings, rawG, cookedG, servingG, perServing, missing, lines }
async function recipeInfo(file, all = foods()) {
	const fm = fmOf(file);
	const text = await app.vault.cachedRead(file);
	const items = parseItems(blockOf(text));
	const { total, weight, missing } = itemsNutrition(items, all);
	const servings = Math.max(1, Number(fm.servings) || 1);
	const cookedG = Number(fm.cooked_g) > 0 ? Number(fm.cooked_g) : null;
	return {
		file,
		name: file.basename,
		servings,
		rawG: weight,
		cookedG,
		servingG: (cookedG ?? weight) / servings,
		perServing: add(zero(), total, 1 / servings),
		missing,
		items,
	};
}

// Plan item → servings of the recipe.
function itemServings(info, item) {
	if (Number(item.grams) > 0 && info.servingG > 0) return r2(Number(item.grams) / info.servingG);
	return Number(item.servings) > 0 ? Number(item.servings) : 1;
}

// Ingredient lines of a recipe scaled to `servings` (0.1 g precision keeps pinches of spice).
function scaledLines(info, servings) {
	const factor = servings / info.servings;
	return info.items
		.filter((it) => it.name)
		.map((it) => `- ${it.name}:${r1((Number.isFinite(it.g) ? it.g : 100) * factor)}g`);
}

// ── meal headers ─────────────────────────────────────────────────────────────
const clean = (s) => String(s ?? "").replace(/[:@\n]/g, " ").replace(/\s+/g, " ").trim();
const mealHeader = (slot, recipe, servings) => `${slot ? `${clean(slot)} · ` : ""}${clean(recipe)} ×${r2(servings)}`;
function parseHeader(header) {
	const m = header.match(/^(.*?)(?:\s*×\s*(\d+(?:\.\d+)?))?\s*$/);
	let name = (m?.[1] ?? header).trim();
	const servings = m?.[2] != null ? parseFloat(m[2]) : 1;
	let slot = null;
	const dot = name.lastIndexOf(" · ");
	if (dot >= 0) { slot = name.slice(0, dot).trim(); name = name.slice(dot + 3).trim(); }
	return { slot, recipe: name, servings };
}

// Meals in a note's macros block: [{ i, header, slot, recipe, servings, items, start, end }].
// start/end are line indexes in the block (end exclusive). Lines outside a meal are ignored.
function dayMeals(text) {
	const lines = blockOf(text).split("\n");
	const meals = [];
	let cur = null;
	lines.forEach((raw, idx) => {
		const line = raw.split(" //")[0].trim();
		const header = line.match(/^(?:meal|group):\s*(.*)$/i);
		if (header) {
			if (cur) cur.end = idx;
			cur = { i: meals.length, header: header[1].trim(), ...parseHeader(header[1].trim()), lines: [], start: idx, end: lines.length };
			meals.push(cur);
		} else if (cur && line.startsWith("-")) {
			cur.lines.push(raw);
		} else if (cur && line) {
			cur.end = idx;
			cur = null;
		}
	});
	for (const m of meals) m.items = parseItems(m.lines.join("\n"));
	return meals;
}

// Rewrite the lines of the macros block with fn(lines) → lines. Returns false if there is no block.
async function editBlock(file, fn) {
	let found = false;
	await app.vault.process(file, (text) =>
		text.replace(BLOCK, (_, body) => {
			found = true;
			const lines = body.replace(/\n$/, "").split("\n");
			const out = fn(lines).filter((l, i, a) => !(l === "" && i === a.length - 1));
			return "```macros\n" + out.join("\n") + "\n```";
		}),
	);
	return found;
}

// The `meals` counter can also be changed by hand, so it's adjusted, not recounted.
const bumpMeals = async (file, delta) => {
	await app.fileManager.processFrontMatter(file, (fm) => { fm.meals = Math.max(0, (Number(fm.meals) || 0) + delta); });
};

// entries: [{ slot, info, servings }]. Appends one meal group per entry.
async function appendMeals(file, entries) {
	const ok = await editBlock(file, (lines) => {
		const out = lines.filter((l, i) => l.trim() || i < lines.length - 1);
		for (const e of entries) out.push(`meal:${mealHeader(e.slot, e.info.name, e.servings)}`, ...scaledLines(e.info, e.servings));
		return out;
	});
	if (ok) await bumpMeals(file, entries.length);
	return ok;
}

async function removeMeal(file, index) {
	const meal = dayMeals(await app.vault.read(file))[index];
	if (!meal) return false;
	await editBlock(file, (lines) => [...lines.slice(0, meal.start), ...lines.slice(meal.end)]);
	await bumpMeals(file, -1);
	return true;
}

// Scale a meal's ingredient lines (keeps any edits made to them) and update the header.
async function rescaleMeal(file, index, servings) {
	const meal = dayMeals(await app.vault.read(file))[index];
	if (!meal || !(servings > 0)) return false;
	const factor = servings / (meal.servings || 1);
	await editBlock(file, (lines) => {
		const out = [...lines];
		out[meal.start] = `meal:${mealHeader(meal.slot, meal.recipe, servings)}`;
		for (let i = meal.start + 1; i < meal.end; i++) {
			out[i] = out[i].replace(/^(\s*-\s*[^:]+:\s*)(\d+(?:\.\d+)?)(\s*g)?/, (_, a, n, u) => `${a}${r1(parseFloat(n) * factor)}${u ?? "g"}`);
		}
		return out;
	});
	return true;
}

// ── plans ────────────────────────────────────────────────────────────────────
const plans = () => app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${PLANS}/`) && fmOf(f).type === "meal-plan");
const planItems = (file) => list(fmOf(file).meals).filter((m) => m && m.recipe);
const defaultPlan = () => plans().find((f) => fmOf(f).default_plan === true) ?? null;

// Resolve plan items → [{ item, info, servings }] plus unknown recipe names.
async function resolvePlan(items) {
	const all = foods();
	const out = [];
	const unknown = [];
	const cache = new Map();
	for (const item of items) {
		const file = findRecipe(item.recipe);
		if (!file) { unknown.push(item.recipe); continue; }
		if (!cache.has(file.path)) cache.set(file.path, await recipeInfo(file, all));
		const info = cache.get(file.path);
		out.push({ item, info, servings: itemServings(info, item) });
	}
	return { entries: out, unknown };
}

const targets = () => {
	const s = app.plugins?.plugins?.macros?.settings ?? {};
	return {
		kcal: s.dailyCaloriesTarget ?? 2000,
		protein: s.dailyProteinTarget ?? 150,
		carbs: s.dailyCarbsTarget ?? 250,
		fat: s.dailyFatTarget ?? 65,
		fiber: FIBER_TARGET,
	};
};
const bar = (pct) => { const n = Math.max(0, Math.min(10, Math.round(pct / 10))); return "▓".repeat(n) + "░".repeat(10 - n); };

// Text for a plan note, used by Save day as plan. `items` as in frontmatter.
function planNote(items, { isDefault = false } = {}) {
	const yaml = items.map((m) => [
		`  - slot: ${JSON.stringify(m.slot ?? "")}`,
		`    recipe: ${JSON.stringify(m.recipe)}`,
		m.grams != null ? `    grams: ${m.grams}` : `    servings: ${m.servings ?? 1}`,
	].join("\n")).join("\n");
	return `---\ntype: meal-plan\ndefault_plan: ${isDefault}\nmeals:\n${yaml || "  []"}\n---\n` + PLAN_BODY;
}
const PLAN_BODY = `
[[Dashboards/Food|← Food]] · [[Food/Nutrition Goals|🎯 Goals]]

A day of meals. Press **📋 Apply meal plan** in a daily note to add all of them at once, then remove or adjust what you didn't eat.

\`\`\`js-engine
const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };
return await run("Scripts/mealPlanView.js", { path: context.file.path, component });
\`\`\`
`;

// Plan item for a meal already in a day: batch recipes as grams of the finished dish, single ones as servings.
function itemFromMeal(info, slot, servings) {
	if (info.servings > 1) return { slot: slot ?? "", recipe: info.name, grams: Math.round((servings * info.servingG) / 10) * 10 };
	return { slot: slot ?? "", recipe: info.name, servings: r2(servings) };
}

return {
	RECIPES, PLANS, NUTRIENTS, list, zero, add, r1, r2, fmt, grams, bar, fmOf,
	foods, findFood, foodNutrition, parseItems, itemsNutrition, blockOf,
	recipes, findRecipe, recipeInfo, itemServings, scaledLines,
	mealHeader, parseHeader, dayMeals, appendMeals, removeMeal, rescaleMeal, bumpMeals,
	plans, planItems, defaultPlan, resolvePlan, targets, planNote, PLAN_BODY, itemFromMeal,
};
