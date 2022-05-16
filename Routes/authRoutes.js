
const UIDlib = require("../scripts/HashGen")
const path = require('path')
const express = require('express')
const authRoutes = express.Router()
let AuthList = [];
let AbleToJoin = true;
const PlayerLimit = 3;


authRoutes.post('/ACK',function (req, res) {
    let temp = {playerName: req.body.playerName,
               UID: req.body.UID}

   let Auth = AuthList.filter((data) => {
       if(data.UID == temp.UID){
           return data.UID
       }
   })

   if(Auth.length <= 0){
      // res.redirect('/');
      let temp = "/";
       res.json(temp)
   }else if(Auth.length == 1){
       console.log("Handshaking Auth successful!");
       let temp = "Sucess!"
       res.json(temp)
   }
})

authRoutes.post('/AddNewConnection',function (req, res) {
    console.log('Creating the following student:', req.body.playerName)
    console.log("UID: ", req.body.UID)

    let  Temp = {
        playerName: req.body.playerName,
        UID: req.body.UID

    };
    AuthList.push(Temp)
    console.log("Current Queue: ")
    console.log(AuthList)
    res.redirect('/Queue')
})

authRoutes.post('/GenerateNewUID',function (req, res) {
    console.log('Creating an UID for the following Player:', req.body.playerName)
    let UID = UIDlib.GenerateUniqueHash(req.body.playerName)
    let reponse_ = ""
    console.log("current Auth List: ", AuthList)
    AuthList.forEach(data =>{
        console.log("Data: ", data)
        if(data.UID == UID){
            console.log("Yoo name in use")
            reponse_ = "FAILED"
        }
    })
    if(reponse_ != "FAILED"){
        console.log("Passed UID check")
        reponse_ = UID.toString()
    }
    res.json(reponse_)
})

authRoutes.get("/LobbyOpen", function (req, res) {
    res.json(AbleToJoin)
})

authRoutes.get("/GameOpen", function (req, res) {
    if(AuthList.length < PlayerLimit){
        AbleToJoin = true;
        let temp = "/";
        res.json(temp)
    }else{
        let temp = "Open"
        res.json(temp)
    }
})

authRoutes.get('/ReturnPlayers',function (req, res) {
    res.json(AuthList)
})

authRoutes.post('/Dequeue', function (req, res) {
    console.log('Dequeueing the following student:', req.body.playerName)
    console.log("PlayerList: ", this.AuthList)
    let NewList = []
    AuthList.forEach((data) =>{
        if(data.UID != req.body.UID){
            let tempFix = {playerName: data.playerName, UID: data.UID}
            NewList.push(tempFix);
        }
    })
    console.log("New player list");
    console.log(NewList)
    AuthList = NewList
    Joined = NewList
    res.redirect('/')

})

authRoutes.get('/Status', function (req, res) {

    if(AuthList.length >= PlayerLimit){
        AbleToJoin = false;
        let temp = "/Game";
        res.json(temp)
    }else{
        let temp = "/waiting"
        res.json(temp);
    }


})



module.exports = authRoutes;
