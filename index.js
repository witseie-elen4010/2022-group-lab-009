const express = require('express')
const path = require('path')
const mainRouter = require('./Routes/mainRoute.js')
const gameRouter = require('./Routes/GameRoute.js')
const queueRouter = require('./Routes/QueueRoutes.js')
const authRoutes = require('./Routes/authRoutes.js')
const loginRouter = require('./Routes/loginRoutes')
const logsRouter = require('./Routes/logRoutes')

const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 3000
app.use(bodyParser.json({ limit: '100mb' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, '/scripts')))
app.use(express.static(path.join(__dirname, '/css')))
app.use('/', mainRouter)
app.use('/Queue', queueRouter)
app.use('/Game', gameRouter)
app.use('/Auth', authRoutes)
app.use('/Login', loginRouter)
app.use('/Logs', logsRouter)
app.set('view engine', 'html')
app.engine('html', require('ejs').renderFile)

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = server
