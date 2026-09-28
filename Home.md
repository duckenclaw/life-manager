# 🏠 Home

- 📅 **Today:** open it from the Calendar sidebar, or use the command *Daily notes: Open today's daily note*
- 📊 [[Dashboards/Habits|Habits dashboard]]
- 🍽️ [[Dashboards/Food|Food & recipes]] · 🏋️ [[Dashboards/Training|Training]]
- ✅ [[Dashboards/Tasks|Tasks dashboard]] · 📥 [[Tasks/Inbox|Inbox]]
- Areas: [[Tasks/Work|💼 Work]] · [[Tasks/Uni|🎓 Uni]] · [[Tasks/Gamedev|🎮 Gamedev]] · [[Tasks/Personal|🏠 Personal]]
- 🗓️ Calendar: command *Full Calendar: Open calendar* (work meetings + `Events/`)

## Due today
```tasks
not done
(due before tomorrow) OR (scheduled before tomorrow)
short mode
```

## Where things go
| What | Where |
|---|---|
| Daily habit numbers | Today's daily note (buttons, sliders, toggles) |
| Something to *do* | A task in `Tasks/<Area>.md` or the Inbox |
| Recurring chore (water plants…) | A recurring task `🔁 every N days` |
| Meeting or appointment | Google/Outlook calendar (shown read-only in Full Calendar) |
| Personal one-off event | Full Calendar → click a slot (saved to `Events/`) |
| Recipe | [[Dashboards/Food\|Food]] → New recipe (`Food/Recipes/`) |
| Ingredient nutrition | Macros live search → USDA (`Food/Ingredients/`) |
| Exercise | [[Dashboards/Training\|Training]] → Import exercise (`Training/Exercises/`) |

## Setup
`BUTTON[apply-env]` copies API keys from `.env` into plugin settings (run it after changing `.env`).

```meta-bind-button
label: "⚙️ Apply .env"
id: apply-env
hidden: true
style: default
actions:
  - type: js
    file: Scripts/applyEnv.js
```
