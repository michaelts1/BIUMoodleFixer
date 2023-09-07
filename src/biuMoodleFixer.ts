/*
	Helper functions
*/

const $m = document.querySelectorAll.bind(document)
const log = (...args: unknown[]) => {
	console.log(`[BIU Moodle Fixer @ ${new Date().toLocaleTimeString()}]:`, ...args)
}

/*
	Shorten course names on the left-side-panel
*/

const courseLinks = $m<HTMLElement>('.block-fcl__list__item--course a')
for (const courseLink of courseLinks) {
	const courseTextNode = courseLink.childNodes[2] // The third out of the three nodes

	const spanCourseName = document.createElement('span')
	spanCourseName.classList.add('text-overflow-ellipsis')
	spanCourseName.textContent = (courseTextNode.textContent ?? '')
		.replace(/[A-z].*/, ' ') // Remove English name
		.trim() // Remove extra whitespace

	const spanCourseNumber = document.createElement('span')
	spanCourseNumber.textContent = courseLink.title.substring(2) ?? '0'

	courseLink.replaceChild(spanCourseName, courseTextNode)
	courseLink.appendChild(spanCourseNumber)
}

log('Course names style revamped')

/*
	Replace bad icons
*/

import { icons, ogIcons } from './iconsData'

// All the icons that we want to replace have their `src` URL prefixed by this string
const ICON_URL_PREFIX = 'https://lemida.biu.ac.il/theme/image.php/learnr'

const fixedIconsMap = {
	'assign'     : icons.assignment,
	'forum'      : icons.forum,
	'url'        : icons.link,
	'page'       : icons.page,
	'mod_page'   : icons.page,
	'videostream': icons.recording,
	// If you find the original icons for the above, please let me know!

	'archive-24'    : ogIcons.archive,
	'document-24'   : ogIcons.document,
	'folder'        : ogIcons.folder,
	'glossary'      : ogIcons.glossary,
	'pdf-24'        : ogIcons.pdf,
	'powerpoint-24' : ogIcons.powerpoint,
	'spreadsheet-24': ogIcons.spreadsheet,
}

window.addEventListener('load', () => {
	for (const [oldSrcInfix, newSrc] of Object.entries(fixedIconsMap)) {
		const selector = `.activityicon[src^="${ICON_URL_PREFIX}"][src*="${oldSrcInfix}"], .icon[src^="${ICON_URL_PREFIX}"][src*="${oldSrcInfix}"]`
		$m<HTMLImageElement>(selector).forEach(el => {
			el.src = newSrc
			el.parentElement?.classList.add('custom-icon')
			el.classList.add('nofilter')
		})
	}
})

log('Monotone icons replaced')

/*
	Custom styles
*/

import css from './customStyles.scss'

GM_addStyle(css)

log('Custom styles applied')
