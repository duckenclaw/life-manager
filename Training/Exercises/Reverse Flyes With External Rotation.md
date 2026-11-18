---
exercise_name: Reverse Flyes With External Rotation
exercise_type: strength
tags:
  - shoulders
equipment:
  - dumbbell
primary_muscles:
  - shoulders
secondary_muscles: []
level: intermediate
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Reverse_Flyes_With_External_Rotation
---
# Reverse Flyes With External Rotation

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
exercise: Reverse Flyes With External Rotation
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Reverse Flyes With External Rotation
limit: 20
```

## Instructions

![Reverse Flyes With External Rotation|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Flyes_With_External_Rotation/0.jpg) ![Reverse Flyes With External Rotation|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Flyes_With_External_Rotation/1.jpg)

1. To begin, lie down on an incline bench set at a 30-degree angle with the chest and stomach pressing against the incline.
2. Have the dumbbells in each hand with the palms facing down to the floor. Your arms should be in front of you so that they are perpendicular to the angle of the bench. Tip: Your elbows should have a slight bend. The legs should be stationary while applying pressure with the ball of your toes (your heels should not be touching the floor). This is the starting position.
3. Maintaining the slight bend of the elbows, move the weights out and away from each other in an arc motion while exhaling.
4. As you lift the weight, your wrist should externally rotate by 90-degrees so that you go from a palms down (pronated) grip to a palms facing each other (neutral) grip. Tip: Try to squeeze your shoulder blades together to get the best results from this exercise.
5. The arms should be elevated until they are level with the head.
6. Feel the contraction and slowly lower the weights back down to the starting position while inhaling.
7. Repeat for the recommended amount of repetitions.
