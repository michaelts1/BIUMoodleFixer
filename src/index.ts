import { options } from './options' // Keep this import first to preserve its comments at the top of the script

import { courseListRevamp } from './courseListRevamp'
import { paddingMargin } from './paddingMargin'
import { replaceBadIcons } from './replaceBadIcons'

if (options.courseListRevamp) courseListRevamp()
if (options.replaceBadIcons) replaceBadIcons()
if (options.paddingMargin) paddingMargin()
