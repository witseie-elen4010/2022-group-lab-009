const path = require('path')
const express = require('express')
const Register = require('../scripts/dbInteraction')
const DB = require('../scripts/dbInteraction')
const UIDlib = require('../scripts/HashGen')
const logRouter = express.Router()

logRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Views/logs.html'))
})

logRouter.get('/ViewLogs', (req, res) => {
    res.redirect('/Logs')
})

logRouter.get('/GetMatchLogs', (req, res) => {
    let log = []
    DB.GetMatchLogTable().then((data) => {
        log = data
        
        res.json(log)
    })
})

logRouter.get('/GetActionLogs', (req, res) => {
    let log = []
    DB.GetActionLogTable().then((data) => {
        log = data
        
        res.json(log)
    })
})

logRouter.get('/Back', (req, res) => {
    res.redirect('/')
})

module.exports = logRouter