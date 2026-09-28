// Meta Bind JS action: counts your public GitHub commits for the day of the
// active daily note and writes the number into its `commits` property.
// Requires: the "JS Engine" plugin, and Meta Bind settings → "Enable JavaScript".
// Only public repositories are counted (unauthenticated GitHub search API).
// Config: copy `.env.example` to `.env` in the vault root and set GITHUB_USERNAME.

const Notice = typeof obsidian !== "undefined" ? obsidian.Notice : class { constructor(m) { console.log(m); } };

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

const { GITHUB_USERNAME } = await readEnv();

const file = app.workspace.getActiveFile();
if (!file || !/^\d{4}-\d{2}-\d{2}$/.test(file.basename)) {
	new Notice("Open a daily note (YYYY-MM-DD) first.");
	return;
}
if (!GITHUB_USERNAME) {
	new Notice("Set GITHUB_USERNAME in .env (see .env.example).");
	return;
}

const day = file.basename;
const url = `https://api.github.com/search/commits?q=author:${GITHUB_USERNAME}+author-date:${day}&per_page=1`;

try {
	const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
	if (!res.ok) throw new Error(`GitHub API ${res.status}`);
	const { total_count } = await res.json();
	await app.fileManager.processFrontMatter(file, (fm) => {
		fm.commits = total_count;
	});
	new Notice(`${total_count} commit(s) on ${day}`);
} catch (e) {
	new Notice(`Could not fetch commits: ${e.message}`);
}
