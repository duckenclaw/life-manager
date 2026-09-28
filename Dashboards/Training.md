# 🏋️ Training

`BUTTON[import-exercise]` `BUTTON[new-exercise]` `BUTTON[log-set]`

Import exercises from the free-exercise-db (800+ exercises, with equipment, muscles and images), or create your own. Plan them in the daily note's **Training** section and log sets with **Log set**.

```workout-dashboard
```

## Exercise library
```dataview
TABLE WITHOUT ID
  file.link AS Exercise,
  join(equipment, ", ") AS Equipment,
  join(primary_muscles, ", ") AS Primary,
  join(secondary_muscles, ", ") AS Secondary,
  default_sets + "×" + default_reps + " @ " + default_weight + " kg" AS Default,
  level AS Level
FROM "Training/Exercises"
SORT file.name ASC
```

## Last 14 days
```dataview
TABLE WITHOUT ID
  file.link AS Day,
  choice(training, "✅", "·") AS Trained,
  training_sets AS Sets,
  training_volume AS "Volume kg",
  planned_exercises AS Planned
FROM "Daily"
WHERE file.day AND file.day >= date(today) - dur(14 days)
SORT file.day DESC
```

```meta-bind-button
label: "📥 Import exercise"
id: import-exercise
hidden: true
style: primary
actions:
  - type: js
    file: Scripts/importExercise.js
```

```meta-bind-button
label: "➕ New exercise"
id: new-exercise
hidden: true
style: default
actions:
  - type: templaterCreateNote
    templateFile: Templates/Exercise.md
    folderPath: Training/Exercises
    openNote: true
```

```meta-bind-button
label: "🏋️ Log set"
id: log-set
hidden: true
style: default
actions:
  - type: js
    file: Scripts/quickLog.js
```
