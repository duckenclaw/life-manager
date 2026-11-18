// Pure planning logic for Scripts/planWorkout.js (no Obsidian calls, so it can be tested on its own).
// Returns an object of functions. All dates are local "YYYY-MM-DD" strings.
//
// Data shapes:
//   exercise  { name, primary: [muscle], equipment: [..], category, mechanic, force, fromDb?, entry? }
//   log       { exercise, date, reps, weight }
//   session   { date, split, loads: {group: "heavy"|"light"}, exercises: [{ exercise, group }], stretches: [name] }

const lower = (s) => String(s ?? "").toLowerCase();
const list = (v) => (Array.isArray(v) ? v : v == null || v === "" ? [] : [v]);

// Which of the split's groups an exercise trains (by primary muscle), or null.
function groupOf(config, split, exercise) {
	const prim = list(exercise.primary).map(lower);
	return split.groups.find((g) => config.groups[g].muscles.some((m) => prim.includes(m))) ?? null;
}

// The grouping after the one trained most recently, cycling through config.splits.
function suggestSplit(config, sessions) {
	const last = [...sessions].sort((a, b) => b.date.localeCompare(a.date)).find((s) => s.split);
	const i = last ? config.splits.findIndex((s) => s.id === last.split) : -1;
	return config.splits[(i + 1) % config.splits.length];
}

// Heavy/light for today: the opposite of the last session of this split; first time, first group heavy.
function nextLoads(split, sessions) {
	const last = sessions.filter((s) => s.split === split.id && s.loads).sort((a, b) => b.date.localeCompare(a.date))[0];
	if (!last) return { loads: { [split.groups[0]]: "heavy", [split.groups[1]]: "light" }, last: null };
	const loads = {};
	for (const g of split.groups) loads[g] = last.loads[g] === "heavy" ? "light" : "heavy";
	// Both were the same last time (edited by hand): fall back to alternating from the first group.
	if (loads[split.groups[0]] === loads[split.groups[1]]) loads[split.groups[1]] = loads[split.groups[0]] === "heavy" ? "light" : "heavy";
	return { loads, last };
}

// Past sessions of one muscle group, newest first: [{ date, exercises: Set(lowercase names) }].
// Built from logged sets (any exercise whose primary muscles are in the group) and planned sessions.
function groupHistory(config, groupKey, logs, sessions, byName, beforeDate) {
	const muscles = config.groups[groupKey].muscles;
	const inGroup = (name) => {
		const ex = byName.get(lower(name));
		return ex && list(ex.primary).map(lower).some((m) => muscles.includes(m));
	};
	const byDate = new Map();
	const add = (date, name) => {
		if (!date || date >= beforeDate) return;
		if (!byDate.has(date)) byDate.set(date, new Set());
		byDate.get(date).add(lower(name));
	};
	for (const l of logs) if (inGroup(l.exercise)) add(l.date, l.exercise);
	for (const s of sessions) for (const e of s.exercises ?? []) if (e.group === groupKey || inGroup(e.exercise)) add(s.date, e.exercise);
	return [...byDate].sort((a, b) => b[0].localeCompare(a[0])).map(([date, exercises]) => ({ date, exercises }));
}

// Picks `count` exercises for one group. Keeps part of last session, swaps the rest for exercises
// not done in the last few sessions, preferring the same push/pull pattern on different equipment.
function pickExercises({ config, split, groupKey, load, count, library, dbCandidates, logs, sessions, today, random = Math.random }) {
	const byName = new Map([...library, ...dbCandidates].map((e) => [lower(e.name), e]));
	const excluded = (e) => config.excludeCategories.includes(lower(e.category));
	const fits = (e) => !excluded(e) && groupOf(config, split, e) === groupKey;
	const pool = library.filter(fits);
	const dbPool = dbCandidates.filter(fits);

	const history = groupHistory(config, groupKey, logs, sessions, byName, today);
	const lastNames = history[0]?.exercises ?? new Set();
	const recent = new Set(history.slice(0, config.avoidRecentSessions).flatMap((h) => [...h.exercises]));
	const lastUsed = new Map(); // name → most recent date
	for (const h of [...history].reverse()) for (const n of h.exercises) lastUsed.set(n, h.date);

	const loadFit = (e) => (load === "heavy" ? (e.mechanic === "compound" ? 1.5 : 0) : e.mechanic === "isolation" ? 1 : 0);
	const chosen = [];
	const taken = (e) => chosen.some((c) => lower(c.name) === lower(e.name));

	// 1. Keep part of last session (exercises still in the library).
	const lastSession = pool.filter((e) => lastNames.has(lower(e.name)));
	const keepCount = Math.min(Math.round(count * config.keepFromLastSession), lastSession.length, count);
	const keepRanked = lastSession.map((e) => ({ e, s: loadFit(e) + random() })).sort((a, b) => b.s - a.s);
	for (const { e } of keepRanked.slice(0, keepCount)) chosen.push({ ...e, kept: true });
	const swappedOut = keepRanked.slice(keepCount).map((x) => x.e);

	// 2. Fill the rest: one replacement per swapped-out exercise, then extra slots.
	const score = (e, replacing) => {
		let s = loadFit(e) + random();
		if (replacing) {
			if (e.force && e.force === replacing.force) s += 2;
			const eq = list(e.equipment).map(lower), req = list(replacing.equipment).map(lower);
			if (!eq.some((x) => req.includes(x))) s += 1;
		}
		return s;
	};
	const best = (candidates, replacing) => candidates.map((e) => ({ e, s: score(e, replacing) })).sort((a, b) => b.s - a.s)[0]?.e;
	const targets = [...swappedOut, ...Array(Math.max(0, count - keepCount - swappedOut.length)).fill(null)].slice(0, count - chosen.length);
	for (const replacing of targets) {
		const fresh = pool.filter((e) => !taken(e) && !recent.has(lower(e.name)));
		const freshDb = dbPool.filter((e) => !taken(e) && !recent.has(lower(e.name)));
		let pick = best(fresh, replacing) ?? best(freshDb, replacing);
		if (!pick) {
			// Nothing fresh anywhere: the least recently used library exercise.
			const stale = pool.filter((e) => !taken(e)).sort((a, b) => (lastUsed.get(lower(a.name)) ?? "").localeCompare(lastUsed.get(lower(b.name)) ?? ""));
			pick = stale[0];
		}
		if (!pick) break;
		chosen.push({ ...pick, replaces: replacing?.name ?? null });
	}

	// Compounds first: they need the most energy.
	const rank = (e) => (e.mechanic === "compound" ? 0 : 1);
	return { exercises: chosen.sort((a, b) => rank(a) - rank(b)), lastDate: history[0]?.date ?? null };
}

