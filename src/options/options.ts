import { $m } from '../utils'
import { getSettings } from '../getSettings'

// Save options to storage
function updateSetting(event: Event) {
	const target = event.target as HTMLInputElement
	const key = target.dataset.setting as string
	const value = target.checked
	browser.storage.sync.set({ [key]: value })

	document.querySelector('#message')?.classList.remove('hidden')
}

async function init() {
	const settings = await getSettings()
	for (const settingInput of ($m('.option input') as NodeListOf<HTMLInputElement>)) {
		const key = settingInput.dataset.setting as string
		settingInput.checked = settings[key]
		settingInput.addEventListener('change', updateSetting)
	}
}

init()
