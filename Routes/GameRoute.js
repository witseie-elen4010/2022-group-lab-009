const path = require('path')
const express = require('express')
const gameRouter = express.Router()
let GameInProgress = true;
let SyncList = [];

gameRouter.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Views/Game.html'))
})


gameRouter.post('/Sync',function (req, res) {
    console.log("sync function hit!")
    console.log("UID: ", req.body)
    req.body.Data.forEach(element =>{
        let temp = {UID: req.body.UID, Moves: element}
        SyncList.push(temp)
    })
    
    console.log("SyncList: ",SyncList)
})

gameRouter.get('/GetSync',function (req, res) {
    res.json(SyncList);
})

gameRouter.get('/CloseSync',function (req, res) {
    SyncList = [];
    res.json('/')
})

module.exports = gameRouter
