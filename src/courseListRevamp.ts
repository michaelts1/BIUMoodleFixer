import { $m, log } from './utils'
import css from './style/courseListRevamp.scss'

export function courseListRevamp() {
	const courseLinks = $m<HTMLElement>('.block-fcl__list__item--course a')
	for (const courseLink of courseLinks) {
		// The third out of the three nodes contains the name of the course
		const courseTextNode = courseLink.childNodes[2]

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

	GM_addStyle(css)

	log('Course List Revamp applied')
}
