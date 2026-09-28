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
8. Optional (macOS): Apple Reminders sync. Needs Xcode Command Line Tools (`xcode-select --install`). The first sync compiles `Scripts/reminders-bridge`, and macOS asks you to allow Obsidian to access Reminders.

## Apple Reminders sync (Mac)
Each `Tasks/<Area>.md` syncs both ways with the Reminders list of the same name. Set `REMINDERS_LISTS` in `.env` to use lists with different names. Sync runs when a daily note opens (at most once a minute) and from its 🔄 button. What syncs:
- Task name, date (📅, or ⏳ if there's no 📅) and completion, in both directions. If both sides changed the same thing, Obsidian wins.
- Reminders you add on your phone are appended to the matching Tasks note.
- Deleting a reminder marks its task cancelled (`[-]`). Deleting a task completes its reminder.

Tasks are matched by a `🆔` id. The id-to-reminder mapping lives in `.reminders-sync.json`, which is git-ignored.

## Meals (Macros plugin)
- **Ingredients** (`Food/Ingredients/`): created by Macros' **Find food** search (USDA FoodData Central). Each note holds nutrients per `serving_size`: calories, protein, carbs, fat, fiber, sugar, and vitamins and minerals.
- **Recipes** (`Food/Recipes/`, template `Templates/Recipe.md`): list the ingredients with their weights in grams in the ` ```macros ` block (`Oats: 80g`). The Nutrition section shows totals and per-serving values, which are saved to the recipe's frontmatter for `Dashboards/Food.md`.
- **Daily note → 🍽️ Meals:** **Add recipe** asks for a recipe and a number of servings, adds the scaled ingredients to that day's ` ```macros ` block, and bumps the `meals` counter. The summary compares the day's totals with the Macros daily targets (fiber target: 30 g) and saves `kcal`, `protein_g`, `carbs_g`, `fat_g` and `fiber_g` to frontmatter.

## Training (Workout Planner plugin)
- **Exercises** (`Training/Exercises/`, template `Templates/Exercise.md`): **Import exercise** searches [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (800+ public-domain exercises) and fills in equipment, primary and secondary muscles, level, instructions and images. `tags` holds Workout Planner's muscle groups, which drive its heatmap.
- **Daily note → 🏋️ Training:** pick the day's exercises under **Plan**, then log sets with **Log set** (Workout Planner's Quick Log). The summary shows planned vs done, reps and weight, volume, personal records, muscles worked and equipment needed. It also ticks the `training` habit.
- Sets are stored in `Training/Logs/workout_logs.csv`, which is git-ignored.

## Structure
| Path | Purpose |
|---|---|
| `Templates/Daily.md` | Daily note template: the habit controls and today's tasks |
| `Dashboards/Habits.md` | Tables, heatmaps and charts |
| `Dashboards/Tasks.md` | Tasks by area, overdue and upcoming |
| `Scripts/fetchCommits.js` | Counts your GitHub commits for the day |
| `Scripts/syncReminders.js`, `Scripts/reminders-bridge/` | Two-way sync with Apple Reminders (EventKit helper) |
| `Templates/Recipe.md`, `Templates/Exercise.md` | Recipe and exercise templates |
| `Dashboards/Food.md`, `Dashboards/Training.md` | Recipe library, nutrition history; exercise library, training history |
| `Scripts/nutrition.js`, `Scripts/addRecipeToDay.js` | Nutrition totals; add a recipe to the day |
| `Scripts/importExercise.js`, `Scripts/trainingSummary.js`, `Scripts/quickLog.js` | Exercise import; daily training summary; Quick Log button |
| `Scripts/applyEnv.js` | Copies `.env` values into plugin settings |
| `Food/`, `Training/Exercises/` | Shared ingredient, recipe and exercise library (tracked) |
| `Daily/`, `Tasks/`, `Events/`, `Training/Logs/workout_logs.csv` | Your personal data (git-ignored) |

## Customising habits
Each habit is a frontmatter property in `Templates/Daily.md`, with a Meta Bind control that edits it. To add or rename a habit, change the property, its control and its hidden button definitions in the template. Then add the property to `Dashboards/Habits.md`.
