<%* if (tp.file.title.startsWith("Untitled")) { const name = await tp.system.prompt("Recipe name"); if (name) await tp.file.rename(name.replace(/[\\/:*?"<>|#^[\]]/g, "-")); } -%>
---
type: recipe
meal_type: lunch
servings: 1
prep_min: 10
tags:
  - recipe
---
# <% tp.file.title %>

🍽️ `INPUT[inlineSelect(option(breakfast), option(lunch), option(dinner), option(snack)):meal_type]` · Servings `INPUT[number:servings]` · Prep `INPUT[number:prep_min]` min

## Ingredients (whole recipe)

Press **+** to search USDA and add an ingredient, then set its weight in grams, e.g. `Oats: 80g`.

```macros
id: recipe-<% tp.file.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") %>
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
> id: recipe-<% tp.file.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") %>
> ```

## Steps

1. 
