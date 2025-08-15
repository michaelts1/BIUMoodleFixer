import { $m } from '../utils'
import { getSettings } from '../getSettings'

// Save options to storage
function updateSetting(event: Event) {
	const target = event.target as HTMLInputElement
	const key = target.dataset.setting as string
	const value = target.checked
	chrome.storage.sync.set({ [key]: value })

	document.querySelector('#message')?.classList.remove('invisible')
}

function loadI18n() {
	const els = $m('[data-i18n]')
	for (const i18nElement of els as NodeListOf<HTMLElement>) {
		const key = i18nElement.dataset.i18n as string
		const localizedStr = chrome.i18n.getMessage(key)
		i18nElement.textContent = localizedStr
	}
}

// Load initial settings and set event listeners
async function loadSettings() {
	const settings = await getSettings()
	for (const settingInput of ($m('.option input') as NodeListOf<HTMLInputElement>)) {
		const key = settingInput.dataset.setting as string
		settingInput.checked = settings[key]
		settingInput.addEventListener('change', updateSetting)
	}
}

async function init() {
	loadI18n()
	await loadSettings()
}

init()
