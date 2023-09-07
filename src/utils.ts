/*
	Helper functions
*/

export const $m = document.querySelectorAll.bind(document)
export const log = (...args: unknown[]) => {
	console.log(`[BIU Moodle Fixer @ ${new Date().toLocaleTimeString()}]:`, ...args)
}
