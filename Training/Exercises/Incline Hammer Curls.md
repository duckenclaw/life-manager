---
exercise_name: Incline Hammer Curls
exercise_type: strength
tags:
  - biceps
equipment:
  - dumbbell
primary_muscles:
  - biceps
secondary_muscles: []
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Incline_Hammer_Curls
---
# Incline Hammer Curls

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
exercise: Incline Hammer Curls
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Incline Hammer Curls
limit: 20
```

## Instructions

![Incline Hammer Curls|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Hammer_Curls/0.jpg) ![Incline Hammer Curls|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Hammer_Curls/1.jpg)

1. Seat yourself on an incline bench with a dumbbell in each hand. You should pressed firmly against he back with your feet together. Allow the dumbbells to hang straight down at your side, holding them with a neutral grip. This will be your starting position.
2. Initiate the movement by flexing at the elbow, attempting to keep the upper arm stationary.
3. Continue to the top of the movement and pause, then slowly return to the start position.
