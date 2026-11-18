---
type: recipe
meal_type: lunch
servings: 3
prep_min: 20
tags:
  - recipe
---
# Boiled Buckwheat

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] Serving = two handfuls, ~150 g cooked. 200 g dry buckwheat cooks to ~500 g, so ~3 servings. Weights marked below are estimates; adjust them to what you actually use.
> - Buckwheat: dry weight
> - Salt: ~½ tsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-boiled-buckwheat
Buckwheat: 200g
Salt: 3g
```

## Nutrition

```js-engine
const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };
const rc = engine.reactive(async () => engine.markdown.create(await run("Scripts/nutrition.js", { path: context.file.path, mode: "recipe" })));
component.registerEvent(app.metadataCache.on("changed", (f) => { if (f.path === context.file.path) rc.refresh(); }));
return rc;
```

> [!info]- Vitamins & minerals (whole recipe)
> ```macrosmicro
> id: recipe-boiled-buckwheat
> ```

## Steps

1. Rinse the buckwheat and boil in salted water (1 : 2) for ~15 min, until the water is absorbed.
