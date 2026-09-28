// Two-way sync between Tasks/*.md and Apple Reminders (macOS only; the iPhone
// gets the changes through iCloud Reminders).
//
// - Every note Tasks/<Area>.md ↔ Reminders list "<Area>" (case-insensitive), or the
//   list named in REMINDERS_LISTS in .env, e.g. REMINDERS_LISTS=Uni:learning,Inbox:Inbox
// - Open tasks get a 🆔 id; the id ↔ reminder mapping lives in .reminders-sync.json.
// - Name, date (📅, or ⏳ if there is no 📅) and completion sync both ways. When both
//   sides changed the same thing since the last sync, Obsidian wins.
// - New reminders in a synced list are appended to the matching Tasks note.
// - Reminder deleted → task marked cancelled [-]. Task deleted → reminder completed.
//
// Talks to Reminders through Scripts/reminders-bridge (EventKit), compiled on first run.
// Run by the js-engine block in daily notes and by the "Sync Reminders" button.

const Notice = typeof obsidian !== "undefined" ? obsidian.Notice : class { constructor(m) { console.log(m); } };

if (app.isMobile || typeof window.require !== "function") return "📱 Reminders sync runs on the Mac.";
if (window.__remindersSyncRunning) return "⏳ Reminders sync already running…";
window.__remindersSyncRunning = true;

const TASKS_DIR = "Tasks";
const STATE_PATH = ".reminders-sync.json";
const BRIDGE_DIR = "Scripts/reminders-bridge";
const MAX_DELETIONS = 5; // safety net: never cancel more tasks than this in one run

const { spawn, execFile } = window.require("child_process");
const fs = window.require("fs");
const nodePath = window.require("path");
const base = app.vault.adapter.getBasePath();
const bridgeDir = nodePath.join(base, BRIDGE_DIR);
const bridgeBin = nodePath.join(bridgeDir, "reminders-bridge");
const bridgeSrc = nodePath.join(bridgeDir, "main.swift");

const pad = (n) => String(n).padStart(2, "0");
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const newUid = () => Math.random().toString(36).slice(2, 8);

// ── helpers: environment, bridge ────────────────────────────────────────────

const readEnv = async () => {
	try {
		const text = await app.vault.adapter.read(".env");
		return Object.fromEntries(
			text.split(/\r?\n/)
				.map((l) => l.trim())
				.filter((l) => l && !l.startsWith("#") && l.includes("="))
				.map((l) => {
					const i = l.indexOf("=");
					return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, "")];
				}),
		);
	} catch {
		return {};
	}
};

const ensureBridge = () =>
	new Promise((resolve, reject) => {
		const fresh = fs.existsSync(bridgeBin) && fs.statSync(bridgeBin).mtimeMs >= fs.statSync(bridgeSrc).mtimeMs;
		if (fresh) return resolve();
		new Notice("Compiling Reminders bridge (first run, ~30 s)…");
		execFile("/usr/bin/swiftc", ["-O", "-swift-version", "5", bridgeSrc, "-o", bridgeBin], { timeout: 300000 }, (err, _out, stderr) =>
			err ? reject(new Error(`swiftc failed (install Xcode Command Line Tools: xcode-select --install)\n${stderr}`)) : resolve(),
		);
	});

const bridge = (command, payload) =>
	new Promise((resolve, reject) => {
		const child = spawn(bridgeBin, [command]);
		let out = "", err = "";
		child.stdout.on("data", (d) => (out += d));
		child.stderr.on("data", (d) => (err += d));
		child.on("error", reject);
		child.on("close", (code) => {
			if (code !== 0) return reject(new Error(err.trim() || `bridge exited with ${code}`));
			try { resolve(JSON.parse(out)); } catch (e) { reject(e); }
		});
		child.stdin.end(JSON.stringify(payload));
	});

// ── helpers: task lines (Tasks plugin emoji format) ─────────────────────────

const TASK_RE = /^(\s*[-*+] \[)(.)(\] )(.*)$/;
const FIELD_RE = /\s(?:📅|⏳|🛫|➕|✅|❌|🔁|🆔|⛔|🏁|⏫|🔼|🔽|🔺|⏬)/u;
const TAG_RE = /(^|\s)#[^\s#]+/g;
const DATE = "\\d{4}-\\d{2}-\\d{2}";

const parseTask = (line) => {
	const m = line.match(TASK_RE);
	if (!m) return null;
	const body = m[4];
	const idx = body.search(FIELD_RE);
	const desc = idx < 0 ? body : body.slice(0, idx);
	const fields = idx < 0 ? "" : body.slice(idx);
	return {
		done: /[xX-]/.test(m[2]),
		tags: (desc.match(TAG_RE) ?? []).map((t) => t.trim()),
		name: desc.replace(TAG_RE, " ").replace(/\s+/g, " ").trim(),
		fields,
		id: fields.match(/🆔\s*([\w-]+)/u)?.[1] ?? null,
		due: fields.match(new RegExp(`📅\\s*(${DATE})`, "u"))?.[1] ?? fields.match(new RegExp(`⏳\\s*(${DATE})`, "u"))?.[1] ?? null,
	};
};

