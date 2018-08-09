'use strict'
const fs = require('fs')
const express = require('express')
const app = express()
const https = require('https')

/**
 * HTTPS from.
 * https://github.com/socketio/socket.io-client/issues/982
 **/
const options = {
    key: fs.readFileSync('./file.pem'),
    cert: fs.readFileSync('./file.crt')
  }

app.set('port', process.env.PORT || 8080)


const server = https.createServer(options, app)

server.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
})

const io = require('socket.io').listen(server) //listen to own server


const socketjs = require('./socketModules/socket')
const socketjsnew = new socketjs(io)
socketjsnew.listenOnIO(io)
