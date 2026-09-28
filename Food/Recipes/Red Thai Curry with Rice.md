---
type: recipe
meal_type: dinner
servings: 5
prep_min: 45
tags:
  - recipe
kcal_per_serving: 572
protein_per_serving: 32.4
carbs_per_serving: 59.7
fat_per_serving: 23
fiber_per_serving: 4.8
serving_g: 388
---
# Red Thai Curry with Rice

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Red curry paste: 3 tsp
> - Chicken thigh: boneless, skinless
> - Onion: 1 medium
> - Garlic: 3 cloves
> - Rice: dry weight
> - Coconut milk: 400 ml can
> - Paprika: 1 tsp
> - Salt: ½ tsp
> - Oyster sauce: 1 tbsp
> - Lime juice: 1 tbsp
> - Garlic powder: 1 tsp
> - Onion powder: 1 tsp
> - Black pepper: ½ tsp
> - Curry powder: 1 tsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-red-thai-curry-with-rice
Red curry paste: 15g
Chicken thigh: 650g
Sweet potato: 500g
Onion: 110g
Garlic: 9g
Ginger: 10g
Rice: 200g
Coconut milk: 400g
Paprika: 2g
Salt: 3g
Oyster sauce: 18g
Lime juice: 15g
Garlic powder: 3g
Onion powder: 2g
Black pepper: 1g
Curry powder: 2g
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
> id: recipe-red-thai-curry-with-rice
> ```

## Steps

1. Cook the rice.
2. Fry the onion, garlic and ginger, then the curry paste and dry spices.
3. Add the chicken and brown it, then the sweet potato and coconut milk.
4. Simmer until the sweet potato is soft (~20 min). Season with oyster sauce, salt and lime juice.
5. Serve over the rice.
