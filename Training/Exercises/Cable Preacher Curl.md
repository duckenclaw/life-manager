---
exercise_name: Cable Preacher Curl
exercise_type: strength
tags:
  - biceps
equipment:
  - cable
primary_muscles:
  - biceps
secondary_muscles:
  - forearms
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Cable_Preacher_Curl
---
# Cable Preacher Curl

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
exercise: Cable Preacher Curl
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Cable Preacher Curl
limit: 20
```

## Instructions

![Cable Preacher Curl|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Preacher_Curl/0.jpg) ![Cable Preacher Curl|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Preacher_Curl/1.jpg)

1. Place a preacher bench about 2 feet in front of a pulley machine.
2. Attach a straight bar to the low pulley.
3. Sit at the preacher bench with your elbow and upper arms firmly on top of the bench pad and have someone hand you the bar from the low pulley.
4. Grab the bar and fully extend your arms on top of the preacher bench pad. This will be your starting position.
5. Now start pilling the weight up towards your shoulders and squeeze the biceps hard at the top of the movement. Exhale as you perform this motion. Also, hold for a second at the top.
6. Now slowly lower the weight to the starting position.
7. Repeat for the recommended amount of repetitions.
