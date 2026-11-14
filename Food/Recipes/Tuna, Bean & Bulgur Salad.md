---
type: recipe
meal_type: lunch
servings: 4
prep_min: 20
tags:
  - recipe
  - weight-gain
kcal_per_serving: 629
protein_per_serving: 42.8
carbs_per_serving: 84.2
fat_per_serving: 16.3
fiber_per_serving: 19.6
serving_g: 467
---
# Tuna, Bean & Bulgur Salad

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

A cold, filling salad from the pantry: mostly tins plus bulgur. Keeps 3 days in the fridge. Part of [[Nutrition Goals]].

## Ingredients (whole recipe)

> [!note] Weights for pieces and spoonfuls are estimates. Adjust them to match what you actually use.
> - Bulgur: 240 g dry
> - Canned tuna: 3 cans in water (about 390 g drained)
> - Red kidney beans: 1 can (400 g drained)
> - Sweet corn: 1 can (about 280 g drained)
> - Red bell pepper: 1 large
> - Cucumber: ½ large
> - Spring onion: 3 stalks
> - Olive oil: 4 tbsp
> - Lime juice: 3 tbsp
> - Salt, black pepper, chili flakes to taste

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-tuna-bean-bulgur-salad
Bulgur: 240g
Canned tuna: 390g
Red kidney beans: 400g
Sweet corn: 280g
Red bell pepper: 200g
Cucumber: 200g
Spring onion: 60g
Olive oil: 50g
Lime juice: 40g
Salt: 4g
Black pepper: 1g
Chili flakes: 1g
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
> id: recipe-tuna-bean-bulgur-salad
> ```

## Steps

1. Cook the bulgur (1 part to 2 parts salted water, about 10 min), then spread it out to cool.
2. Drain and rinse the beans and corn. Drain the tuna and flake it.
3. Dice the pepper and cucumber and slice the spring onion.
4. Whisk the olive oil, lime juice, salt, pepper and chili flakes, then toss everything together.
