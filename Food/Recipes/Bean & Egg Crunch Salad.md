---
type: recipe
meal_type: lunch
servings: 11
prep_min: 15
tags:
  - recipe
---
# Bean & Egg Crunch Salad

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] Serving = 75 g. The salad weighs ~840 g, so ~11 servings. Weights marked below are estimates; adjust them to what you actually use.
> - Red kidney beans: beans; kidney beans assumed
> - Cucumber: 1 medium
> - Red bell pepper: 1 pepper
> - Red onion: 1 medium
> - Boiled egg: 3 eggs
> - Salt: to taste
> - Black pepper: pinch
> - Garlic powder: dried garlic, ~½ tsp
> - Onion powder: dried onion, ~½ tsp
> - Dried tomatoes: ~1 tsp flakes
> - Paprika: ~1 tsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-bean-egg-crunch-salad
Red kidney beans: 200g
Cucumber: 200g
Red bell pepper: 120g
Cabbage: 50g
Red onion: 110g
Boiled egg: 150g
Salt: 4g
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
> id: recipe-bean-egg-crunch-salad
> ```

## Steps

1. Hard-boil and chop the eggs.
2. Chop the vegetables and mix with the beans.
3. Season and toss.
