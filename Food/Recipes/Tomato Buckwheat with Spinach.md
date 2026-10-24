---
type: recipe
meal_type: dinner
servings: 6
prep_min: 35
tags:
  - recipe
kcal_per_serving: 174
protein_per_serving: 6.7
carbs_per_serving: 38
fat_per_serving: 1.4
fiber_per_serving: 7.5
serving_g: 207
---
# Tomato Buckwheat with Spinach

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] Serving = 200 g. The finished dish weighs ~1.2 kg, so ~6 servings. Weights marked below are estimates; adjust them to what you actually use.
> - Buckwheat: dry weight
> - Spinach: estimate
> - Canned tomatoes: marinated, 1 can
> - Tomato paste: estimate, 1 small can
> - Red bell pepper: 1 pepper
> - Carrot: 2 carrots
> - Salt: to taste
> - Black pepper: pinch
> - Garlic powder: dried garlic, ~½ tsp
> - Onion powder: dried onion, ~½ tsp
> - Dried tomatoes: ~1 tsp flakes
> - Paprika: ~1 tsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-tomato-buckwheat-with-spinach
Buckwheat:200g
Spinach:150g
Canned tomatoes:400g
Tomato paste:70g
Red bell pepper:120g
Carrot:120g
Salt:5g
Black pepper:1g
Garlic powder:2g
Onion powder:2g
Dried tomatoes:5g
Paprika:2g
Onion:150g
Garlic:15g
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
> id: recipe-tomato-buckwheat-with-spinach
> ```

## Steps

1. Boil the buckwheat.
2. Fry the carrot, onion, garlic and pepper, then add the tomatoes, tomato paste and spices; simmer 10 min.
3. Stir in the spinach until wilted, then the buckwheat.
