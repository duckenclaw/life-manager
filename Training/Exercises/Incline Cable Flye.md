---
exercise_name: Incline Cable Flye
exercise_type: strength
tags:
  - chest
equipment:
  - cable
primary_muscles:
  - chest
secondary_muscles:
  - shoulders
level: intermediate
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Incline_Cable_Flye
---
# Incline Cable Flye

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
exercise: Incline Cable Flye
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Incline Cable Flye
limit: 20
```

## Instructions

![Incline Cable Flye|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Cable_Flye/0.jpg) ![Incline Cable Flye|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Cable_Flye/1.jpg)

1. To get yourself into the starting position, set the pulleys at the floor level (lowest level possible on the machine that is below your torso).
2. Place an incline bench (set at 45 degrees) in between the pulleys, select a weight on each one and grab a pulley on each hand.
3. With a handle on each hand, lie on the incline bench and bring your hands together at arms length in front of your face. This will be your starting position.
4. With a slight bend of your elbows (in order to prevent stress at the biceps tendon), lower your arms out at both sides in a wide arc until you feel a stretch on your chest. Breathe in as you perform this portion of the movement. Tip: Keep in mind that throughout the movement, the arms should remain stationary. The movement should only occur at the shoulder joint.
5. Return your arms back to the starting position as you squeeze your chest muscles and exhale. Hold the contracted position for a second. Tip: Make sure to use the same arc of motion used to lower the weights.
6. Repeat the movement for the prescribed amount of repetitions.
