---
type: recipe
meal_type: breakfast
servings: 1
prep_min: 5
tags:
  - recipe
---
# Nutty Protein Shake

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

> [!note] 1 big shake (~810 g). Weights for pieces and spoonfuls are estimates; adjust them to what you actually use.
> - Whey protein: 1 scoop
> - Milk 2%: 200 ml
> - Skyr naturalny: 300 ml ≈ 300 g
> - Peanut butter: 2 tbsp
> - Pistachio cream: 2 tbsp
> - Banana: 1 big, peeled
> - Frozen cherries: 1 handful (sour cherries / wiśnie)

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-nutty-protein-shake
Whey protein: 30g
Milk 2%: 200g
Skyr naturalny: 300g
Peanut butter: 32g
Pistachio cream: 30g
Banana: 140g
Frozen cherries: 80g
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
> id: recipe-nutty-protein-shake
> ```

## Steps

1. Milk first, then skyr, banana, cherries, nut butters and whey.
2. Blend ~30 s until smooth.
