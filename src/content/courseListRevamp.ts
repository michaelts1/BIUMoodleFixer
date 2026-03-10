import { $m, log } from '../utils'

const COURSE_LIST_REVAMP_CLASS = 'course-list-revamp'

function extractLangName(coursenameRaw: string) {
	/* To account for Hebrew course names that include some English letters (such as
		"אנגלית רמה M2 (2 ש''ס)"), we create a regex that looks for the first English letter that comes
		*after* the *last* Hebrew letter ("Script=Hebr") in the course name, then accepts all text before that
		English letter.
		This way we also include non-hebrew characters such as the parentheses in the example above. */
	const coursenameRegex = /(?<he>.*\p{Script=Hebr}\P{Script=Latin}*)(?<en>.*)/u
	const match = coursenameRaw.match(coursenameRegex)
	if (!match || !match.groups) return coursenameRaw
	
	const isHebrew = document.documentElement.lang === 'he'
	// In case one of the languages is missing
	return isHebrew
		? match.groups.he || coursenameRaw
		: match.groups.en || coursenameRaw
}

function extractCourseNumber(courseNumberRaw: string) {
	/* The course number might be a stringified number with the first two digits dedicated to the
		year of the course (e.g. "86123" for course number 123 in the year תשפ"ו), or it might be
		an unrelated string (e.g. "אגף הוראה"). */
	const isNumber = !isNaN(+courseNumberRaw)
	const courseNumber = isNumber ? courseNumberRaw.slice(2) : courseNumberRaw
	return courseNumber ?? '---'
}

export function courseListRevamp() {
	// Avoid running twice on the same page
	if (document.body.classList.contains(COURSE_LIST_REVAMP_CLASS)) return

	document.body.classList.add(COURSE_LIST_REVAMP_CLASS)

	const courseLinks = $m<HTMLElement>('.block-fcl__list__item--course a')
	for (const courseLink of courseLinks) {
		// The third out of the three nodes contains the name of the course
		const courseTextNode = courseLink.childNodes[2]
		const courseNameRaw = courseTextNode.textContent?.trim() ?? ''
		const courseName = extractLangName(courseNameRaw)
		const courseNumber = extractCourseNumber(courseLink.title)

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
