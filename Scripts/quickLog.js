// Meta Bind button: open Workout Planner's Quick Log pop-up to record a set.
const planner = app.plugins.plugins["workout-planner"];
if (!planner?.createLogModalHandler) {
	new obsidian.Notice("Install and enable the Workout Planner plugin first.");
	return;
}
planner.createLogModalHandler.openModal();
