---
exercise_name: Bent-Arm Barbell Pullover
exercise_type: strength
tags:
  - back
  - chest
  - shoulders
  - triceps
equipment:
  - barbell
primary_muscles:
  - lats
secondary_muscles:
  - chest
  - lats
  - shoulders
  - triceps
level: intermediate
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Bent-Arm_Barbell_Pullover
---
# Bent-Arm Barbell Pullover

| | |
|---|---|
| 🏋️ Equipment | `INPUT[inlineListSuggester(option(barbell), option(dumbbell), option(machine), option(cable), option(body only), option(kettlebells), option(bands), option(e-z curl bar), option(medicine ball), option(exercise ball), option(foam roll), option(other)):equipment]` |
| 🎯 Primary muscles | `INPUT[inlineListSuggester(option(abdominals), option(abductors), option(adductors), option(biceps), option(calves), option(chest), option(forearms), option(glutes), option(hamstrings), option(lats), option(lower back), option(middle back), option(neck), option(quadriceps), option(shoulders), option(traps), option(triceps)):primary_muscles]` |
| ➕ Secondary muscles | `INPUT[inlineListSuggester(option(abdominals), option(abductors), option(adductors), option(biceps), option(calves), option(chest), option(forearms), option(glutes), option(hamstrings), option(lats), option(lower back), option(middle back), option(neck), option(quadriceps), option(shoulders), option(traps), option(triceps)):secondary_muscles]` |
| 🗺️ Muscle groups (Workout Planner) | `INPUT[inlineListSuggester(option(chest), option(back), option(shoulders), option(biceps), option(triceps), option(quads), option(hamstrings), option(glutes), option(calves), option(abs), option(core), option(forearms), option(traps), option(rear_delts)):tags]` |
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
exercise: Bent-Arm Barbell Pullover
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Bent-Arm Barbell Pullover
limit: 20
```

## Instructions

![Bent-Arm Barbell Pullover|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Barbell_Pullover/0.jpg) ![Bent-Arm Barbell Pullover|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent-Arm_Barbell_Pullover/1.jpg)

1. Lie on a flat bench with a barbell using a shoulder grip width.
2. Hold the bar straight over your chest with a bend in your arms. This will be your starting position.
3. While keeping your arms in the bent arm position, lower the weight slowly in an arc behind your head while breathing in until you feel a stretch on the chest.
4. At that point, bring the barbell back to the starting position using the arc through which the weight was lowered and exhale as you perform this movement.
5. Hold the weight on the initial position for a second and repeat the motion for the prescribed number of repetitions.
