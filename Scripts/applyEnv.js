// Meta Bind button (Home): copy values from .env into plugin settings that can't read .env.
// Currently: USDA_API_KEY → Macros plugin (USDA FoodData Central search).

const { Notice } = obsidian;

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

const env = await readEnv();
const macros = app.plugins.plugins.macros;
if (!macros) {
	new Notice("Install and enable the Macros plugin first.");
	return;
}
if (!env.USDA_API_KEY) {
	new Notice("Set USDA_API_KEY in .env first (see .env.example).");
	return;
}
Object.assign(macros.settings, { usdaApiKey: env.USDA_API_KEY, usdaEnabled: true });
await macros.saveSettings();
new Notice("USDA API key applied to Macros.");
