---
type: recipe
meal_type: dinner
servings: 4
prep_min: 30
tags:
  - recipe
kcal_per_serving: 566
protein_per_serving: 48.8
carbs_per_serving: 48.4
fat_per_serving: 19.6
fiber_per_serving: 4.5
serving_g: 334
---
# Peanut Chicken Noodles

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] 4 servings. Weights for pieces and spoonfuls are estimates; adjust them to what you actually use. 200 ml water in the sauce has no nutrients, so it isn't listed.
> - Chicken breast: 650 g, boneless and skinless
> - Red bell pepper: 1 bell pepper
> - Carrot: 1 carrot
> - Onion: 1 small onion
> - Garlic: 3 cloves
> - Ginger: 2 small pieces, grated
> - Sunflower oil: 1 tbsp
> - Peanut butter: sauce: 4 tbsp
> - Soy sauce: sauce: 4 tbsp
> - Rice vinegar: sauce: 2 tbsp (or lime juice)
> - Sweet chili sauce: sauce: 2 tbsp
> - Olive oil: sauce: 1 tsp garlic-basil oil
> - Sriracha: sauce: 1 tbsp
> - Paprika: sauce: 1 tsp smoked paprika
> - Egg noodles: 3 nests, dry (~60 g each)

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-peanut-chicken-noodles
Chicken breast: 650g
Red bell pepper: 120g
Carrot: 60g
Onion: 70g
Garlic: 9g
Ginger: 10g
Sunflower oil: 14g
Peanut butter: 64g
Soy sauce: 64g
Rice vinegar: 30g
Sweet chili sauce: 40g
Olive oil: 5g
Sriracha: 17g
Paprika: 2g
Egg noodles: 180g
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
> id: recipe-peanut-chicken-noodles
> ```

## Steps

1. **Sauce:** whisk the peanut butter, soy sauce, rice vinegar, sweet chili sauce, sriracha, garlic-basil oil, smoked paprika and 200 ml water until smooth.
2. Cook the egg noodles, then drain.
3. Fry the chicken in the sunflower oil until browned, then add the onion, carrot, pepper, garlic and ginger and stir-fry 3–4 min.
4. Pour in the sauce and simmer until it thickens and the chicken is cooked through.
5. Toss with the noodles.
