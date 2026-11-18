<%* if (tp.file.title.startsWith("Untitled")) { const name = await tp.system.prompt("Meal plan name"); if (name) await tp.file.rename(name.replace(/[\\/:*?"<>|#^[\]]/g, "-")); } -%>
---
type: meal-plan
default_plan: false
meals: []
---

[[Dashboards/Food|← Food]] · [[Food/Nutrition Goals|🎯 Goals]]

A day of meals. Press **📋 Apply meal plan** in a daily note to add all of them at once, then remove or adjust what you didn't eat.

```js-engine
const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };
return await run("Scripts/mealPlanView.js", { path: context.file.path, component });
```
