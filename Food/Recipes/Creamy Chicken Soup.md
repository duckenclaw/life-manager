---
type: recipe
meal_type: lunch
servings: 12
prep_min: 60
cooked_g: 5200
tags:
- recipe
- meal-prep
kcal_per_serving: 283
protein_per_serving: 20.2
carbs_per_serving: 29.8
fat_per_serving: 9
fiber_per_serving: 2.8
serving_g: 472
---
# Creamy Chicken Soup

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min · Cooked weight `INPUT[number:cooked_g]` g

Meal-prep soup. One serving ≈ 430 g of finished soup (12 per pot). Weigh the finished pot once and put it in **Cooked weight** so gram portions in [[Food/Meal Plans/Meal prep — chicken soup & pork neck|meal plans]] are exact.

## Ingredients (whole recipe)

> [!note] Weights for pieces are estimates. Adjust them to match what you actually use.
> - Chicken thighs: 1000 g
> - Rice: 200 g dry
> - Potatoes: 800 g
> - Carrots: 3 medium (~180 g)
> - Peas: 100 g
> - Red onion: 1 medium
> - Garlic: 3 cloves
> - Green onion: 3 stalks
> - Cooking cream (18%): 150 ml
> - Water: 3 L
> - Butter: 25 g
> - Olive oil: 1 tbsp
> - Bay leaf: 3 (no calories, not counted)
> - Salt, black pepper, paprika 1 tsp, thyme 1 tsp, lemon juice 1–2 tsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-creamy-chicken-soup
Chicken thigh: 1000g
Rice: 200g
Potatoes: 800g
Carrot: 180g
Green peas: 100g
Red onion: 110g
Garlic: 15g
Spring onion: 45g
Cooking cream 18%: 150g
Water: 3000g
Butter: 25g
Olive oil: 14g
Paprika: 2g
Dried thyme: 1g
Lemon juice: 8g
Salt: 8g
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
> id: recipe-creamy-chicken-soup
> ```

## Steps

1. Brown the onion, carrot and garlic in the butter and oil.
2. Add the chicken, water, bay leaves, paprika and thyme. Simmer 25 min, then take the chicken out and shred it.
3. Add the potatoes and rice, simmer 15 min. Add the peas, the chicken and the cream, heat through.
4. Season with salt, pepper and lemon juice, top with green onion.
