---
type: recipe
meal_type: breakfast
servings: 1
prep_min: 10
tags:
  - recipe
kcal_per_serving: 326
protein_per_serving: 29.7
carbs_per_serving: 2
fat_per_serving: 21
fiber_per_serving: 0
serving_g: 225
---
# Untitled

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-untitled
Chicken thigh:25g
Eggs:200g
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
> id: recipe-untitled
> ```

## Steps

1. 
