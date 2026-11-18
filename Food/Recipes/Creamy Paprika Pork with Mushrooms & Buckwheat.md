---
type: recipe
meal_type: dinner
servings: 4
prep_min: 50
tags:
  - recipe
  - weight-gain
kcal_per_serving: 831
protein_per_serving: 49.4
carbs_per_serving: 69.7
fat_per_serving: 42.3
fiber_per_serving: 11.0
serving_g: 568
---
# Creamy Paprika Pork with Mushrooms & Buckwheat

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

Pork shoulder (karkówka-style) in a creamy paprika and mushroom sauce over buckwheat, with a quick dill cucumber on the side. Part of [[Nutrition Goals]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Pork shoulder (karkówka): about 800 g, cut into strips
> - Mushrooms: 400 g
> - Onion: 2 medium
> - Garlic: 3 cloves
> - Sour cream: 1 small tub (200 g)
> - Paprika: 1½ tbsp
> - Tomato paste: 2 tbsp
> - Sunflower oil: 1½ tbsp
> - Buckwheat: 280 g dry
> - Cucumber: 1 large
> - Dill: small bunch
> - Salt: 1½ tsp, Black pepper: ½ tsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-creamy-paprika-pork-with-mushrooms-buckwheat
Pork shoulder: 800g
Mushrooms: 400g
Onion: 200g
Garlic: 10g
Sunflower oil: 20g
Sour cream: 200g
Paprika: 12g
Tomato paste: 30g
Buckwheat: 280g
Cucumber: 300g
Dill: 10g
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
> id: recipe-creamy-paprika-pork-with-mushrooms-buckwheat
> ```

## Steps

1. Cook the buckwheat (1 part groats to 2 parts salted water, about 15 min, then let it stand covered).
2. Brown the pork strips in the oil on high heat. Season with salt and pepper and set aside.
3. In the same pan, fry the onion for 5 min, add the sliced mushrooms and cook until their water is gone (8–10 min). Add the garlic.
4. Stir in the paprika and tomato paste, add the pork back with 200 ml water and simmer 15 min until tender.
5. Turn the heat to low and stir in the sour cream (no boiling after this, or it splits).
6. Slice the cucumber, toss it with chopped dill and a pinch of salt, and serve it next to the pork and buckwheat.
