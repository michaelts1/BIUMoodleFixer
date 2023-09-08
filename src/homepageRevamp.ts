import { $m, log } from './utils'
import css from './style/homepageRevamp.scss'

export function homepageRevamp() {
	// Move the login button to the side of the logo
	const logoImgContainer = document.querySelector('#branding') as HTMLDivElement
	const logoImg = logoImgContainer.querySelector('#logoimg') as HTMLDivElement
	const loginBtn = logoImgContainer.querySelector('.loginbtn') as HTMLDivElement
	logoImg.appendChild(loginBtn)

	// Make the login page open in the same tab
	const loginLink = loginBtn.querySelector('a[href*="login.php"]') as HTMLAnchorElement
	loginLink.removeAttribute('target')

	// Update layout if logged in
	if (document.querySelector('#user-menu-toggle')) {
		logoImg.classList.add('logged-in')

		// Move all course boxes to be immediate children of the first container
		const courseBoxesContainer = document.querySelector('#frontpage-course-list .container-fluid') as HTMLDivElement
		const courseBoxes = $m('.category-course-list-all .col-md-4')
		courseBoxesContainer.replaceChildren(...courseBoxes)

		// Remove the now-empty containers
		$m('.category-course-list-all .container-fluid:not(:nth-child(1 of .container-fluid))')
			.forEach(el => el.remove())
	}

	GM_addStyle(css)

	log('Homepage Revamp applied')
}
