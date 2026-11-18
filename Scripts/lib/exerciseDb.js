// Shared helpers for the free-exercise-db (https://github.com/yuhonas/free-exercise-db):
// load the cached database, create an exercise note from a database entry, image URLs.
// Used by Scripts/importExercise.js, Scripts/planWorkout.js and Scripts/stretchPlan.js.
//
// Load it like the other scripts and call the returned functions:
//   const db = await run("Scripts/lib/exerciseDb.js");
//   const list = await db.load();

const { Notice, requestUrl } = obsidian;
const SOURCE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const IMAGES = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const CACHE_DIR = "Scripts/cache";
const CACHE = `${CACHE_DIR}/exercises.json`;
const FOLDER = app.plugins.plugins["workout-planner"]?.settings?.exerciseFolderPath ?? "Training/Exercises";
const TEMPLATE = "Templates/Exercise.md";

// free-exercise-db muscle names → Workout Planner's canonical muscle groups (used for `tags`).
// `tags` only holds the primary groups (max 3): Workout Planner's heatmap gives every tag the
// full volume of a set, so adding secondary muscles there would over-count them.
const MUSCLE_GROUPS = {
	abdominals: "abs", abductors: "glutes", adductors: "quads", biceps: "biceps", calves: "calves",
	chest: "chest", forearms: "forearms", glutes: "glutes", hamstrings: "hamstrings", lats: "back",
	"lower back": "back", "middle back": "back", neck: "traps", quadriceps: "quads",
	shoulders: "shoulders", traps: "traps", triceps: "triceps",
};
const EXERCISE_TYPES = { cardio: "cardio", stretching: "flexibility" }; // everything else: strength

const safeName = (name) => name.replace(/[\\/:*?"<>|#^[\]]/g, "-").replace(/\s+/g, " ").trim();
const imageUrls = (entry) => (entry?.images ?? []).map((img) => IMAGES + encodeURI(img));

let cached = window.__exerciseDbCache ?? null;

// The whole database (array). Downloaded once and kept in Scripts/cache (git-ignored).
async function load() {
	if (cached) return cached;
	if (await app.vault.adapter.exists(CACHE)) {
		cached = JSON.parse(await app.vault.adapter.read(CACHE));
	} else {
		new Notice("Downloading exercise database…");
		const res = await requestUrl({ url: SOURCE });
		cached = res.json;
		if (!(await app.vault.adapter.exists(CACHE_DIR))) await app.vault.adapter.mkdir(CACHE_DIR);
		await app.vault.adapter.write(CACHE, res.text);
	}
	window.__exerciseDbCache = cached;
	return cached;
}

// Database entry for an exercise note (`source: free-exercise-db/<id>`), or by name.
async function entryFor(noteOrName) {
	const list = await load();
	if (typeof noteOrName !== "string") {
		const src = String(app.metadataCache.getFileCache(noteOrName)?.frontmatter?.source ?? "");
		const id = src.startsWith("free-exercise-db/") ? src.slice("free-exercise-db/".length) : null;
		const byId = id && list.find((x) => x.id === id);
		if (byId) return byId;
		noteOrName = noteOrName.basename;
	}
	const n = safeName(noteOrName).toLowerCase();
	return list.find((x) => safeName(x.name).toLowerCase() === n) ?? null;
}

// Creates Training/Exercises/<name>.md from Templates/Exercise.md, or returns the existing note.
async function createNote(entry) {
	const name = safeName(entry.name);
	const path = `${FOLDER}/${name}.md`;
	const existing = app.vault.getAbstractFileByPath(path);
	if (existing) return { file: existing, created: false };

	const images = imageUrls(entry).map((url) => `![${name}|300](${url})`).join(" ");
	const steps = entry.instructions.map((s, i) => `${i + 1}. ${s}`).join("\n");
	const content = (await app.vault.adapter.read(TEMPLATE))
		.replace(/^<%\*[\s\S]*?-?%>\n?/, "") // drop the "ask for a name" Templater step
		.replaceAll("<% tp.file.title %>", name)
		.replace("<!-- instructions -->", `${images}\n\n${steps}`);
	if (!app.vault.getAbstractFileByPath(FOLDER)) await app.vault.createFolder(FOLDER);
	const file = await app.vault.create(path, content);
	await app.fileManager.processFrontMatter(file, (fm) => {
		Object.assign(fm, {
			exercise_name: name,
			exercise_type: EXERCISE_TYPES[entry.category] ?? "strength",
			tags: [...new Set(entry.primaryMuscles.map((m) => MUSCLE_GROUPS[m]).filter(Boolean))].slice(0, 3),
			equipment: entry.equipment ? [entry.equipment] : [],
			primary_muscles: entry.primaryMuscles,
			secondary_muscles: entry.secondaryMuscles.filter((m) => !entry.primaryMuscles.includes(m)),
			level: entry.level,
			category: entry.category,
			source: `free-exercise-db/${entry.id}`,
		});
	});
	return { file, created: true };
}

return { load, entryFor, createNote, imageUrls, safeName, FOLDER };
