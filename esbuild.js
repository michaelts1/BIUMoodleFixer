import { build } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'

const USERSCRIPT_BANNER = {
	js: `// ==UserScript==
// @name        BIU Moodle Fixer
// @namespace   Violentmonkey Scripts
// @match       https://lemida.biu.ac.il/*
// @grant       GM_addStyle
// @version     1.0
// @author      Michael Tsaban
// @description Partially fixes the new Moodle design.
// ==/UserScript==
  `,
}

await build({
	banner: USERSCRIPT_BANNER,
	bundle: true,
	entryPoints: ['src/index.ts'],
	legalComments: 'inline',
	loader: { '.png': 'dataurl' },
	outfile: 'dist/biuMoodleFixer.user.js',
	plugins: [ sassPlugin({ type: 'css-text' }) ],
	target: [ 'firefox100', 'chrome100' ],
})
