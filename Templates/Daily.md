---
skincare_am: false
skincare_pm: false
guitar_min: 0
songs_learned: 0
stretching: false
smoking: 0
meals: 0
commits: 0
cat_clean: false
cat_play: 0
litter: false
pages: 0
weight:
training: false
planned_exercises: []
---
# <% tp.date.now("dddd, D MMMM YYYY", 0, tp.file.title, "YYYY-MM-DD") %>

[[<% tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>|← prev]] · [[Home]] · [[Dashboards/Habits|📊 Habits]] · [[Dashboards/Tasks|✅ Tasks]] · [[<% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>|next →]]

## ⚡ Today

`BUTTON[add-recipe]` `BUTTON[food-search]` `BUTTON[log-set]` `BUTTON[import-exercise]`

> [!check]+ Checklist
> - 🏋️ Training `INPUT[toggle:training]`
> - 🧘 Stretching `INPUT[toggle:stretching]`
> - 🧴 Skincare, morning `INPUT[toggle:skincare_am]` · evening `INPUT[toggle:skincare_pm]`
> - 🐈 Clean litter `INPUT[toggle:litter]`
> - 🧹 Cat cleaning `INPUT[toggle:cat_clean]`

> [!note]+ Counters
> - ⚖️ Weight `INPUT[number:weight]` kg
> - 🎸 Guitar `INPUT[slider(addLabels, minValue(0), maxValue(180), stepSize(5)):guitar_min]` **`VIEW[{guitar_min}]` min** `BUTTON[guitar-plus15]`
> - 🎵 New songs `BUTTON[song-minus]` **`VIEW[{songs_learned}]`** `BUTTON[song-plus]`
> - 🚬 Smoking `BUTTON[smoke-minus]` **`VIEW[{smoking}]`** `BUTTON[smoke-plus]`
> - 🍽️ Meals `BUTTON[meal-minus]` **`VIEW[{meals}]`** `BUTTON[meal-plus]`
> - 😺 Played with cat `BUTTON[cat-minus]` **`VIEW[{cat_play}]`** `BUTTON[cat-plus]`
> - 📖 Pages read `INPUT[number:pages]` `BUTTON[pages-plus1]` `BUTTON[pages-plus10]`
> - 💻 GitHub commits `INPUT[number:commits]` `BUTTON[fetch-commits]`

**Plan:** `INPUT[inlineListSuggester(optionQuery("Training/Exercises")):planned_exercises]`


## 🍽️ Meals

```macros
id: <% tp.file.title %>
```

```js-engine
const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };
const rc = engine.reactive(async () => engine.markdown.create(await run("Scripts/nutrition.js", { path: context.file.path, mode: "day" })));
component.registerEvent(app.metadataCache.on("changed", (f) => { if (f.path === context.file.path) rc.refresh(); }));
return rc;
```

## 🏋️ Training

```js-engine
const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };
const rc = engine.reactive(async () => engine.markdown.create(await run("Scripts/trainingSummary.js", { path: context.file.path })));
const csv = app.plugins.plugins["workout-planner"]?.settings?.csvLogFilePath ?? "Training/Logs/workout_logs.csv";
component.registerEvent(app.metadataCache.on("changed", (f) => { if (f.path === context.file.path) rc.refresh(); }));
component.registerEvent(app.vault.on("modify", (f) => { if (f.path === csv) rc.refresh(); }));
return rc;
```

## Notes

- 

%% Button definitions below (hidden, used by the controls above) %%

```meta-bind-button
label: "+15"
id: guitar-plus15
hidden: true
style: default
actions:
  - type: updateMetadata
    bindTarget: guitar_min
    evaluate: true
    value: x + 15
```

```meta-bind-button
label: "−"
id: song-minus
hidden: true
style: default
actions:
  - type: updateMetadata
    bindTarget: songs_learned
    evaluate: true
    value: Math.max(0, x - 1)
```

```meta-bind-button
label: "+"
id: song-plus
hidden: true
style: primary
actions:
  - type: updateMetadata
    bindTarget: songs_learned
    evaluate: true
    value: x + 1
```

```meta-bind-button
label: "−"
id: smoke-minus
hidden: true
style: default
actions:
  - type: updateMetadata
    bindTarget: smoking
    evaluate: true
    value: Math.max(0, x - 1)
```

```meta-bind-button
label: "+1 🚬"
id: smoke-plus
hidden: true
style: destructive
actions:
  - type: updateMetadata
    bindTarget: smoking
    evaluate: true
    value: x + 1
```

```meta-bind-button
label: "−"
id: meal-minus
hidden: true
style: default
actions:
  - type: updateMetadata
    bindTarget: meals
    evaluate: true
    value: Math.max(0, x - 1)
```

```meta-bind-button
label: "+"
id: meal-plus
hidden: true
style: primary
actions:
  - type: updateMetadata
    bindTarget: meals
    evaluate: true
    value: x + 1
```

```meta-bind-button
label: "−"
id: cat-minus
hidden: true
style: default
actions:
  - type: updateMetadata
    bindTarget: cat_play
    evaluate: true
    value: Math.max(0, x - 1)
```

```meta-bind-button
label: "+1"
id: cat-plus
hidden: true
style: primary
actions:
  - type: updateMetadata
    bindTarget: cat_play
    evaluate: true
    value: x + 1
```

```meta-bind-button
label: "+1"
id: pages-plus1
hidden: true
style: default
actions:
  - type: updateMetadata
    bindTarget: pages
    evaluate: true
    value: x + 1
```

```meta-bind-button
label: "+10"
id: pages-plus10
hidden: true
style: primary
actions:
  - type: updateMetadata
    bindTarget: pages
    evaluate: true
    value: x + 10
```

```meta-bind-button
label: "⟳ Fetch"
id: fetch-commits
hidden: true
style: default
actions:
  - type: js
    file: Scripts/fetchCommits.js
```

```meta-bind-button
label: "🍽️ Add recipe"
id: add-recipe
hidden: true
style: primary
actions:
  - type: js
    file: Scripts/addRecipeToDay.js
```

```meta-bind-button
label: "🔎 Find food"
id: food-search
hidden: true
style: default
actions:
  - type: command
    command: macros:open-live-search
```

```meta-bind-button
label: "🏋️ Log set"
id: log-set
hidden: true
style: primary
actions:
  - type: js
    file: Scripts/quickLog.js
```

```meta-bind-button
label: "📥 Import exercise"
id: import-exercise
hidden: true
style: default
actions:
  - type: js
    file: Scripts/importExercise.js
```
