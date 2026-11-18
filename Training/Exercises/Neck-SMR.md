---
exercise_name: Neck-SMR
exercise_type: flexibility
tags:
  - traps
equipment:
  - other
primary_muscles:
  - neck
secondary_muscles: []
level: intermediate
category: stretching
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Neck-SMR
---
# Neck-SMR

| | |
|---|---|
| 🏋️ Equipment | `INPUT[inlineListSuggester(option(barbell), option(dumbbell), option(machine), option(cable), option(body only), option(kettlebells), option(bands), option(e-z curl bar), option(medicine ball), option(exercise ball), option(foam roll), option(other)):equipment]` |
| 🎯 Primary muscles | `INPUT[inlineListSuggester(option(abdominals), option(abductors), option(adductors), option(biceps), option(calves), option(chest), option(forearms), option(glutes), option(hamstrings), option(lats), option(lower back), option(middle back), option(neck), option(quadriceps), option(shoulders), option(traps), option(triceps)):primary_muscles]` |
| ➕ Secondary muscles | `INPUT[inlineListSuggester(option(abdominals), option(abductors), option(adductors), option(biceps), option(calves), option(chest), option(forearms), option(glutes), option(hamstrings), option(lats), option(lower back), option(middle back), option(neck), option(quadriceps), option(shoulders), option(traps), option(triceps)):secondary_muscles]` |
| 🗺️ Heatmap groups (primary only, max 3) | `INPUT[inlineListSuggester(option(chest), option(back), option(shoulders), option(biceps), option(triceps), option(quads), option(hamstrings), option(glutes), option(calves), option(abs), option(core), option(forearms), option(traps), option(rear_delts)):tags]` |
| 📋 Default | `INPUT[number:default_sets]` sets × `INPUT[number:default_reps]` reps @ `INPUT[number:default_weight]` kg |
| 📶 Level | `INPUT[inlineSelect(option(beginner), option(intermediate), option(expert)):level]` |

## Progress

```js-engine
const api = window.WorkoutPlannerAPI;
if (!api) return "Install the Workout Planner plugin to see progress.";
const s = await api.getExerciseStats(context.file.basename);
if (!s || !s.totalSets) return "No sets logged yet.";
return engine.markdown.create(`🏆 **PR:** ${s.prWeight} kg × ${s.prReps} · **Sets:** ${s.totalSets} · **Volume:** ${Math.round(s.totalVolume)} kg · **Last:** ${s.lastWorkoutDate ?? "–"}`);
```

```workout-chart
exercise: Neck-SMR
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Neck-SMR
limit: 20
```

## Instructions

![Neck-SMR|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Neck-SMR/0.jpg) ![Neck-SMR|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Neck-SMR/1.jpg)

1. Using a muscle roller or a rolling pin, place the roller behind your head and against your neck. Make sure that you do not place the roller directly against the spine, but turned slightly so that the roller is pressed against the muscles to either side of the spine. This will be your starting position.
2. Starting at the top of your neck, slowly roll down the muscles of your neck, pausing at points of tension for 10-30 seconds.
