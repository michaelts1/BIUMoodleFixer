import { build } from 'esbuild'
import { cp } from 'fs/promises'
import webExt from 'web-ext'

const transpile = (inFile, outFile) => build({
	bundle: true,
	entryPoints: [inFile],
	outfile: outFile,
})

const transpileAll = () => Promise.all([
	transpile('src/content/index.ts', 'build/index.js'),
	transpile('src/content/style/index.css', 'build/index.css'),
	transpile('src/background.ts', 'build//background.js'),
	transpile('src/options/options.ts', 'build/options.js'),
	transpile('src/options/options.css', 'build/options.css'),
	cp('./public', './build', { force: true, recursive: true }),
])

const packageFirefox = async () => {
	await webExt.cmd.lint(
		{
			shouldExitProgram: false,
			sourceDir: './build',
			warningsAsErrors: true,
		},
		{ shouldExitProgram: false},
	)

	await webExt.cmd.build({
		artifactsDir: './dist',
		overwriteDest: true,
		sourceDir: './build',
	})
}

await transpileAll()
await packageFirefox()
