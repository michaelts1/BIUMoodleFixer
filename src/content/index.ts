import { courseListRevamp } from './courseListRevamp'
import { getSettings } from '../getSettings'
import { paddingMargin } from './paddingMargin'
import { restoreOldIcons } from './restoreOldIcons'

async function init() {
	const settings = await getSettings()

	if (settings.courseListRevamp) courseListRevamp()
	if (settings.restoreOldIcons) restoreOldIcons()
	if (settings.paddingMargin) paddingMargin()
}

init()
