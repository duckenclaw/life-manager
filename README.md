# Life Manager (Obsidian vault)

A tasks, habits and events system for Obsidian that works on desktop and mobile. You log your day with buttons, sliders and toggles, see your habit trends on a dashboard, and get calendar views with read-only sync from Google or Outlook.

## Setup
1. Clone this repo and open the folder as a vault in Obsidian.
2. Go to **Settings → Community plugins**, turn on community plugins, and install and enable: Meta Bind, JS Engine, Templater, Tasks, Full Calendar, Calendar, Dataview, Tracker, Heatmap Calendar, Homepage. Their settings are already in the repo.
3. In Dataview settings, turn on **Enable JavaScript Queries**.
4. Copy `.env.example` to `.env` and set `GITHUB_USERNAME`. The daily note's "Fetch commits" button uses it.
5. Full Calendar: copy `.obsidian/plugins/obsidian-full-calendar/data.example.json` to `data.json` next to it, or add the calendars in the plugin's settings. Then add your calendar's secret ICS URL.
6. Homepage: set it to open **Daily note**.
7. Create your task area notes: `Tasks/Work.md`, `Uni.md`, `Gamedev.md`, `Personal.md`, `Inbox.md`.

## Structure
| Path | Purpose |
|---|---|
| `Templates/Daily.md` | Daily note template: the habit controls and today's tasks |
| `Dashboards/Habits.md` | Tables, heatmaps and charts |
| `Dashboards/Tasks.md` | Tasks by area, overdue and upcoming |
| `Scripts/fetchCommits.js` | Counts your GitHub commits for the day |
| `Daily/`, `Tasks/`, `Events/` | Your personal data (git-ignored) |

## Customising habits
Each habit is a frontmatter property in `Templates/Daily.md`, with a Meta Bind control that edits it. To add or rename a habit, change the property, its control and its hidden button definitions in the template. Then add the property to `Dashboards/Habits.md`.
