---
exercise_name: Squat with Plate Movers
exercise_type: strength
tags:
  - quads
equipment:
  - barbell
primary_muscles:
  - quadriceps
secondary_muscles:
  - abductors
  - adductors
  - calves
  - glutes
  - hamstrings
level: intermediate
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Squat_with_Plate_Movers
---
# Squat with Plate Movers

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
exercise: Squat with Plate Movers
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Squat with Plate Movers
limit: 20
```

## Instructions

![Squat with Plate Movers|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_with_Plate_Movers/0.jpg) ![Squat with Plate Movers|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_with_Plate_Movers/1.jpg)

1. To begin, first set the bar on a rack to just below shoulder level. Position a weight plate on the ground a couple feet back from the rack. Once the bar is loaded, step under it and place the back of your shoulders across it.
2. Hold on to the bar with both hands and lift it off the rack by first pushing with your legs and at the same time straighten your torso.
3. Step away from the rack and adopt a wide stance with the toes slightly pointed out, with one foot on the weight plate. Keep your head up at all times. This will be your starting position.
4. Begin to slowly lower the bar by bending the knees and hips. Continue down until the angle between the upper leg and the calves becomes slightly less than 90-degrees.
5. Raise the bar as you exhale by pushing the floor with the heels of your feet as you extend the hips and knees.
6. At the top of the movement, side step, bringing your feet together on the opposite side of the plate.
7. Using your inside foot, push the weight plate, sliding it across the floor to where you were just standing.
8. Place your inside foot on the weight plate, adopting a wide stance for the next repetition.
