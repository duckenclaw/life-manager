---
type: recipe
meal_type: breakfast
servings: 1
prep_min: 10
tags:
- recipe
- meal-prep
kcal_per_serving: 592
protein_per_serving: 57
carbs_per_serving: 10.2
fat_per_serving: 35.7
fiber_per_serving: 0.6
serving_g: 389
---
# Omelette

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

Post-gym breakfast, eaten with a [[Vegetable Salad]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and pinches are estimates. Adjust them to match what you actually use.
> - Eggs: 2 (~110 g without shells)
> - Milk 2%: 100 ml
> - Smoked chicken: 100 g
> - Gouda: 75 g
> - Salt, black pepper, dried garlic, paprika

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-omelette
Eggs: 110g
Milk 2%: 100g
Smoked chicken: 100g
Gouda: 75g
Salt: 1g
Black pepper: 0.5g
Garlic powder: 1g
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
> id: recipe-omelette
> ```

## Steps

1. Whisk the eggs with the milk and spices.
2. Add the chopped smoked chicken and half the grated gouda.
3. Cook covered on low heat; top with the rest of the gouda at the end.
