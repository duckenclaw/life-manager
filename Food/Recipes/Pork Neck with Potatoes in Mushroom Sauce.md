---
type: recipe
meal_type: dinner
servings: 6
prep_min: 75
cooked_g: 2500
tags:
- recipe
- meal-prep
kcal_per_serving: 734
protein_per_serving: 41.3
carbs_per_serving: 44.2
fat_per_serving: 43.7
fiber_per_serving: 6.6
serving_g: 538
---
# Pork Neck with Potatoes in Mushroom Sauce

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min · Cooked weight `INPUT[number:cooked_g]` g

Meal-prep dinner. One serving ≈ 420 g of finished food (6 per batch). Weigh everything once after cooking and put it in **Cooked weight**: the meat and wedges lose a lot of water, so raw weight overstates a portion.

## Ingredients (whole recipe)

> [!note] Teaspoons of spice are counted as ~2 g.
> **Pork neck:** 1200 g pork neck (karkówka), 1 tsp olive oil, 1 tsp smoked paprika, 1 tsp sweet paprika, 1 tsp garlic powder, 1 tsp dried thyme, black pepper, salt
> **Creamy mushroom sauce:** 250 g mushrooms, 1 medium onion, 200 g carrots, 3 garlic cloves, 100 ml cooking cream (18%), 1 tsp butter, 1 tsp Dijon mustard, 1 tsp dried thyme, black pepper, salt, 100 ml water or stock
> **Pan-fried potato wedges:** 1200 g potatoes, 1 tbsp olive oil, 1 tsp smoked paprika, 1 tsp garlic powder, salt, black pepper

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-pork-neck-with-potatoes-in-mushroom-sauce
Pork neck: 1200g
Mushrooms: 250g
Onion: 110g
Carrot: 200g
Garlic: 15g
Cooking cream 18%: 100g
Butter: 5g
Dijon mustard: 5g
Water: 100g
Potatoes: 1200g
Olive oil: 19g
Paprika: 6g
Garlic powder: 4g
Dried thyme: 2g
Salt: 10g
Black pepper: 2g
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
> id: recipe-pork-neck-with-potatoes-in-mushroom-sauce
> ```

## Steps

1. Rub the pork with oil and spices, sear and roast or pan-fry until done. Rest and slice.
2. Sauce: soften the onion, carrot and garlic in butter, add the mushrooms and fry until brown. Add water, cream, mustard and thyme, simmer until thick.
3. Wedges: toss the potatoes with oil and spices, pan-fry (or bake) until golden.