const stripId = (line) => line.replace(/\s*🆔\s*[\w-]+/u, "");
const withId = (line, id) => `${stripId(line).trimEnd()} 🆔 ${id}`;
const addField = (line, field) => {
	const id = parseTask(line)?.id;
	const bare = `${stripId(line).trimEnd()} ${field}`;
	return id ? withId(bare, id) : bare;
};

const setName = (line, name) => {
	const m = line.match(TASK_RE);
	const t = parseTask(line);
	const desc = [name, ...t.tags.filter((tag) => !name.includes(tag))].join(" ");
	return m[1] + m[2] + m[3] + desc + t.fields;
};

const setDue = (line, date) => {
	const due = new RegExp(`\\s*📅\\s*${DATE}`, "u");
	const scheduled = new RegExp(`\\s*⏳\\s*${DATE}`, "u");
	if (!date) return line.replace(due, "").replace(scheduled, "");
	if (due.test(line)) return line.replace(due, ` 📅 ${date}`);
	if (scheduled.test(line)) return line.replace(scheduled, ` ⏳ ${date}`);
	return addField(line, `📅 ${date}`);
};

const uncomplete = (line) => line.replace(TASK_RE, "$1 $3$4").replace(new RegExp(`\\s*[✅❌]\\s*${DATE}`, "gu"), "");
const cancel = (line) => addField(line.replace(TASK_RE, "$1-$3$4"), `❌ ${today}`);

// Completing goes through the Tasks plugin when possible so recurring tasks (🔁)
// spawn their next occurrence. The new occurrence loses the 🆔 and syncs as a new task.
const complete = (line, path) => {
	const api = app.plugins.plugins["obsidian-tasks-plugin"]?.apiV1;
	const lines = api?.executeToggleTaskDoneCommand
		? api.executeToggleTaskDoneCommand(line, path).split("\n")
		: [addField(line.replace(TASK_RE, "$1x$3$4"), `✅ ${today}`)];
	return lines.map((l) => (parseTask(l)?.done === false ? stripId(l) : l));
};

// ── sync ────────────────────────────────────────────────────────────────────

