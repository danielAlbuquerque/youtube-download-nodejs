const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path')
const { promisify } = require('util')

const infoVideo = promisify(ytdl.getInfo)

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'videos')))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')))

app.post('/download', async (req, res) => {
    try {
        const info = await infoVideo(req.body.url.replace('https://www.youtube.com/watch?v=', ''))
        ytdl(req.body.url)
            .pipe(fs.createWriteStream(`videos/${info.title}.mp4`))
            .on('finish', () => {
                console.log('entrei aqui')
                res.status(200).json({video: `${info.title}.mp4`})
            })
    } catch (err) {
        res.status(500).json(err)
    }
})

const port = process.env.PORT || 8080

app.listen(port)
