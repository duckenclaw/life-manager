---
type: recipe
meal_type: dinner
servings: 4
prep_min: 120
tags:
  - recipe
  - weight-gain
kcal_per_serving: 716
protein_per_serving: 49.6
carbs_per_serving: 84.4
fat_per_serving: 22.0
fiber_per_serving: 13.8
serving_g: 614
---
# Beef Goulash Soup

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

Thick Hungarian-style soup. Reheats in 3 minutes in the microwave and tastes better on day 2. Keeps 4 days in the fridge, or freeze 2 portions. Part of [[Nutrition Goals]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Beef chuck: about 600 g, cut into 2 cm cubes
> - Onion: 2 large
> - Garlic: 4 cloves
> - Red bell pepper: 1½ peppers
> - Carrot: 2 medium
> - Potatoes: about 6 medium
> - Tomato paste: 2 tbsp
> - Paprika: 2 tbsp (sweet, add a pinch of smoked if you have it)
> - Sunflower oil: 2 tbsp
> - Sour cream: 1 tbsp per bowl
> - Bread: 2 slices per bowl
> - Salt: 1½ tsp, Black pepper and chili flakes: a pinch
> - Water: about 1.5 l

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-beef-goulash-soup
Beef chuck: 600g
Sunflower oil: 30g
Onion: 250g
Garlic: 12g
Red bell pepper: 250g
Carrot: 150g
Potatoes: 700g
Tomato paste: 40g
Paprika: 15g
Salt: 8g
Black pepper: 1g
Chili flakes: 1g
Sour cream: 80g
Bread: 320g
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
> id: recipe-beef-goulash-soup
> ```

## Steps

1. Heat the oil in a large pot and brown the beef in 2 batches. Set aside.
2. Fry the chopped onion for 8 min until soft and golden, then add the garlic for 1 min.
3. Take the pot off the heat, stir in the paprika and tomato paste (paprika burns easily), then return the beef.
4. Add about 1.5 l water, salt and pepper. Cover and simmer gently for 1 h.
5. Add the potatoes, carrot and pepper, all diced. Simmer 25–30 min until the potatoes are soft and start to thicken the soup.
6. Taste for salt. Serve with a spoon of sour cream and 2 slices of bread.
