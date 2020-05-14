const express = require('express')
var cors = require('cors')
const config = require('./src/config')
const cambridge = require('./src/scraper/cambridge-scraper')

const app = express()
app.use(cors())

const cache = {}

app.get('/search/:word', (req, res) => {
    if(cache[req.params.word]) {
        res.json(cache[req.params.word])
    } else {
        cambridge.scrap(req.params.word).then(def => {
            cache[req.params.word] = def
            res.json(def)
        })
    }
})

app.listen({ port: config.port }, () => {
    console.log(`Server is listening on port ${ config.port }...`)
})