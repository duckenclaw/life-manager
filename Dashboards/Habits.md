# 📊 Habits

## Last 14 days
```dataview
TABLE WITHOUT ID
  file.link AS Day,
  guitar_min AS "🎸 min",
  songs_learned AS "🎵",
  choice(training, "✅", "·") AS "🏋️",
  smoking AS "🚬",
  meals AS "🍽️",
  commits AS "💻",
  choice(skincare_am, "☀️", "·") + choice(skincare_pm, "🌙", "·") AS "🧴",
  choice(litter, "✅", "·") AS "🐈",
  cat_play AS "😺",
  pages AS "📖"
FROM "Daily"
WHERE file.day AND file.day >= date(today) - dur(14 days)
SORT file.day DESC
```

## This week vs last week
```dataviewjs
const pages = dv.pages('"Daily"').where(p => p.file.day);
const today = dv.date("today");
const inRange = (from, to) => pages.where(p => p.file.day > today.minus({ days: to }) && p.file.day <= today.minus({ days: from }));
const thisW = inRange(0, 7), lastW = inRange(7, 14);
const sum = (set, k) => set.values.reduce((a, p) => a + (Number(p[k]) || 0), 0);
const cnt = (set, k) => set.values.filter(p => p[k] === true).length;
const avg = (set, k) => set.length ? (sum(set, k) / set.length).toFixed(1) : "–";
dv.table(["Habit", "This week", "Last week"], [
  ["🎸 Guitar (min, total)", sum(thisW, "guitar_min"), sum(lastW, "guitar_min")],
  ["🎵 Songs learned", sum(thisW, "songs_learned"), sum(lastW, "songs_learned")],
  ["🏋️ Training days", cnt(thisW, "training"), cnt(lastW, "training")],
  ["🚬 Smoking (avg/day)", avg(thisW, "smoking"), avg(lastW, "smoking")],
  ["🍽️ Meals (avg/day)", avg(thisW, "meals"), avg(lastW, "meals")],
  ["💻 Commits", sum(thisW, "commits"), sum(lastW, "commits")],
  ["🧴 Skincare AM / PM", `${cnt(thisW, "skincare_am")} / ${cnt(thisW, "skincare_pm")}`, `${cnt(lastW, "skincare_am")} / ${cnt(lastW, "skincare_pm")}`],
  ["🐈 Litter cleaned", cnt(thisW, "litter"), cnt(lastW, "litter")],
  ["😺 Cat play (times)", sum(thisW, "cat_play"), sum(lastW, "cat_play")],
  ["📖 Pages", sum(thisW, "pages"), sum(lastW, "pages")],
]);
```

## Calendars (year heatmaps)
```dataviewjs
const pages = dv.pages('"Daily"').where(p => p.file.day);
const year = new Date().getFullYear();
const green = ["#c6e48b", "#7bc96f", "#49af5d", "#2e8840", "#196127"];
const red = ["#ffd6d6", "#ff9e9e", "#ff6b6b", "#e03131", "#a51111"];
const blue = ["#d0ebff", "#a5d8ff", "#74c0fc", "#339af0", "#1864ab"];
const heat = (title, colors, valueFn, scaleEnd) => {
  dv.header(4, title);
  const entries = [];
  for (const p of pages) {
    const v = valueFn(p);
    if (v > 0) entries.push({ date: p.file.name, intensity: v, content: "" });
  }
  renderHeatmapCalendar(this.container, {
    year, colors: { c: colors }, showCurrentDayBorder: true,
    intensityScaleStart: 0, intensityScaleEnd: scaleEnd, entries,
  });
};
heat("🏋️ Training", green, p => p.training ? 1 : 0, 1);
heat("🧴 Skincare (AM + PM)", blue, p => (p.skincare_am ? 1 : 0) + (p.skincare_pm ? 1 : 0), 2);
heat("🐈 Litter", green, p => p.litter ? 1 : 0, 1);
heat("🎸 Guitar minutes", green, p => Number(p.guitar_min) || 0, 60);
heat("🚬 Smoking", red, p => Number(p.smoking) || 0, 15);
```

## Trends (last 30 days)
```tracker
searchType: frontmatter
searchTarget: guitar_min, pages
folder: Daily
startDate: -30d
endDate: 0d
line:
  title: Guitar & reading
  yAxisLabel: minutes / pages
  lineColor: darkorange, royalblue
  showLegend: true
  fillGap: true
```

```tracker
searchType: frontmatter
searchTarget: smoking, meals
folder: Daily
startDate: -30d
endDate: 0d
line:
  title: Smoking & meals
  yAxisLabel: count
  lineColor: crimson, seagreen
  showLegend: true
  fillGap: true
```

```tracker
searchType: frontmatter
searchTarget: commits
folder: Daily
startDate: -30d
endDate: 0d
bar:
  title: GitHub commits
  yAxisLabel: commits
  barColor: mediumpurple
```

```tracker
searchType: frontmatter
searchTarget: cat_play
folder: Daily
startDate: -30d
endDate: 0d
bar:
  title: Cat play sessions
  yAxisLabel: times
  barColor: orange
```
