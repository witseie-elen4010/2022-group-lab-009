const path = require('path')
const express = require('express')
const gameRouter = express.Router()
let GameInProgress = true;


gameRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Views/Game.html'))
})

module.exports = gameRouter
