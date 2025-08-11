const DEFAULT_OPTIONS = {
	courseListRevamp: true,
	paddingMargin: false,
	restoreOldIcons: false,
}

export async function getSettings() {
	let settings = await chrome.storage.sync.get()
	if (!settings || Object.keys(settings).length === 0) {
		await chrome.storage.sync.set(DEFAULT_OPTIONS)
		settings = await chrome.storage.sync.get()
	}

	return settings
}
