---
type: recipe
meal_type: lunch
servings: 4
prep_min: 30
tags:
  - recipe
  - weight-gain
kcal_per_serving: 750
protein_per_serving: 47.3
carbs_per_serving: 71.7
fat_per_serving: 30.2
fiber_per_serving: 4.6
serving_g: 470
---
# Greek Chicken Pasta Salad

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

Meant to be eaten cold, so no reheating. Keeps 3–4 days in the fridge. Grab it when you're hungry and can't be bothered. Part of [[Nutrition Goals]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Pasta: 320 g dry (fusilli or penne)
> - Chicken breast: 2 large breasts (about 500 g)
> - Feta: 1 block (200 g)
> - Cucumber: 1 large
> - Tomato: 3 medium
> - Red Bell Pepper: 1
> - Olives: a handful
> - Red onion: ½
> - Olive oil: 4 tbsp (half for frying)
> - Lemon juice: 3 tbsp (1 lemon)
> - Garlic: 1 clove
> - Salt and black pepper; oregano if you have it

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-greek-chicken-pasta-salad
Pasta: 320g
Chicken breast: 500g
Feta: 200g
Cucumber: 300g
Tomato: 300g
Olives: 80g
Red onion: 80g
Olive oil: 50g
Lemon juice: 40g
Garlic: 5g
Salt: 4g
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
> id: recipe-greek-chicken-pasta-salad
> ```

## Steps

1. Cook the pasta 1 min past al dente, rinse it under cold water and drain well.
2. Season the chicken with salt, pepper (and oregano) and fry it in 1 tbsp olive oil, 6–7 min per side. Rest 5 min, then dice.
3. Whisk the dressing: the rest of the olive oil, lemon juice, grated garlic, salt and pepper.
4. Dice the cucumber and tomato, thinly slice the red onion and halve the olives.
5. Toss everything with the dressing and crumble the feta on top. Store in 4 boxes.
