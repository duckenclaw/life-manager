---
type: recipe
meal_type: dinner
servings: 6
prep_min: 20
tags:
  - recipe
---
# Fried Ground Pork Neck

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] Serving = 75 g cooked. 600 g raw pork cooks down to ~450 g, so the recipe makes ~6 servings. Weights marked below are estimates; adjust them to what you actually use.
> - Ground pork: ground pork neck (USDA generic ground pork)
> - Salt: to taste
> - Black pepper: pinch
> - Garlic powder: dried garlic, ~½ tsp
> - Onion powder: dried onion, ~½ tsp
> - Dried tomatoes: ~1 tsp flakes
> - Paprika: ~1 tsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-fried-ground-pork-neck
Ground pork: 600g
Salt: 5g
Black pepper: 1g
Garlic powder: 2g
Onion powder: 2g
Dried tomatoes: 5g
Paprika: 2g
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
> id: recipe-fried-ground-pork-neck
> ```

## Steps

1. Fry the ground pork until browned and cooked through.
2. Season with the spices near the end.
