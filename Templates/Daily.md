---
guitar_min: 0
songs_learned: 0
training: false
smoking: 0
meals: 0
commits: 0
skincare_am: false
skincare_pm: false
litter: false
cat_play: 0
pages: 0
---
# <% tp.date.now("dddd, D MMMM YYYY", 0, tp.file.title, "YYYY-MM-DD") %>

[[<% tp.date.now("YYYY-MM-DD", -1, tp.file.title, "YYYY-MM-DD") %>|← prev]] · [[Home]] · [[Dashboards/Habits|📊 Habits]] · [[Dashboards/Tasks|✅ Tasks]] · [[<% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "YYYY-MM-DD") %>|next →]]

## Habits

> [!check]+ Checklist
> - 🏋️ Training `INPUT[toggle:training]`
> - 🧴 Skincare, morning `INPUT[toggle:skincare_am]` · evening `INPUT[toggle:skincare_pm]`
> - 🐈 Clean litter `INPUT[toggle:litter]`

> [!note]+ Counters
> - 🎸 Guitar `INPUT[slider(addLabels, minValue(0), maxValue(180), stepSize(5)):guitar_min]` **`VIEW[{guitar_min}]` min** `BUTTON[guitar-plus15]`
> - 🎵 New songs `BUTTON[song-minus]` **`VIEW[{songs_learned}]`** `BUTTON[song-plus]`
> - 🚬 Smoking `BUTTON[smoke-minus]` **`VIEW[{smoking}]`** `BUTTON[smoke-plus]`
> - 🍽️ Meals `BUTTON[meal-minus]` **`VIEW[{meals}]`** `BUTTON[meal-plus]`
> - 😺 Played with cat `BUTTON[cat-minus]` **`VIEW[{cat_play}]`** `BUTTON[cat-plus]`
> - 📖 Pages read `INPUT[number:pages]` `BUTTON[pages-plus1]` `BUTTON[pages-plus10]`
> - 💻 GitHub commits `INPUT[number:commits]` `BUTTON[fetch-commits]`

## Today

`BUTTON[sync-reminders]`

```js-engine
// Syncs Tasks/ with Apple Reminders when this note opens (Mac only, at most once a minute).
if (app.isMobile) return "📱 Reminders sync runs on the Mac.";
const last = Number(localStorage.getItem("reminders-sync-last") ?? 0);
if (Date.now() - last < 60_000) return localStorage.getItem("reminders-sync-status") ?? "";
localStorage.setItem("reminders-sync-last", String(Date.now()));
const code = await app.vault.adapter.read("Scripts/syncReminders.js");
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const status = await new AsyncFunction("app", "obsidian", code)(app, typeof obsidian !== "undefined" ? obsidian : undefined);
localStorage.setItem("reminders-sync-status", status);
return status;
```

```tasks
not done
(due on or before <% tp.file.title %>) OR (scheduled on or before <% tp.file.title %>)
group by function task.file.filename.replace(".md", "")
sort by priority
short mode
```

Completed today:

```tasks
done on <% tp.file.title %>
short mode
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
label: "🔄 Sync Reminders"
id: sync-reminders
hidden: true
style: default
actions:
  - type: js
    file: Scripts/syncReminders.js
```