const sync = async () => {
	const env = await readEnv();
	const listMap = Object.fromEntries(
		(env.REMINDERS_LISTS ?? "").split(",").map((p) => p.split(":").map((s) => s.trim())).filter((p) => p.length === 2 && p[0] && p[1]),
	);

	let state = { tasks: {} };
	try { state = JSON.parse(await app.vault.adapter.read(STATE_PATH)); } catch {}

	// 1. Read tasks from Tasks/*.md
	const files = app.vault.getMarkdownFiles().filter((f) => f.parent?.path === TASKS_DIR);
	const areas = Object.fromEntries(files.map((f) => [f.basename, listMap[f.basename] ?? f.basename]));
	const tasks = [];
	for (const file of files) {
		(await app.vault.read(file)).split("\n").forEach((line, lineNo) => {
			const t = parseTask(line);
			if (t && t.name) tasks.push({ ...t, file, line, lineNo });
		});
	}
	// Duplicate ids (e.g. a copied line): the done copy keeps the id, others get a new one.
	const byUid = new Map();
	for (const t of [...tasks].sort((a, b) => b.done - a.done)) {
		if (!t.id) continue;
		if (byUid.has(t.id)) t.dupe = true;
		else byUid.set(t.id, t);
	}

	// 2. Read Reminders
	const mapped = Object.entries(state.tasks);
	const remote = await bridge("read", { lists: areas, ids: mapped.map(([, s]) => s.rid) });
	const openById = new Map();
	for (const [area, rs] of Object.entries(remote.lists)) rs.forEach((r) => openById.set(r.id, { ...r, due: r.due ?? null, area }));
	for (const r of Object.values(remote.byId)) r.due ??= null;
	for (const s of Object.values(state.tasks)) s.due ??= null;
	const missing = new Set(remote.missing);
	const knownRids = new Set(mapped.map(([, s]) => s.rid));

	const edits = new Map(); // file path → Map(lineNo → { from, to: string[] })
	const appends = new Map(); // file path → string[]
	const edit = (t, to) => {
		if (!edits.has(t.file.path)) edits.set(t.file.path, new Map());
		edits.get(t.file.path).set(t.lineNo, { from: t.line, to });
	};
	const create = [], update = [], newState = {};
	const stats = { toReminders: 0, toObsidian: 0, created: 0, imported: 0 };
	let spawnedRecurrence = false;

	const deletions = mapped.filter(([uid, s]) => missing.has(s.rid) && byUid.get(uid) && !byUid.get(uid).done);
	if (deletions.length > MAX_DELETIONS) {
		throw new Error(`${deletions.length} synced reminders disappeared at once; not cancelling their tasks. ` +
			`Check Reminders; if this is intended, raise MAX_DELETIONS in Scripts/syncReminders.js for one sync.`);
	}

	// 3. Already-linked tasks: three-way merge against the last synced state
	for (const [uid, s] of mapped) {
		const t = byUid.get(uid);
		const r = openById.get(s.rid) ?? remote.byId[s.rid];
		if (missing.has(s.rid)) {
			if (t && !t.done) { edit(t, [cancel(t.line)]); stats.toObsidian++; }
			continue;
		}
		if (!r) continue;
		if (!t) {
			if (!r.completed) { update.push({ id: s.rid, completed: true }); stats.toReminders++; }
			continue;
		}
		let line = t.line;
		const upd = { id: s.rid };
		const cur = { ...s };

		if (t.name !== s.name) { upd.name = cur.name = t.name; }
		else if (r.name !== s.name) { line = setName(line, r.name); cur.name = r.name; }

		if (t.due !== s.due) { cur.due = t.due; if (t.due) upd.due = t.due; else upd.clearDue = true; }
		else if (r.due !== s.due) { line = setDue(line, r.due); cur.due = r.due; }

		let lines = [line];
		if (t.done !== s.done) { upd.completed = cur.done = t.done; }
		else if (r.completed !== s.done) {
			cur.done = r.completed;
			lines = r.completed ? complete(line, t.file.path) : [uncomplete(line)];
			if (lines.length > 1) spawnedRecurrence = true;
		}

		if (Object.keys(upd).length > 1) { update.push(upd); stats.toReminders++; }
		if (lines.length > 1 || lines[0] !== t.line) { edit(t, lines); stats.toObsidian++; }
		if (!cur.done) newState[uid] = cur; // finished items stop being tracked
	}

	// 4. Open tasks without a link → new reminders
	for (const t of tasks) {
		const ownsId = t.id && byUid.get(t.id) === t;
		if (t.done || (ownsId && state.tasks[t.id])) continue;
		const uid = ownsId ? t.id : newUid();
		if (uid !== t.id) edit(t, [withId(t.line, uid)]);
		create.push({ uid, list: areas[t.file.basename], name: t.name, due: t.due ?? undefined });
		newState[uid] = { rid: null, name: t.name, due: t.due, done: false };
	}

	// 5. Open reminders without a link → new tasks
	const filesByArea = Object.fromEntries(files.map((f) => [f.basename, f]));
	for (const [rid, r] of openById) {
		if (knownRids.has(rid)) continue;
		const uid = newUid();
		const name = r.name.replace(/\s+/g, " ").trim();
		const path = filesByArea[r.area].path;
		if (!appends.has(path)) appends.set(path, []);
		appends.get(path).push(`- [ ] ${name}${r.due ? ` 📅 ${r.due}` : ""} 🆔 ${uid}`);
		newState[uid] = { rid, name, due: r.due, done: false };
		stats.imported++;
	}

	// 6. Write to Reminders
	const applied = create.length || update.length ? await bridge("apply", { create, update }) : { created: {}, errors: [] };
	for (const [uid, rid] of Object.entries(applied.created)) { newState[uid].rid = rid; stats.created++; }
	for (const [uid, s] of Object.entries(newState)) if (!s.rid) delete newState[uid]; // failed creates retry next run

	// 7. Write to Obsidian
	for (const file of files) {
		const fileEdits = edits.get(file.path);
		const fileAppends = appends.get(file.path);
		if (!fileEdits && !fileAppends) continue;
		await app.vault.process(file, (text) => {
			const lines = text.split("\n");
			for (const [lineNo, { from, to }] of [...(fileEdits ?? new Map())].sort((a, b) => b[0] - a[0])) {
				const at = lines[lineNo] === from ? lineNo : lines.indexOf(from);
				if (at >= 0) lines.splice(at, 1, ...to);
			}
			if (fileAppends) {
				while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
				lines.push(...fileAppends, "");
			}
			return lines.join("\n");
		});
	}

	await app.vault.adapter.write(STATE_PATH, JSON.stringify({ lastSync: new Date().toISOString(), tasks: newState }, null, 2));
	return { stats, errors: applied.errors, again: spawnedRecurrence };
};

try {
	await ensureBridge();
	let result = await sync();
	if (result.again) result = await sync(); // push freshly spawned recurring tasks right away
	const { stats, errors } = result;
	const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	const changes = [
		stats.created && `${stats.created} new → Reminders`,
		stats.imported && `${stats.imported} new ← Reminders`,
		stats.toReminders && `${stats.toReminders} updated → Reminders`,
		stats.toObsidian && `${stats.toObsidian} updated ← Reminders`,
	].filter(Boolean);
	if (errors.length) new Notice(`Reminders sync errors:\n${errors.join("\n")}`, 10000);
	if (changes.length) new Notice(`Reminders: ${changes.join(", ")}`);
	return `🔄 Reminders synced at ${time}${changes.length ? ` · ${changes.join(", ")}` : ""}`;
} catch (e) {
	console.error("Reminders sync failed", e);
	new Notice(`Reminders sync failed: ${e.message}`, 10000);
	return `⚠️ Reminders sync failed: ${e.message}`;
} finally {
	window.__remindersSyncRunning = false;
}
