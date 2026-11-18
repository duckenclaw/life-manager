# Life Manager (Obsidian vault)

A tasks, habits and events system for Obsidian that works on desktop and mobile. You log your day with buttons, sliders and toggles, see your habit trends on a dashboard, and get calendar views with read-only sync from Google or Outlook.

## Setup
1. Clone this repo and open the folder as a vault in Obsidian.
2. Go to **Settings → Community plugins**, turn on community plugins, and install and enable: Meta Bind, JS Engine, Templater, Tasks, Full Calendar, Calendar, Dataview, Tracker, Heatmap Calendar, Homepage, Macros, Workout Planner. Their settings are already in the repo.
3. In Dataview settings, turn on **Enable JavaScript Queries**. In Templater settings, turn on **Trigger Templater on new file creation**. This is a per-device setting that isn't stored in the vault, so do it on each device. The folder templates (`Daily`, `Food/Recipes`) are already configured.
4. Copy `.env.example` to `.env` and set `GITHUB_USERNAME` (for the daily note's "Fetch commits" button) and `USDA_API_KEY` (for food search). Then press **⚙️ Apply .env** on `Home`.
   Copy `.obsidian/plugins/macros/data.example.json` to `data.json` next to it, before enabling Macros.
5. Full Calendar: copy `.obsidian/plugins/obsidian-full-calendar/data.example.json` to `data.json` next to it, or add the calendars in the plugin's settings. Then add your calendar's secret ICS URL.
6. Homepage: set it to open **Daily note**.
7. Create your task area notes: `Tasks/Work.md`, `Uni.md`, `Gamedev.md`, `Personal.md`, `Inbox.md`.
## Meals (Macros plugin)
- **Ingredients** (`Food/Ingredients/`): created by Macros' **Find food** search (USDA FoodData Central for basic foods; Open Food Facts for packaged products, by name or barcode). Each note holds nutrients per `serving_size`: calories, protein, carbs, fat, fiber, sugar, and vitamins and minerals.
- **Recipes** (`Food/Recipes/`, template `Templates/Recipe.md`): list the ingredients with their weights in grams in the ` ```macros ` block (`Oats: 80g`). The Nutrition section shows totals and per-serving values, which are saved to the recipe's frontmatter for `Dashboards/Food.md`.
- **Daily note → 🍽️ Meals:** **Add recipe** asks for a recipe and a number of servings, adds the scaled ingredients to that day's ` ```macros ` block, and bumps the `meals` counter. The summary compares the day's totals with the Macros daily targets (fiber target: 35 g) and saves `kcal`, `protein_g`, `carbs_g`, `fat_g` and `fiber_g` to frontmatter.

## Training (Workout Planner plugin)
- **Exercises** (`Training/Exercises/`, template `Templates/Exercise.md`): **Import exercise** searches [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (800+ public-domain exercises) and fills in equipment, primary and secondary muscles, level, instructions and images. `tags` holds only the *primary* muscle groups (max 3), because Workout Planner's heatmap gives every tag a set's full volume. The full detail stays in `primary_muscles` / `secondary_muscles`. The daily summary and the Training dashboard's **Sets per muscle** table count a set as 1 for each primary muscle and ½ for each secondary muscle.
- **Daily note → 🏋️ Training:** pick the day's exercises under **Plan**, then log sets with **Log set** (Workout Planner's Quick Log). The summary shows planned vs done, reps and weight, volume, personal records, muscles worked and equipment needed. It also ticks the `training` habit.
- Sets are stored in `Training/Logs/workout_logs.csv`, which is git-ignored.
- **Daily note → 🏋️ Plan workout:** builds a superset day. Pick a grouping (chest + upper back, biceps + triceps, legs + abs/lower back, shoulders + legs) and 3 or 4 pairs.
  - *Periodisation:* the two muscle groups alternate heavy (4×5–6, max weight) and light (3×12–15, technique). Each grouping flips them from its last session; you can override it in the pop-up. `Dashboards/Training.md → Periodisation` shows last and next load per group.
  - *Variation:* about half of last session's exercises stay; the rest are swapped for exercises not done in the last 2 sessions, preferring the same push/pull pattern on other equipment. If your library has nothing fresh, one is imported from the free-exercise-db automatically.
  - *Targets:* weights come from your last logged session of each exercise (+2.5 kg when you hit the top of the rep range).
  - Each exercise gets a **Log set** button that opens Quick Log prefilled with the exercise, reps and weight.
- **Daily note → 🧘 Stretching:** a fixed full-body routine (incl. front and middle split work) plus 2 targeted stretches per trained group, rotating, with image cues. **Done stretching** ticks the habit.
- The two leg days differ: legs + abs/lower back is quad-focused; shoulders + legs covers hamstrings, glutes and calves. Groupings, muscles, rep ranges and stretches are all in `Scripts/trainingConfig.json`.

## Structure
| Path | Purpose |
|---|---|
| `Templates/Daily.md` | Daily note template: the habit controls and today's tasks |
| `Dashboards/Habits.md` | Tables, heatmaps and charts |
| `Dashboards/Tasks.md` | Tasks by area, overdue and upcoming |
| `Scripts/fetchCommits.js` | Counts your GitHub commits for the day |
| `Templates/Recipe.md`, `Templates/Exercise.md` | Recipe and exercise templates |
| `Dashboards/Food.md`, `Dashboards/Training.md` | Recipe library, nutrition history; exercise library, training history |
| `Scripts/nutrition.js`, `Scripts/addRecipeToDay.js` | Nutrition totals; add a recipe to the day |
| `Scripts/importExercise.js`, `Scripts/trainingSummary.js`, `Scripts/quickLog.js` | Exercise import; daily training summary; Quick Log button |
| `Scripts/planWorkout.js`, `Scripts/workoutPlan.js`, `Scripts/logPlannedSet.js`, `Scripts/stretchPlan.js`, `Scripts/periodisation.js` | Superset planner button; plan view with Log set buttons; prefilled Quick Log; stretching view; periodisation table |
| `Scripts/lib/planner.js`, `Scripts/lib/exerciseDb.js`, `Scripts/trainingConfig.json` | Planning logic; free-exercise-db helpers; planner settings |
| `Scripts/applyEnv.js` | Copies `.env` values into plugin settings |
| `Food/`, `Training/Exercises/` | Shared ingredient, recipe and exercise library (tracked) |
| `Daily/`, `Tasks/`, `Events/`, `Training/Logs/workout_logs.csv` | Your personal data (git-ignored) |

## Customising habits
Each habit is a frontmatter property in `Templates/Daily.md`, with a Meta Bind control that edits it. To add or rename a habit, change the property, its control and its hidden button definitions in the template. Then add the property to `Dashboards/Habits.md`.
