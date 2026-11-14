---
exercise_name: Standing Leg Curl
exercise_type: strength
tags:
  - hamstrings
equipment:
  - machine
primary_muscles:
  - hamstrings
secondary_muscles: []
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Standing_Leg_Curl
---
# Standing Leg Curl

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
exercise: Standing Leg Curl
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Standing Leg Curl
limit: 20
```

## Instructions

![Standing Leg Curl|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Leg_Curl/0.jpg) ![Standing Leg Curl|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Leg_Curl/1.jpg)

1. Adjust the machine lever to fit your height and lie with your torso bent at the waist facing forward around 30-45 degrees (since an angled position is more favorable for hamstrings recruitment) with the pad of the lever on the back of your right leg (just a few inches under the calves) and the front of the right leg on top of the machine pad.
2. Keeping the torso bent forward, ensure your leg is fully stretched and grab the side handles of the machine. Position your toes straight. This will be your starting position.
3. As you exhale, curl your right leg up as far as possible without lifting the upper leg from the pad. Once you hit the fully contracted position, hold it for a second.
4. As you inhale, bring the legs back to the initial position. Repeat for the recommended amount of repetitions.
5. Perform the same exercise now for the left leg.
