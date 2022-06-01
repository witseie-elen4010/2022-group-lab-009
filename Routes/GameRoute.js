const path = require('path')
const express = require('express')
const gameRouter = express.Router()
const DB = require('../scripts/dbInteraction')
let GameInProgress = true;
let SyncList = [];
let GMWordle = false;
let GMUID = ""
let gameWord = "";
let counter = 0;

gameRouter.get('/', (req, res) => {
    if(GMWordle == false && counter == 0){
        counter += 1;
        DB.getRandomWord().then((data)=>{
            console.log("Word for Game is: ", data)
            gameWord = data;   
        })
    }
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

gameRouter.post('/CheckWord',function (req, res) {
    DB.IsLegalWord(req.body.Word).then((data)=>{
        res.json(data);
    })
})

gameRouter.post('/IncreaseScore',function (req, res) {
    DB.IncrementStreak(req.body.UID);
})

gameRouter.post('/EndStreak',function (req, res) {
    DB.ResetStreak(req.body.UID);
})

gameRouter.post('/PlayerHighScore',function (req, res) {
    DB.ViewHighScore(req.body.UID).then(data =>{
        console.log("we got a High score of: ",data)
        let temp = {UID: req.body.UID, HighScore: data}
        res.json(temp);
    })
})


gameRouter.get('/GetSync',function (req, res) {
    res.json(SyncList);
})

gameRouter.get('/CloseSync',function (req, res) {
    SyncList = [];
    counter = 0;
    res.json('/')
})

gameRouter.get('/GetWord',function (req, res) {
    res.json(gameWord)
})

gameRouter.post('/ChangeGameMode',function (req, res) {
    console.log("ChangeGameMode function hit!")
    console.log("GameMode: ", req.body.gameMode)
    console.log("Changed by: ", req.body.UID)
    GMWordle = req.body.gameMode;
    if(req.body.gameMode == true){
        GMUID = req.body.UID;
        gameWord = req.body.Word;
        console.log("Word fo GM game is: ", gameWord)
    }else if(req.body.gameMode == false){
        GMUID = ""
       // gameWord = "" get plug from zhuo here
       gameWord = '';
    }
})

gameRouter.post('/ClearGameMode',function (req, res) {
    console.log("ClearGameMode function hit!")
    GMWordle = false;
    GMUID = ""
    gameWord = "";
    counter = 0;
  
})

gameRouter.get('/GetGameMode',function (req, res) {
    let temp = {
        gameMode: GMWordle,
        UID: GMUID
    }
    res.json(temp)
})

module.exports = gameRouter
