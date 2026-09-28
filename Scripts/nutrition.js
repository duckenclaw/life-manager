// Nutrition totals for the ```macros block of a note (recipe or daily note).
// Food notes live in the Macros storage folder; their values are per `serving_size` grams.
// Parsing follows the Macros plugin: `Food: 200g`, and `meal: Name` followed by `- Food: 40g`.
// Results are also written to the note's frontmatter so dashboards can query them.
//
// Called from js-engine blocks with args = { path, mode: "recipe" | "day" }. Returns markdown.

const { path, mode = "day" } = args;
const file = app.vault.getAbstractFileByPath(path);
if (!file) return "";

const NUTRIENTS = {
	kcal: { keys: ["calories"], label: "kcal", unit: "" },
	protein: { keys: ["protein"], label: "Protein", unit: "g" },
	carbs: { keys: ["carbs"], label: "Carbs", unit: "g" },
	fat: { keys: ["fat"], label: "Fat", unit: "g" },
	fiber: { keys: ["fiber"], label: "Fiber", unit: "g" },
	sugar: { keys: ["sugar", "sugars"], label: "Sugar", unit: "g" },
};
const FIBER_TARGET = 30; // g/day; the other targets come from Macros settings

const macros = app.plugins.plugins.macros;
const folder = macros?.settings?.storageFolder ?? "Food/Ingredients";
const foods = app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${folder}/`));

// Same lookup as Macros: exact name (case-insensitive), else a single partial match.
const findFood = (query) => {
	const q = query.toLowerCase();
	const exact = foods.filter((f) => f.basename.toLowerCase() === q);
	if (exact.length === 1) return exact[0];
	const partial = foods.filter((f) => f.name.toLowerCase().includes(q));
	return partial.length === 1 ? partial[0] : null;
};
const grams = (s) => {
	const m = String(s ?? "").match(/(\d+(\.\d+)?)/);
	return m ? parseFloat(m[1]) : NaN;
};
const zero = () => Object.fromEntries(Object.keys(NUTRIENTS).map((k) => [k, 0]));
const add = (a, b, factor = 1) => { for (const k in a) a[k] += b[k] * factor; return a; };
const fmt = (k, v) => (k === "kcal" ? Math.round(v) : Math.round(v * 10) / 10);

// ── parse the macros block ──────────────────────────────────────────────────
const text = await app.vault.cachedRead(file);
const block = text.match(/```macros\n([\s\S]*?)```/)?.[1] ?? "";
const items = [];
let group = null;
for (const raw of block.split("\n")) {
	const line = raw.split(" //")[0].trim();
	if (!line || /^id:/i.test(line)) continue;
	const header = line.match(/^(?:meal|group):\s*(.*)$/i);
	if (header) { group = header[1].replace(/@\s*\d{1,2}:\d{2}/, "").trim(); continue; }
	const bullet = line.startsWith("-");
	if (!bullet) group = null;
	const [name, qty] = (bullet ? line.slice(1).trim() : line).split(":").map((s) => s.trim());
	if (name) items.push({ group, name, qty: qty == null ? NaN : grams(qty) });
}

const missing = [];
const rows = [];
for (const it of items) {
	const food = findFood(it.name);
	if (!food) { missing.push(it.name); continue; }
	const fm = app.metadataCache.getFileCache(food)?.frontmatter ?? {};
	const serving = grams(fm.serving_size) || 100;
	const g = Number.isFinite(it.qty) ? it.qty : serving;
	const n = zero();
	for (const [k, { keys }] of Object.entries(NUTRIENTS)) {
		const key = keys.find((x) => fm[x] != null);
		n[k] = ((parseFloat(fm[key]) || 0) * g) / serving;
	}
	rows.push({ ...it, food, g, n });
}
const total = rows.reduce((acc, r) => add(acc, r.n), zero());

const writeFrontmatter = async (updates) => {
	const cur = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
	if (Object.entries(updates).some(([k, v]) => cur[k] !== v)) {
		await app.fileManager.processFrontMatter(file, (fm) => Object.assign(fm, updates));
	}
};
const warning = missing.length
	? `\n\n> [!warning] Not found in \`${folder}\`: ${[...new Set(missing)].join(", ")}. Add them with the **+** button or fix the name.`
	: "";

