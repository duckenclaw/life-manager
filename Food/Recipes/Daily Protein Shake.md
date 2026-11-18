---
type: recipe
meal_type: snack
servings: 1
prep_min: 5
tags:
  - recipe
  - weight-gain
kcal_per_serving: 574
protein_per_serving: 74.6
carbs_per_serving: 40.9
fat_per_serving: 14.1
fiber_per_serving: 2.7
serving_g: 631
---
# Daily Protein Shake

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

The shake you drink every day. Creatine and electrolytes add no calories, so they aren't in the macros block. Part of [[Nutrition Goals]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Milk 2%: 200 ml
> - Skyr naturalny: 300 ml (about 300 g)
> - Blueberries: 1 handful
> - Peanut butter: 1 spoonful
> - Whey protein: 1 scoop (28 g protein)
> - Creatine monohydrate: 1 scoop (5 g)
> - Electrolytes: 1 serving

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-daily-protein-shake
Milk 2%: 200g
Skyr naturalny: 300g
Blueberries: 80g
Peanut butter: 15g
Whey protein: 36g
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
> id: recipe-daily-protein-shake
> ```

## Steps

1. Blend everything until smooth. Add a little more milk if it's too thick.
