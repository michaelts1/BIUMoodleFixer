import { build } from 'esbuild'

build({
	bundle: true,
	entryPoints: ['src/content/index.ts'],
	outfile: 'dist/index.js',
})

build({
	bundle: true,
	entryPoints: ['src/content/style/index.css'],
	outfile: 'dist/index.css',
})

build({
	bundle: true,
	entryPoints: ['src/options/options.ts'],
	outfile: 'dist/options.js',
})

build({
	entryPoints: ['src/options/options.css'],
	outfile: 'dist/options.css',
})
