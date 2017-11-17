const express = require('express')
const app = express()
const http = require('https')

app.set('port', process.env.PORT || 8080)

let server = app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'))
})

const io = require('socket.io').listen(server) //listen to own server
const socketio = require('socket.io-client')('http://localhost:3001') //listen to justin server

const Parser = require('./parser')
const parser = new Parser(io)

io.on('connection', socket => { //listen to self
    console.log(socket.id, 'connected')
    socketio.emit('message', 'Hello we are the chat server!') // name sockets
    socket.join('Lobby')
    // when they join, emit the message 'joinResult'
    socket.emit('joinResult', {room: 'Lobby'}) //let the client know that it's defaulted to the lobby

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected')
    })
    socket.on('message', message => {
        console.log(message)
        if (message.text[0] === '/') {
            parser.readInput(message)
        } else {
            message.nick = "A user"
            message.id = socket.id
            socket
                .broadcast
                .to(message.room)
                .emit('message', {
                    text: "A user: " + message.text
                })
        }
    })
})
