---
type: recipe
meal_type: lunch
servings: 5
prep_min: 10
tags:
  - recipe
---
# Vegetable Salad

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] Weights for pieces and pinches are estimates. Adjust them to match what you actually use.
> - Cucumber: 1 medium
> - Red bell pepper: 1
> - Red kidney beans: ½ can, drained
> - Red onion: ½
> - Olive oil: 1 tbsp
> - Salt: pinch
> - Black pepper: pinch
> - Paprika: pinch

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-vegetable-salad
Cucumber: 200g
Red bell pepper: 120g
Red kidney beans: 120g
Lettuce: 100g
Red onion: 55g
Olive oil: 14g
Salt: 1g
Black pepper: 1g
Paprika: 1g
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
> id: recipe-vegetable-salad
> ```

## Steps

1. Chop the vegetables and rinse the beans.
2. Toss with olive oil, salt, pepper and paprika.