const round = (w, inc) => Math.max(0, Math.round(w / inc) * inc);

// Target weight from the exercise's most recent logged session (Epley e1RM).
function target(exerciseName, load, config, logs, today, inc = 2.5) {
	const L = config.loads[load];
	const sets = logs.filter((l) => lower(l.exercise) === lower(exerciseName) && l.date < today);
	if (!sets.length) return { weight: null, last: null };
	const lastDate = sets.map((l) => l.date).sort().at(-1);
	const last = sets.filter((l) => l.date === lastDate);
	const lastText = last.map((l) => `${l.weight}×${l.reps}`).join(", ");
	const maxW = Math.max(...last.map((l) => Number(l.weight) || 0));
	if (!maxW) return { weight: 0, last: lastText, lastDate };
	const e1rm = Math.max(...last.map((l) => (Number(l.weight) || 0) * (1 + (Number(l.reps) || 0) / 30)));
	let weight = round(e1rm / (1 + L.repsMax / 30), inc);
	// Last session was already at this load and every set hit the top of the range: progress.
	const top = last.filter((l) => Number(l.weight) === maxW);
	const reps = top.map((l) => Number(l.reps) || 0);
	const sameLoad = load === "heavy" ? Math.max(...reps) <= 8 : Math.min(...reps) >= 10;
	if (sameLoad) weight = reps.every((r) => r >= L.repsMax) ? maxW + inc : maxW;
	return { weight, last: lastText, lastDate };
}

// Superset pairs: A1/A2, B1/B2, … one exercise from each group.
function buildPlan({ config, split, loads, picks, logs, today, inc }) {
	const [g1, g2] = split.groups;
	const n = Math.max(picks[g1].length, picks[g2].length);
	const plan = [];
	for (let i = 0; i < n; i++) {
		const pair = String.fromCharCode(65 + i);
		[g1, g2].forEach((g, j) => {
			const e = picks[g][i];
			if (!e) return;
			const L = config.loads[loads[g]];
			const t = target(e.name, loads[g], config, logs, today, inc);
			plan.push({
				slot: `${pair}${j + 1}`, exercise: e.name, group: g, load: loads[g],
				sets: L.sets, reps: `${L.repsMin}-${L.repsMax}`, weight: t.weight, last: t.last ?? "",
				...(e.kept ? { kept: true } : {}), ...(e.replaces ? { replaces: e.replaces } : {}),
			});
		});
	}
	return plan;
}

// Targeted stretches: `perGroup` per trained group, least recently used first.
function pickStretches(config, groups, sessions, random = Math.random) {
	const lastUsed = new Map();
	for (const s of [...sessions].sort((a, b) => a.date.localeCompare(b.date))) for (const n of s.stretches ?? []) lastUsed.set(n, s.date);
	const out = [];
	for (const g of groups) {
		const options = (config.stretching.targeted[g] ?? []).filter((n) => !out.includes(n) && !config.stretching.fullBody.includes(n));
		options.map((n) => ({ n, s: lastUsed.get(n) ?? "", r: random() }))
			.sort((a, b) => a.s.localeCompare(b.s) || a.r - b.r)
			.slice(0, config.stretching.perGroup)
			.forEach(({ n }) => out.push(n));
	}
	return out;
}

return { groupOf, suggestSplit, nextLoads, groupHistory, pickExercises, target, buildPlan, pickStretches };
