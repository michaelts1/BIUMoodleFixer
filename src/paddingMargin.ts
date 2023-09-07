import { $m, log } from './utils'
import css from './style/paddingMargin.scss'

const PADDING_MARGIN_CLASSNAME = 'biu-fixer-padding-margin-on'

export function paddingMargin() {
	$m('.block-fcl__list__item--course').forEach(el => el.classList.add(PADDING_MARGIN_CLASSNAME))

	GM_addStyle(css)

	log('PaddingMargin applied')
}
