const path = require('path')
const express = require('express')
const mainRouter = express.Router()
const PlayerList = []

mainRouter.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Views/Login.html'))
})

module.exports = mainRouter
