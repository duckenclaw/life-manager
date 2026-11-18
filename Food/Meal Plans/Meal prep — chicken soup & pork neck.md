---
type: meal-plan
default_plan: true
meals:
- slot: Breakfast (pre-gym)
  recipe: Fruity Cottage Cheese
  servings: 1
- slot: Breakfast (post-gym)
  recipe: Omelette
  servings: 1
- slot: Breakfast (post-gym)
  recipe: Vegetable Salad
  grams: 250
- slot: Lunch
  recipe: Creamy Chicken Soup
  grams: 450
- slot: Lunch
  recipe: Vegetable Salad
  grams: 250
- slot: Evening
  recipe: Daily Protein Shake
  servings: 1
- slot: Dinner
  recipe: Pork Neck with Potatoes in Mushroom Sauce
  grams: 450
plan_kcal: 2896
plan_protein_g: 234.1
plan_carbs_g: 175.4
plan_fat_g: 144.9
plan_fiber_g: 21.3
---

[[Dashboards/Food|← Food]] · [[Food/Nutrition Goals|🎯 Goals]]

A day of meals. Press **📋 Apply meal plan** in a daily note to add all of them at once, then remove or adjust what you didn't eat.

```js-engine
const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };
return await run("Scripts/mealPlanView.js", { path: context.file.path, component });
```
