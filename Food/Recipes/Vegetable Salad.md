---
type: recipe
meal_type: lunch
servings: 3
prep_min: 10
tags:
- recipe
kcal_per_serving: 114
protein_per_serving: 2.3
carbs_per_serving: 12.7
fat_per_serving: 7.2
fiber_per_serving: 3.2
serving_g: 276
---
# Vegetable Salad

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] Weights for pieces and pinches are estimates. Adjust them to match what you actually use. One serving ≈ 280 g; eaten twice a day (with the [[Omelette]] and with lunch).
> - Cucumber: 1 large (~300 g)
> - Tomato: 2–3 (~300 g)
> - Red bell pepper: 1
> - Red onion: ½
> - Olive oil: 1½ tbsp
> - Salt, black pepper, paprika, dried garlic, dried onion

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-vegetable-salad
Cucumber: 300g
Tomato: 300g
Red bell pepper: 150g
Red onion: 55g
Olive oil: 20g
Salt: 1.5g
Black pepper: 0.5g
Paprika: 0.5g
Garlic powder: 0.5g
Onion powder: 0.5g
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

1. Chop the vegetables.
2. Toss with olive oil, salt, pepper and paprika.
