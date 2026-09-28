// Meta Bind button: search the free-exercise-db (800+ public-domain exercises) and create
// an exercise page in Training/Exercises from Templates/Exercise.md, filled with equipment,
// muscles, level, instructions and images. The database is downloaded once and cached.
// https://github.com/yuhonas/free-exercise-db

const { FuzzySuggestModal, Notice, requestUrl } = obsidian;
const SOURCE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const IMAGES = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const CACHE_DIR = "Scripts/cache";
const CACHE = `${CACHE_DIR}/exercises.json`;
const FOLDER = app.plugins.plugins["workout-planner"]?.settings?.exerciseFolderPath ?? "Training/Exercises";
const TEMPLATE = "Templates/Exercise.md";

// free-exercise-db muscle names → Workout Planner's canonical muscle groups (used for `tags`)
const MUSCLE_GROUPS = {
	abdominals: "abs", abductors: "glutes", adductors: "quads", biceps: "biceps", calves: "calves",
	chest: "chest", forearms: "forearms", glutes: "glutes", hamstrings: "hamstrings", lats: "back",
	"lower back": "back", "middle back": "back", neck: "traps", quadriceps: "quads",
	shoulders: "shoulders", traps: "traps", triceps: "triceps",
};
const EXERCISE_TYPES = { cardio: "cardio", stretching: "flexibility" }; // everything else: strength

const safeName = (name) => name.replace(/[\\/:*?"<>|#^[\]]/g, "-").replace(/\s+/g, " ").trim();

let db;
try {
	if (await app.vault.adapter.exists(CACHE)) {
		db = JSON.parse(await app.vault.adapter.read(CACHE));
	} else {
		new Notice("Downloading exercise database…");
		const res = await requestUrl({ url: SOURCE });
		db = res.json;
		if (!(await app.vault.adapter.exists(CACHE_DIR))) await app.vault.adapter.mkdir(CACHE_DIR);
		await app.vault.adapter.write(CACHE, res.text);
	}
} catch (e) {
	new Notice(`Could not load the exercise database: ${e.message}`);
	return;
}

const existing = new Set(app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${FOLDER}/`)).map((f) => f.basename.toLowerCase()));

const exercise = await new Promise((resolve) => {
	class ExerciseModal extends FuzzySuggestModal {
		getItems() { return db; }
		getItemText(x) { return `${x.name} ${x.equipment ?? ""} ${x.primaryMuscles.join(" ")}`; }
		renderSuggestion(match, el) {
			const x = match.item;
			el.createDiv({ text: `${existing.has(safeName(x.name).toLowerCase()) ? "✓ " : ""}${x.name}` });
			el.createEl("small", { text: [x.equipment, x.primaryMuscles.join(", "), x.level].filter(Boolean).join(" · "), cls: "mod-muted" });
		}
		onChooseItem(x) { resolve(x); }
		onClose() { setTimeout(() => resolve(null), 0); }
	}
	const modal = new ExerciseModal(app);
	modal.setPlaceholder("Search exercises (name, equipment or muscle)…");
	modal.open();
});
if (!exercise) return;

const name = safeName(exercise.name);
const path = `${FOLDER}/${name}.md`;
let file = app.vault.getAbstractFileByPath(path);

if (!file) {
	const images = exercise.images.map((img) => `![${name}|300](${IMAGES}${encodeURI(img)})`).join(" ");
	const steps = exercise.instructions.map((s, i) => `${i + 1}. ${s}`).join("\n");
	const content = (await app.vault.adapter.read(TEMPLATE))
		.replace(/^<%\*[\s\S]*?-?%>\n?/, "") // drop the "ask for a name" Templater step
		.replaceAll("<% tp.file.title %>", name)
		.replace("<!-- instructions -->", `${images}\n\n${steps}`);
	if (!app.vault.getAbstractFileByPath(FOLDER)) await app.vault.createFolder(FOLDER);
	file = await app.vault.create(path, content);
	const muscles = [...exercise.primaryMuscles, ...exercise.secondaryMuscles];
	await app.fileManager.processFrontMatter(file, (fm) => {
		Object.assign(fm, {
			exercise_name: name,
			exercise_type: EXERCISE_TYPES[exercise.category] ?? "strength",
			tags: [...new Set(muscles.map((m) => MUSCLE_GROUPS[m]).filter(Boolean))],
			equipment: exercise.equipment ? [exercise.equipment] : [],
			primary_muscles: exercise.primaryMuscles,
			secondary_muscles: exercise.secondaryMuscles,
			level: exercise.level,
			category: exercise.category,
			source: `free-exercise-db/${exercise.id}`,
		});
	});
	new Notice(`Imported ${name}`);
} else {
	new Notice(`${name} is already in your library`);
}
await app.workspace.getLeaf("tab").openFile(file);
