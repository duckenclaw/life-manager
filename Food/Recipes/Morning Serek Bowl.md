---
type: recipe
meal_type: breakfast
servings: 1
prep_min: 2
tags:
  - recipe
  - weight-gain
kcal_per_serving: 422
protein_per_serving: 35.7
carbs_per_serving: 14.3
fat_per_serving: 26.6
fiber_per_serving: 3.0
serving_g: 240
---
# Morning Serek Bowl

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

Pre-training bowl. Easy extra calories: a second spoon of peanut butter adds about 90 kcal. Part of [[Nutrition Goals]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Serek wiejski wysokobiałkowy: 1 tub (200 g)
> - Peanut butter: 1 spoonful
> - Mixed nuts: 1 small handful

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-morning-serek-bowl
Serek wiejski wysokobiałkowy: 200g
Peanut butter: 15g
Mixed nuts: 25g
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
> id: recipe-morning-serek-bowl
> ```

## Steps

1. Tip the serek into a bowl, stir in the peanut butter and top with the nuts.
