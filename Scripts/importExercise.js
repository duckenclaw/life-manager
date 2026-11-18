// Meta Bind button: search the free-exercise-db (800+ public-domain exercises) and create
// an exercise page in Training/Exercises from Templates/Exercise.md, filled with equipment,
// muscles, level, instructions and images. The database is downloaded once and cached.
// https://github.com/yuhonas/free-exercise-db

const { FuzzySuggestModal, Notice } = obsidian;
const run = async (script, args) => { const code = await app.vault.adapter.read(script); const F = Object.getPrototypeOf(async function () {}).constructor; return new F("app", "obsidian", "args", code)(app, obsidian, args); };
const lib = await run("Scripts/lib/exerciseDb.js");

let db;
try {
	db = await lib.load();
} catch (e) {
	new Notice(`Could not load the exercise database: ${e.message}`);
	return;
}

const existing = new Set(app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${lib.FOLDER}/`)).map((f) => f.basename.toLowerCase()));

const exercise = await new Promise((resolve) => {
	class ExerciseModal extends FuzzySuggestModal {
		getItems() { return db; }
		getItemText(x) { return `${x.name} ${x.equipment ?? ""} ${x.primaryMuscles.join(" ")}`; }
		renderSuggestion(match, el) {
			const x = match.item;
			el.createDiv({ text: `${existing.has(lib.safeName(x.name).toLowerCase()) ? "✓ " : ""}${x.name}` });
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

const { file, created } = await lib.createNote(exercise);
new Notice(created ? `Imported ${file.basename}` : `${file.basename} is already in your library`);
await app.workspace.getLeaf("tab").openFile(file);
