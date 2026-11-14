---
exercise_name: Close-Grip Dumbbell Press
exercise_type: strength
tags:
  - triceps
equipment:
  - dumbbell
primary_muscles:
  - triceps
secondary_muscles:
  - chest
  - shoulders
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Close-Grip_Dumbbell_Press
---
# Close-Grip Dumbbell Press

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
exercise: Close-Grip Dumbbell Press
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Close-Grip Dumbbell Press
limit: 20
```

## Instructions

![Close-Grip Dumbbell Press|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Dumbbell_Press/0.jpg) ![Close-Grip Dumbbell Press|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Close-Grip_Dumbbell_Press/1.jpg)

1. Place a dumbbell standing up on a flat bench.
2. Ensuring that the dumbbell stays securely placed at the top of the bench, lie perpendicular to the bench with only your shoulders lying on the surface. Hips should be below the bench and your legs bent with your feet firmly on the floor.
3. Grasp the dumbbell with both hands and hold it straight over your chest at arm's length. Both palms should be pressing against the underside of the sides of the dumbbell. This will be your starting position.
4. Initiate the movement by lowering the dumbbell to your chest.
5. Return to the starting position by extending the elbows.
