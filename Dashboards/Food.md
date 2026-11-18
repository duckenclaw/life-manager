# 🍽️ Food

`BUTTON[new-recipe]` `BUTTON[new-meal-plan]` `BUTTON[food-search]` `BUTTON[food-manual]`

🎯 [[Food/Nutrition Goals|Nutrition goals]]: 3000 kcal · 170 g protein · 90 g fat · 375 g carbs

Ingredients come from USDA through the **Macros** plugin (values per serving, usually 100 g). Recipes list ingredient weights in grams; their per-serving numbers update each time you open the recipe.

## Meal plans
A whole day of meals. **📋 Apply meal plan** in a daily note adds them all at once; remove or adjust what you didn't eat there. Open a plan to edit it and see its statistics. **💾 Save day as plan** in a daily note makes a new plan from a logged day.
```dataview
TABLE WITHOUT ID
  file.link AS Plan,
  choice(default_plan, "⭐", "") AS Default,
  length(meals) AS Items,
  plan_kcal AS kcal,
  plan_protein_g AS "Protein g",
  plan_carbs_g AS "Carbs g",
  plan_fat_g AS "Fat g",
  plan_fiber_g AS "Fiber g"
FROM "Food/Meal Plans"
WHERE type = "meal-plan"
SORT default_plan DESC, file.name ASC
```

## Recipes
```dataview
TABLE WITHOUT ID
  file.link AS Recipe,
  meal_type AS Meal,
  servings AS Servings,
  serving_g AS "g/serving",
  kcal_per_serving AS kcal,
  protein_per_serving AS "Protein g",
  carbs_per_serving AS "Carbs g",
  fat_per_serving AS "Fat g",
  fiber_per_serving AS "Fiber g",
  prep_min AS "Prep min"
FROM "Food/Recipes"
SORT meal_type ASC, file.name ASC
```

## Last 14 days
```dataview
TABLE WITHOUT ID
  file.link AS Day,
  kcal AS kcal,
  protein_g AS "Protein g",
  carbs_g AS "Carbs g",
  fat_g AS "Fat g",
  fiber_g AS "Fiber g",
  meals AS Meals,
  meal_plan AS Plan
FROM "Daily"
WHERE file.day AND file.day >= date(today) - dur(14 days) AND kcal != null
SORT file.day DESC
```

```tracker
searchType: frontmatter
searchTarget: protein_g, fiber_g
folder: Daily
startDate: -30d
endDate: 0d
line:
  title: Protein & fiber (g)
  lineColor: seagreen, darkorange
  showLegend: true
  fillGap: true
```

## Ingredients
```dataview
TABLE WITHOUT ID
  file.link AS Ingredient,
  serving_size AS Per,
  calories AS kcal,
  protein AS "Protein g",
  carbs AS "Carbs g",
  fat AS "Fat g",
  fiber AS "Fiber g"
FROM "Food/Ingredients"
SORT file.name ASC
```

```meta-bind-button
label: "➕ New recipe"
id: new-recipe
hidden: true
style: primary
actions:
  - type: templaterCreateNote
    templateFile: Templates/Recipe.md
    folderPath: Food/Recipes
    openNote: true
```

```meta-bind-button
label: "📋 New meal plan"
id: new-meal-plan
hidden: true
style: default
actions:
  - type: templaterCreateNote
    templateFile: Templates/Meal Plan.md
    folderPath: Food/Meal Plans
    openNote: true
```

```meta-bind-button
label: "🔎 Find food (USDA)"
id: food-search
hidden: true
style: default
actions:
  - type: command
    command: macros:open-live-search
```

```meta-bind-button
label: "✍️ Enter food manually"
id: food-manual
hidden: true
style: default
actions:
  - type: command
    command: macros:open-manual-entry
```
