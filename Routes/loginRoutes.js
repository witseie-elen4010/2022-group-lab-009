const path = require('path')
const express = require('express')
const Register = require('../scripts/dbInteraction')
const UIDlib = require('../scripts/HashGen')
const loginRouter = express.Router()

loginRouter.post('/Register', async function (req, res) {
  const tempName = req.body.playerName
  const tempPass = req.body.userPassword
  console.log('userName: ', tempName)
  console.log('PasswordL: ', tempPass)
  const HashPass = UIDlib.GenerateUniqueHash(tempPass)
  console.log('Hashed Pass: ', HashPass)
  let response =  await Register.RegisterPlayer(tempName, HashPass)
  res.json(response);
})

loginRouter.post('/Login', function (req, res) {
  const tempName = req.body.playerName
  const tempPass = req.body.userPassword
  console.log('userName: ', tempName)
  console.log('PasswordL: ', tempPass)
  const HashPass = UIDlib.GenerateUniqueHash(tempPass)
  console.log('Hashed Pass: ', HashPass)
  console.log('Poggers')
  Register.PlayerLogin(tempName, HashPass).then(data => {
    console.log(data)
    if (data == -1) {
      res.json('FAILED')
    } else {
      res.json(data)
    }
  })
})

module.exports = loginRouter
