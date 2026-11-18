---
exercise_name: Pallof Press With Rotation
exercise_type: strength
tags:
  - abs
equipment:
  - cable
primary_muscles:
  - abdominals
secondary_muscles:
  - chest
  - shoulders
  - triceps
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Pallof_Press_With_Rotation
---
# Pallof Press With Rotation

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
exercise: Pallof Press With Rotation
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Pallof Press With Rotation
limit: 20
```

## Instructions

![Pallof Press With Rotation|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pallof_Press_With_Rotation/0.jpg) ![Pallof Press With Rotation|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pallof_Press_With_Rotation/1.jpg)

1. Connect a standard handle to a tower, and position the cable to shoulder height.
2. With your side to the cable, grab the handle with one hand and step away from the tower. You should be approximately arm's length away from the pulley, with the tension of the weight on the cable. Align outstretched arm with cable.
3. With your feet positioned hip-width apart, pull the cable into your chest and grab the handle with your other hand. Both hands should be on the handle at this time.
4. Facing forward, press the cable away from your chest. You core should be tight and engaged.
5. Keeping your hips straight, twist your torso away from the pulley until you get a full quarter rotation.
6. Maintain your rigid stance and straight arms. Return to the neutral position in a slow and controlled manner. Your arms should be extended in front of you.
7. With the side tension still engaging your core, bring your hands to your chest and immediately press outward to a fully extended position. This constitutes one rep.
8. Repeat to failure.
9. Then, reposition and repeat the same series of movements on the opposite side.
