const express = require('express')
const config = require('./src/config')

const app = express()

app.get('/search/:word', (req, res) => {
    res.send(req.params.word)
})

app.listen({ port: config.port }, () => {
    console.log(`Server is listening on port ${ config.port }...`)
})