// ── recipe: per-ingredient table, total and per serving ─────────────────────
if (mode === "recipe") {
	if (!rows.length) return `*Add ingredients to the block above to see nutrition.*${warning}`;
	const servings = Math.max(1, Number(app.metadataCache.getFileCache(file)?.frontmatter?.servings) || 1);
	const perServing = add(zero(), total, 1 / servings);
	const cols = Object.keys(NUTRIENTS);
	const head = `| Ingredient | g | ${cols.map((k) => NUTRIENTS[k].label).join(" | ")} |\n|---|---:|${cols.map(() => "---:").join("|")}|`;
	const line = (label, g, n) => `| ${label} | ${g} | ${cols.map((k) => fmt(k, n[k])).join(" | ")} |`;
	const totalGrams = rows.reduce((s, r) => s + r.g, 0);
	const table = [
		head,
		...rows.map((r) => line(`[[${r.food.path}\\|${r.food.basename}]]`, Math.round(r.g), r.n)),
		line("**Total**", `**${Math.round(totalGrams)}**`, total),
		line(`**Per serving** (÷${servings})`, `**${Math.round(totalGrams / servings)}**`, perServing),
	].join("\n");
	await writeFrontmatter({
		kcal_per_serving: fmt("kcal", perServing.kcal),
		protein_per_serving: fmt("protein", perServing.protein),
		carbs_per_serving: fmt("carbs", perServing.carbs),
		fat_per_serving: fmt("fat", perServing.fat),
		fiber_per_serving: fmt("fiber", perServing.fiber),
		serving_g: Math.round(totalGrams / servings),
	});
	return table + warning;
}

// ── day: totals vs targets, per-meal breakdown ──────────────────────────────
const s = macros?.settings ?? {};
const targets = {
	kcal: s.dailyCaloriesTarget ?? 2000,
	protein: s.dailyProteinTarget ?? 150,
	carbs: s.dailyCarbsTarget ?? 250,
	fat: s.dailyFatTarget ?? 65,
	fiber: FIBER_TARGET,
};
const cur = app.metadataCache.getFileCache(file)?.frontmatter ?? {};
if (rows.length || cur.kcal != null) {
	await writeFrontmatter({
		kcal: fmt("kcal", total.kcal),
		protein_g: fmt("protein", total.protein),
		carbs_g: fmt("carbs", total.carbs),
		fat_g: fmt("fat", total.fat),
		fiber_g: fmt("fiber", total.fiber),
	});
}
if (!rows.length) return `*No food logged yet. Use **Add recipe** or the **+** button.*${warning}`;

const bar = (pct) => { const n = Math.max(0, Math.min(10, Math.round(pct / 10))); return "▓".repeat(n) + "░".repeat(10 - n); };
const summary = [
	"| | Eaten | Target | |",
	"|---|---:|---:|---|",
	...Object.keys(NUTRIENTS).map((k) => {
		const { label, unit } = NUTRIENTS[k];
		const t = targets[k];
		const pct = t ? (total[k] / t) * 100 : null;
		return `| ${label} | ${fmt(k, total[k])} ${unit} | ${t ? `${t} ${unit}` : "–"} | ${pct == null ? "" : `${bar(pct)} ${Math.round(pct)}%`} |`;
	}),
].join("\n");

const meals = new Map();
for (const r of rows) {
	const key = r.group ?? "Other";
	meals.set(key, add(meals.get(key) ?? zero(), r.n));
}
const perMeal = [...meals].map(([name, n]) =>
	`- **${name}**: ${fmt("kcal", n.kcal)} kcal · ${fmt("protein", n.protein)} g protein · ${fmt("fiber", n.fiber)} g fiber`).join("\n");

return `${summary}\n\n${perMeal}${warning}`;
