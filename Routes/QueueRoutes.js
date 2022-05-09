
const path = require('path')
const express = require('express');
const authRoutes = require("../Routes/authRoutes.js")
const { join } = require('path');
const QueueRoute = express.Router()


QueueRoute.get('/', function (req, res) {

    res.sendFile(path.join(__dirname, "../Views/Queue.html"));
})


module.exports = QueueRoute

