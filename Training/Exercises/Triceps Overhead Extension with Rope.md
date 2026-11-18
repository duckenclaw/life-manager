---
exercise_name: Triceps Overhead Extension with Rope
exercise_type: strength
tags:
  - triceps
equipment:
  - cable
primary_muscles:
  - triceps
secondary_muscles: []
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Triceps_Overhead_Extension_with_Rope
---
# Triceps Overhead Extension with Rope

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
exercise: Triceps Overhead Extension with Rope
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Triceps Overhead Extension with Rope
limit: 20
```

## Instructions

![Triceps Overhead Extension with Rope|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Overhead_Extension_with_Rope/0.jpg) ![Triceps Overhead Extension with Rope|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Overhead_Extension_with_Rope/1.jpg)

1. Attach a rope to a low pulley. After selecting an appropriate weight, grasp the rope with both hands and face away from the cable.
2. Position your hands behind your head with your elbows point straight up. Your elbows should start out flexed, and you can stagger your stance and lean gently away from the machine to create greater stability. This will be your starting position.
3. To perform the movement, extend through the elbow while keeping the upper arm in position, raising your hands above your head.
4. Squeeze your triceps at the top of the movement, and slowly lower the weight back to the start position.
