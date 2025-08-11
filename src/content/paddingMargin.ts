import { $m, log } from '../utils'

const PADDING_MARGIN_CLASSNAME = 'biu-fixer-padding-margin-on'

export function paddingMargin() {
	document.body.classList.add('padding-margin')
	$m('.block-fcl__list__item--course').forEach(el => el.classList.add(PADDING_MARGIN_CLASSNAME))
	log('PaddingMargin applied')
}
