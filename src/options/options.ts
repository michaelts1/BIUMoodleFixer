import { $m } from '../utils'
import { getSettings } from '../getSettings'

// Save options to storage
function updateSetting(event: Event) {
	console.log(event)
	const key = event.target?.id
	const value = event.target?.checked
	browser.storage.sync.set({ [key]: value })

	document.querySelector('#message')!.classList.remove('hidden')
}

async function init() {
	const settings = await getSettings()
	for (const settingInput of $m('.option input')) {
		settingInput.checked = settings[settingInput.id]
		settingInput.addEventListener('change', updateSetting)
	}
}

init()
