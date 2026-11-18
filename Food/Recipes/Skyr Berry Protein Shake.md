---
type: recipe
meal_type: breakfast
servings: 1
prep_min: 5
tags:
  - recipe
kcal_per_serving: 578
protein_per_serving: 54.5
carbs_per_serving: 58.1
fat_per_serving: 17
fiber_per_serving: 8.9
serving_g: 605
---
# Skyr Berry Protein Shake

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

rw![[]]> [!note] 1 serving ≈ 600 ml. Amounts in kitchen units:
> - Skyr naturalny: 1 cup
> - Milk 2%: 200 ml
> - Banana: 1 small
> - Frozen berries: 1 handful
> - Whey protein: 1 scoop
> - Peanut butter: 1 tbsp
> - Chia seeds: 1 tbsp

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-skyr-berry-protein-shake
Skyr naturalny: 150g
Milk 2%: 200g
Banana: 100g
Frozen berries: 100g
Whey protein: 30g
Peanut butter: 15g
Chia seeds: 10g
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
> id: recipe-skyr-berry-protein-shake
> ```

## Steps

1. Put the milk in the blender first, then skyr, banana, berries, peanut butter and whey.
2. Blend ~30 s until smooth.
3. Stir in the chia seeds (or blend them in for a smoother texture). Let it rest 5 min to thicken.
