---
exercise_name: Barbell Rear Delt Row
exercise_type: strength
tags:
  - rear_delts
  - back
equipment:
  - barbell
primary_muscles:
  - shoulders
secondary_muscles:
  - biceps
  - lats
  - middle back
level: beginner
category: strength
default_sets: 3
default_reps: 10
default_weight: 0
source: free-exercise-db/Barbell_Rear_Delt_Row
---
# Barbell Rear Delt Row

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
exercise: Barbell Rear Delt Row
type: weight
dateRange: 90
showTrendLine: true
height: 250
```

```workout-log
exercise: Barbell Rear Delt Row
limit: 20
```

## Instructions

![Barbell Rear Delt Row|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Rear_Delt_Row/0.jpg) ![Barbell Rear Delt Row|300](https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Rear_Delt_Row/1.jpg)

1. Stand up straight while holding a barbell using a wide (higher than shoulder width) and overhand (palms facing your body) grip.
2. Bend knees slightly and bend over as you keep the natural arch of your back. Let the arms hang in front of you as they hold the bar. Once your torso is parallel to the floor, flare the elbows out and away from your body. Tip: Your torso and your arms should resemble the letter "T". Now you are ready to begin the exercise.
3. While keeping the upper arms perpendicular to the torso, pull the barbell up towards your upper chest as you squeeze the rear delts and you breathe out. Tip: When performed correctly, this exercise should resemble a bench press in reverse. Also, refrain from using your biceps to do the work. Focus on targeting the rear delts; the arms should only act as hooks.
4. Slowly go back to the initial position as you breathe in.
5. Repeat for the recommended amount of repetitions.
