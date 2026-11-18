---
exercise_name: Isometric Neck Exercise - Sides
exercise_type: strength
tags:
  - traps
equipment:
  - body only
primary_muscles:
  - neck
secondary_muscles: []
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Isometric_Neck_Exercise_-_Sides
---
# Isometric Neck Exercise - Sides

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
exercise: Isometric Neck Exercise - Sides
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Isometric Neck Exercise - Sides
limit: 20
```

## Instructions

![Isometric Neck Exercise - Sides|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Isometric_Neck_Exercise_-_Sides/0.jpg) ![Isometric Neck Exercise - Sides|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Isometric_Neck_Exercise_-_Sides/1.jpg)

1. With your head and neck in a neutral position (normal position with head erect facing forward), place your left hand on the left side of your head.
2. Now gently push towards the left as you contract the left neck muscles but resisting any movement of your head. Start with slow tension and increase slowly. Keep breathing normally as you execute this contraction.
3. Hold for the recommended number of seconds.
4. Now release the tension slowly.
5. Rest for the recommended amount of time and repeat with your right hand placed on the right side of your head.
