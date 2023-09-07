import { $m, log } from './utils'
import { icons, ogIcons } from './iconsData'
import css from './style/replaceBadIcons.scss'

// All the icons that we want to replace have their `src` URL prefixed by this string
const ICON_URL_PREFIX = 'https://lemida.biu.ac.il/theme/image.php/learnr'

const fixedIconsMap = {
	'assign'     : icons.assignment,
	'forum'      : icons.forum,
	'url'        : icons.link,
	'page'       : icons.page,
	'mod_page'   : icons.page,
	'videostream': icons.recording,
	'scorm'      : icons.scorm,
	// If you find the original icons for the above, please let me know!

	'folder'  : ogIcons.folder,
	'glossary': ogIcons.glossary,
	...Object.entries(ogIcons).reduce((currentObj, [iconName, iconData]) => {
		currentObj[iconName + '-24'] = iconData
		return currentObj
	}, ({} as Record<string, string>)),
}

export function replaceBadIcons() {
	for (const [oldSrcInfix, newSrc] of Object.entries(fixedIconsMap)) {
		const selector = `.activityicon[src^="${ICON_URL_PREFIX}"][src*="${oldSrcInfix}"], .icon[src^="${ICON_URL_PREFIX}"][src*="${oldSrcInfix}"]`
		$m<HTMLImageElement>(selector).forEach(el => {
			el.src = newSrc
			el.parentElement?.classList.add('custom-icon')
			el.classList.add('nofilter')
		})
	}

	GM_addStyle(css)

	log('Replace Bad Icons applied')
}
