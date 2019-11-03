const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'source')))

if (process.env.NODE_ENV === 'production') {
	app.use('/build', express.static('build'))
} else {
	const proxy = require('express-http-proxy')
	app.use(
		'/build',
		proxy('http://localhost:3001/build', {
			proxyReqPathResolver: req =>
				'http://localhost:3001/build' + req.url,
		})
	)

	app.use('/sockjs-node', proxy('ws://localhost:3001/sockjs-node'))
}


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/part_video', (req, res) => {
    const path = 'source/source.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    console.log(req.query, fileSize)
    const start = Number(req.query.start)
    const end = Number(req.query.end)

    const chunksize = (end - start) + 1
    const file = fs.createReadStream(path, { start, end })
    const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
    }

    res.writeHead(206, head)
    file.pipe(res)
})

app.listen(3000, function () {
    console.log('Listening on port 3000!')
})