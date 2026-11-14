---
exercise_name: High Cable Curls
exercise_type: strength
tags:
  - biceps
equipment:
  - cable
primary_muscles:
  - biceps
secondary_muscles: []
level: intermediate
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/High_Cable_Curls
---
# High Cable Curls

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
exercise: High Cable Curls
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: High Cable Curls
limit: 20
```

## Instructions

![High Cable Curls|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/High_Cable_Curls/0.jpg) ![High Cable Curls|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/High_Cable_Curls/1.jpg)

1. Stand between a couple of high pulleys and grab a handle in each arm. Position your upper arms in a way that they are parallel to the floor with the palms of your hands facing you. This will be your starting position.
2. Curl the handles towards you until they are next to your ears. Make sure that as you do so you flex your biceps and exhale. The upper arms should remain stationary and only the forearms should move. Hold for a second in the contracted position as you squeeze the biceps.
3. Slowly bring back the arms to the starting position.
4. Repeat for the recommended amount of repetitions.
