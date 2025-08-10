const DEFAULT_OPTIONS = {
	courseListRevamp: true,
	paddingMargin: false,
	restoreOldIcons: false,
}

export async function getSettings() {
	let settings = await browser.storage.sync.get()
	if (!settings || Object.keys(settings).length === 0) {
		await browser.storage.sync.set(DEFAULT_OPTIONS)
		settings = await browser.storage.sync.get()
	}

	return settings
}
