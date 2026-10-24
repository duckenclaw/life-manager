---
type: recipe
meal_type: lunch
servings: 4
prep_min: 15
tags:
  - recipe
---
# Broccoli Corn Salad

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] 4 servings of ~240 g. Weights for pieces and spoonfuls are estimates; adjust them to what you actually use.
> - Sweet corn: canned, drained
> - Cucumber: 2 small
> - Red bell pepper: 1 pepper
> - Carrot: 1 carrot
> - Dill: small bunch
> - Spring onion: 2 stalks
> - Sour cream: ~4 tbsp, 18–20% fat
> - Salt: ½ tsp
> - Black pepper: pinch
> - Garlic powder: dried garlic
> - Onion powder: dried onion

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-broccoli-corn-salad
Broccoli: 200g
Sweet corn: 200g
Cucumber: 240g
Red bell pepper: 120g
Carrot: 60g
Dill: 5g
Spring onion: 30g
Sour cream: 100g
Salt: 3g
Black pepper: 1g
Garlic powder: 2g
Onion powder: 2g
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
> id: recipe-broccoli-corn-salad
> ```

## Steps

1. Cut the broccoli into small florets (blanch 2 min if you prefer it softer).
2. Dice the cucumbers, pepper and carrot; chop the dill and spring onion; drain the corn.
3. Mix everything with the sour cream and spices.
