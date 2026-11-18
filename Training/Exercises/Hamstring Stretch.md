---
exercise_name: Hamstring Stretch
exercise_type: flexibility
tags:
  - hamstrings
equipment: []
primary_muscles:
  - hamstrings
secondary_muscles: []
level: beginner
category: stretching
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Hamstring_Stretch
---
# Hamstring Stretch

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
exercise: Hamstring Stretch
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Hamstring Stretch
limit: 20
```

## Instructions

![Hamstring Stretch|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring_Stretch/0.jpg) ![Hamstring Stretch|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hamstring_Stretch/1.jpg)

1. Lie on your back with one leg extended above you, with the hip at ninety degrees. Keep the other leg flat on the floor.
2. Loop a belt, band, or rope over the ball of your foot. This will be your starting position.
3. Pull on the belt to create tension in the calves and hamstrings. Hold this stretch for 10-30 seconds, and repeat with the other leg.
