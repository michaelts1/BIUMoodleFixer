import fs from 'fs/promises'

const TYPE = 'low' // either 'low' or 'high'
const filenames = ['archive-24.png', 'audio-24.png', 'avi-24.png', 'bmp-24.png', 'calc-24.png', 'document-24.png', 'flash-24.png', 'gif-24.png', 'image-24.png', 'impress-24.png', 'jpeg-24.png', 'mp3-24.png', 'mpeg-24.png', 'pdf-24.png', 'png-24.png', 'powerpoint-24.png', 'quicktime-24.png', 'sourcecode-24.png', 'spreadsheet-24.png', 'text-24.png', 'tiff-24.png', 'unknown-24.png', 'video-24.png', 'wmv-24.png', 'writer-24.png']
const map = {}
const promises = []

for (const name of filenames) {
	const path = '../BIUMoodleFixer/old icons - ' + TYPE + ' res/' + name
	const promise = fs.readFile(path)
		.then(data => {
			const base64String = 'data:image/png;base64,'
								+ data.toString('base64')
			map[name.replace(/-.*/, '')] = base64String
		})
		.catch(err => {throw err})
	promises.push(promise)
}

Promise.all(promises).then(() => {
	fs.writeFile('./base64Map.txt', JSON.stringify(map))
		.then(() => console.log('done :)'))
		.catch(err => {throw err})
})
