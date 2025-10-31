import { log } from '../utils'
import { icons, ogIcons } from './iconsData'

// All the icons that we want to replace have their `src` URL prefixed by this string
const ICON_URL_PREFIX = 'https://lemida.biu.ac.il/theme/image.php/learnr'

const fixedIconsMap = {
	'assign'     : icons.assignment,
	'forum'      : icons.forum,
	'hsuforum'   : icons.forum,
	'url'        : icons.link,
	'page'       : icons.page,
	'mod_page'   : icons.page,
	'videostream': icons.recording,
	'scorm'      : icons.scorm,
	// If you find the original icons for the above, please let me know!

	...ogIcons,
}

/**
 * As of October 2025, some icons are created dinamically *after* the page has completely loaded (from
 * the browser's perspective). This interferes with our previous approach of replacing the `src` of
 * the images dynamically.
 * Therefore, we now create general CSS-rules that will effectively apply our new source URL to all
 * icons as they are created.
 *
 * While the new method can be converted to statically output the CSS code based on the icon map,
 * generating it dynamically is somewhat more readable. Specifically, note that the generated code
 * can be *fully determined* by only looking at the values of `fixedIconsMap`.
 */
export function restoreOldIcons() {
	document.body.classList.add('restore-old-icons')

	let css = ''
	for (const [identifier, newSrc] of Object.entries(fixedIconsMap)) {
		/* The `src` attribute is how we detect the type of the icon. They keyword will be either:
			1. Immediately after the common prefix (appears in the course minimap side menu),
			2. In the middle of the URL, in which case it will be immediately followed by a
				question mark (appears in the main content area, including titles of resource pages),
			3. At the very end of the URL (appears in the body of resource pages).

			("resource page" refers to the page opened by "opening in a new tab" a resource, such as an assignment).
		*/
		const iconSelector =
			':is(.icon, .activityicon):is('
			+ `[src^="${ICON_URL_PREFIX}/${identifier}/"],`
			+ `[src^="${ICON_URL_PREFIX}"][src*="/${identifier}?"],`
			+ `[src^="${ICON_URL_PREFIX}"][src$="/${identifier}"]`
			+ ')'

		// The first block applies to the icon itself, and the second block applies to its parent
		const iconCSS = `
	${iconSelector} {
		content: url("${newSrc}") !important; /* Replace icon */
		filter: none !important; /* Disable black-only filter */
	}
	:has(> :is(${iconSelector})) {
		background: none !important;
	}`

		css += iconCSS
	}

	const styleEl = document.createElement('style')
	// '#page-wrapper' is to get a higher specificity than the built-in CSS
	styleEl.textContent = `body.restore-old-icons #page-wrapper { ${css} }`
	document.body.appendChild(styleEl)

	log('Replace Bad Icons applied')
}
