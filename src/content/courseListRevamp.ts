import { $m, log } from '../utils'

const COURSE_LIST_REVAMP_CLASS = 'course-list-revamp'

export function courseListRevamp() {
	// Avoid running twice on the same page
	if (document.body.classList.contains(COURSE_LIST_REVAMP_CLASS)) return

	document.body.classList.add(COURSE_LIST_REVAMP_CLASS)

	const isHebrew = document.documentElement.lang === 'he'

	const courseLinks = $m<HTMLElement>('.block-fcl__list__item--course a')
	for (const courseLink of courseLinks) {
		// The third out of the three nodes contains the name of the course
		const courseTextNode = courseLink.childNodes[2]

		const courseNameRaw = courseTextNode.textContent?.trim() ?? ''
		const courseNameEnglishStart = courseNameRaw.search(/[A-z]/)
		console.log(courseNameRaw, courseNameEnglishStart)
		const courseName = courseNameEnglishStart === -1
			? courseNameRaw
			: isHebrew
				? courseNameRaw.slice(0, courseNameEnglishStart)
				: courseNameRaw.slice(courseNameEnglishStart)

		const courseNumber = courseLink.title.substring(2) ?? '0'

		const spanCourseName = document.createElement('span')
		spanCourseName.classList.add('text-overflow-ellipsis')
		spanCourseName.textContent = courseName

		const spanCourseNumber = document.createElement('span')
		spanCourseNumber.textContent = courseNumber

		courseLink.replaceChild(spanCourseName, courseTextNode)
		courseLink.appendChild(spanCourseNumber)
	}

	log('Course List Revamp applied')
}
