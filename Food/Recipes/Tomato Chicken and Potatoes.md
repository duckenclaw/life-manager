---
type: recipe
meal_type: dinner
servings: 4
prep_min: 50
tags:
  - recipe
kcal_per_serving: 530
protein_per_serving: 43.3
carbs_per_serving: 54.1
fat_per_serving: 16
fiber_per_serving: 7.5
serving_g: 514
---
# Tomato Chicken and Potatoes

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] 4 servings. Weights for pieces and spoonfuls are estimates; adjust them to what you actually use.
> - Sunflower oil: 1 tbsp for the meat + 1½ tbsp for the potatoes
> - Paprika: smoked: 1 tsp for the meat + 1 tsp for the sauce
> - Garlic powder: ½ tsp
> - Salt: meat + potatoes, ~1¼ tsp
> - Onion: 1 onion
> - Garlic: 2 cloves
> - Tomato passata: 200–250 g
> - Tomato paste: 1 tbsp
> - Chili flakes: ½ tsp
> - Soy sauce: 1 tsp
> - Potatoes: raw weight
> - Dill: fresh, a few sprigs
> - Grated cheese: a handful; amount not given

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-tomato-chicken-and-potatoes
Chicken breast: 600g
Sunflower oil: 35g
Paprika: 4g
Garlic powder: 1.5g
Salt: 7g
Black pepper: 1g
Onion: 110g
Garlic: 6g
Tomato passata: 225g
Tomato paste: 16g
Chili flakes: 1g
Soy sauce: 5g
Potatoes: 1000g
Dill: 5g
Grated cheese: 40g
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
> id: recipe-tomato-chicken-and-potatoes
> ```

## Steps

1. **Potatoes:** cut into wedges or cubes, toss with 1–2 tbsp oil and salt, and roast at 200 °C for ~35–40 min.
2. **Meat:** cut the chicken into pieces, season with smoked paprika, garlic powder, salt and pepper, and brown in 1 tbsp oil. Set aside.
3. **Sauce:** in the same pan, soften the onion, then the garlic. Add the tomato paste, passata, smoked paprika, chili flakes, soy sauce and pepper, and simmer 5–10 min.
4. Return the chicken to the sauce and simmer until cooked through.
5. Serve over the potatoes, topped with dill and grated cheese.
