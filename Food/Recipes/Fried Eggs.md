---
type: recipe
meal_type: breakfast
servings: 1
prep_min: 5
tags:
  - recipe
---
# Fried Eggs

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] 1 serving = all 3 eggs. Weights marked below are estimates; adjust them to what you actually use.
> - Egg: 3 eggs
> - Salt: pinch
> - Black pepper: pinch

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-fried-eggs
Egg: 150g
Salt: 1g
Black pepper: 1g
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
> id: recipe-fried-eggs
> ```

## Steps

1. Fry the eggs in a hot pan.
2. Season with salt and pepper.
