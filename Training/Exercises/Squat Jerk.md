---
exercise_name: Squat Jerk
exercise_type: strength
tags:
  - quads
equipment:
  - barbell
primary_muscles:
  - quadriceps
secondary_muscles:
  - calves
  - glutes
  - hamstrings
  - shoulders
  - triceps
level: expert
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Squat_Jerk
---
# Squat Jerk

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
exercise: Squat Jerk
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Squat Jerk
limit: 20
```

## Instructions

![Squat Jerk|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_Jerk/0.jpg) ![Squat Jerk|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Squat_Jerk/1.jpg)

1. Standing with the weight racked on the front of the shoulders, begin with the dip. With your feet directly under your hips, flex the knees without moving the hips backward. Go down only slightly, and reverse direction as powerfully as possible. Drive through the heels create as much speed and force as possible, and be sure to move your head out of the way as the bar leaves the shoulders.
2. At this moment as the feet leave the floor, the feet must be placed into the receiving position as quickly as possible. In the brief moment the feet are not actively driving against the platform, the athlete's effort to push the bar up will drive them down. The feet should move forcefully to just outside the hips, turned out as necessary. Receive the bar with your body in a full squat and the arms fully extended overhead.
3. Keeping the bar aligned over the front of the heels, your head and chest up, drive throught heels of the feet to move to a standing position. Carefully return the weight to floor.
