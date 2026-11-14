// Opens Workout Planner's Quick Log pop-up prefilled with a planned exercise, reps and weight.
// args = { exercise, reps, weight, workout, page }
//
// The plugin doesn't export its log modal, so the class is captured once from the plugin's own
// openModal() (Modal.open is intercepted for that one call, nothing is shown) and cached.
// If that ever fails (plugin update), a minimal pop-up writes the set through the plugin instead.

const { Modal, Setting, Notice } = obsidian;
const plugin = app.plugins.plugins["workout-planner"];
if (!plugin) {
	new Notice("Install and enable the Workout Planner plugin first.");
	return;
}
const values = { exercise: args.exercise, reps: args.reps, weight: args.weight, workout: args.workout };
const pageLink = args.page ? `[[${args.page}]]` : undefined;

function captureLogModal() {
	if (window.__wpLogModalClass) return window.__wpLogModalClass;
	if (!plugin.createLogModalHandler?.openModal) return null;
	const original = Modal.prototype.open;
	let captured = null;
	Modal.prototype.open = function () { captured = this.constructor; };
	try { plugin.createLogModalHandler.openModal(); } catch (e) { console.error(e); } finally { Modal.prototype.open = original; }
	if (captured && captured !== Modal) window.__wpLogModalClass = captured;
	return window.__wpLogModalClass ?? null;
}

const LogModal = captureLogModal();
if (LogModal) {
	try {
		// (app, plugin, exerciseName, currentPageLink, initialValues, hideWorkoutToggle)
		new LogModal(app, plugin, args.exercise, pageLink, values, true).open();
		return;
	} catch (e) {
		console.error("Quick Log prefill failed, using the fallback", e);
		window.__wpLogModalClass = null;
	}
}

// Fallback: own small pop-up
const m = new Modal(app);
let reps = String(values.reps ?? ""), weight = String(values.weight ?? "");
m.titleEl.setText(args.exercise);
const num = (t, v, set) => { t.inputEl.type = "number"; t.inputEl.inputMode = "decimal"; t.setValue(v).onChange(set); };
new Setting(m.contentEl).setName("Reps").addText((t) => num(t, reps, (v) => (reps = v)));
new Setting(m.contentEl).setName("Weight (kg)").addText((t) => num(t, weight, (v) => (weight = v)));
new Setting(m.contentEl).addButton((b) => b.setButtonText("Log set").setCta().onClick(async () => {
	const r = Number(reps) || 0, w = Number(weight) || 0;
	await plugin.addWorkoutLogEntry({
		date: new Date().toISOString(), exercise: args.exercise, reps: r, weight: w, volume: r * w,
		origine: pageLink ?? "[[Workout Charts Plugin]]", workout: values.workout || undefined, protocol: "standard",
	});
	new Notice(`Logged ${args.exercise}: ${w} kg × ${r}`);
	m.close();
}));
m.open();
