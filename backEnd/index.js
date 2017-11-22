'use strict'
const express = require('express')
const app = express()
const http = require('https')

app.set('port', process.env.PORT || 8080)

let server = app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
})

const io = require('socket.io').listen(server) //listen to own server
const socketio = require('socket.io-client')('localhost:3001') //listen to justin server
const ioAudio = require('socket.io').listen(server) //listen to own server


const audioFile = require('./Audio')
const audioStream = new audioFile(ioAudio)

const socketjs = require('./socketModules/socket')
const socketjsnew = new socketjs(io)
