---
type: recipe
meal_type: lunch
servings: 4
prep_min: 35
tags:
  - recipe
  - weight-gain
kcal_per_serving: 801
protein_per_serving: 55.8
carbs_per_serving: 97.3
fat_per_serving: 20.5
fiber_per_serving: 5.3
serving_g: 522
---
# Honey Garlic Chicken Thighs with Rice

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

Sticky, sweet and salty glaze over juicy thighs, with rice and veggies. Fine eaten cold straight from the box too. Part of [[Nutrition Goals]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Chicken thigh: about 900 g boneless, skinless
> - Rice: 360 g dry (about 2 cups)
> - Honey: 3 tbsp
> - Soy sauce: 4 tbsp
> - Garlic: 5 cloves
> - Ginger: a thumb, grated
> - Lime juice: 1 tbsp
> - Sunflower oil: 3 tbsp
> - Broccoli: 1 large head
> - Red bell pepper: 1 large
> - Spring onion: 2 stalks to finish

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-honey-garlic-chicken-thighs-with-rice
Chicken thigh: 900g
Rice: 360g
Honey: 60g
Soy sauce: 60g
Garlic: 15g
Ginger: 10g
Lime juice: 15g
Sunflower oil: 40g
Broccoli: 400g
Red bell pepper: 200g
Spring onion: 30g
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
> id: recipe-honey-garlic-chicken-thighs-with-rice
> ```

## Steps

1. Cook the rice.
2. Mix the sauce: honey, soy sauce, grated garlic and ginger, lime juice and 3 tbsp water.
3. Cut the thighs into large pieces and fry them in 2 tbsp oil on high heat, 5–6 min per side, until browned.
4. Pour in the sauce and let it bubble 2–3 min, turning the chicken, until it's sticky and glossy.
5. In another pan, stir-fry the broccoli and pepper in the remaining oil for 4–5 min, so they stay crunchy.
6. Split the rice, veggies and chicken into 4 boxes and pour the leftover sauce over the rice. Top with spring onion.
