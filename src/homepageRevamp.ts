import { $m, log } from './utils'
import css from './style/homepageRevamp.scss'

function loggedInRevamp() {
	const logoImg = document.querySelector('#logoimg') as HTMLElement
	logoImg.classList.add('logged-in')

	// Move all course boxes to be immediate children of the first container
	const courseBoxesContainer = document.querySelector('#frontpage-course-list .container-fluid') as HTMLElement
	const courseBoxes = $m('.category-course-list-all .col-md-4')
	courseBoxesContainer.replaceChildren(...courseBoxes)

	// Remove the now-empty containers
	$m('.category-course-list-all .container-fluid:not(:nth-child(1 of .container-fluid))')
		.forEach(el => el.remove())

	// Optimize teachers list
	for (const courseBox of courseBoxes) {
		const teachers = Array
			.from(courseBox.querySelectorAll('.teacherscourseview li'))
			.map(teacherItem => (teacherItem.textContent?.match(/(?<=מרצה: ).*/) ?? [''])[0])

		const teachersListLi = document.createElement('li')
		const teacherListPrefix = teachers.length <= 1 ? 'מרצה: ' : 'מרצים: '
		teachersListLi.textContent = teacherListPrefix + teachers.join(', ')

		courseBox.querySelector('.teacherscourseview')?.replaceChildren(teachersListLi)
	}

	GM_addStyle(css)
}

export function homepageRevamp() {
	// Make the login page open in the same tab
	const loginLink = document.querySelector('.loginbtn a[href*="login.php"]') as HTMLElement
	loginLink.removeAttribute('target')

	// Update layout if logged in
	if (document.querySelector('#user-menu-toggle')) loggedInRevamp()

	log('Homepage Revamp applied')
}
