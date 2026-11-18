---
type: recipe
meal_type: breakfast
servings: 1
prep_min: 2
tags:
  - recipe
---
# Fruity Cottage Cheese

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] 1 tub = 1 serving. Weights for pieces and spoonfuls are estimates; adjust them to what you actually use.
> - Serek wiejski wysokobiałkowy: 1 tub
> - Fruit jam: 1 tbsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-fruity-cottage-cheese
Serek wiejski wysokobiałkowy: 200g
Fruit jam: 20g
Walnuts: 30g
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
> id: recipe-fruity-cottage-cheese
> ```

## Steps

1. Top the cottage cheese with jam and walnuts.
