---
exercise_name: Zottman Curl
exercise_type: strength
tags:
  - biceps
equipment:
  - dumbbell
primary_muscles:
  - biceps
secondary_muscles:
  - forearms
level: intermediate
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Zottman_Curl
---
# Zottman Curl

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
exercise: Zottman Curl
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Zottman Curl
limit: 20
```

## Instructions

![Zottman Curl|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Zottman_Curl/0.jpg) ![Zottman Curl|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Zottman_Curl/1.jpg)

1. Stand up with your torso upright and a dumbbell in each hand being held at arms length. The elbows should be close to the torso.
2. Make sure the palms of the hands are facing each other. This will be your starting position.
3. While holding the upper arm stationary, curl the weights while contracting the biceps as you breathe out. Only the forearms should move. Your wrist should rotate so that you have a supinated (palms up) grip. Continue the movement until your biceps are fully contracted and the dumbbells are at shoulder level.
4. Hold the contracted position for a second as you squeeze the biceps.
5. Now during the contracted position, rotate your wrist until you now have a pronated (palms facing down) grip with the thumb at a higher position than the pinky.
6. Slowly begin to bring the dumbbells back down using the pronated grip.
7. As the dumbbells close your thighs, start rotating the wrist so that you go back to a neutral (palms facing your body) grip.
8. Repeat for the recommended amount of repetitions.
