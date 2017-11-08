const express = require('express')
const app = express()
const http = require('https')

app.set('port', process.env.PORT || 8080)

let server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})

const io = require('socket.io').listen(server)
const socketio = require('socket.io-client')('http://localhost:3001')

const Parser = require('./parser')
const parser = new Parser(io)

io.on('connection', socket => {
    console.log(socket.id, 'connected')
    socketio.emit('message', 'Hello we are the chat server!')

    socket.on('disconnect', () => {
        console.log(socket.id, 'disconnected')
    })
    socket.on('message', message => {
        console.log(message)
        if (message.text[0] === '/') {
            parser.readInput(message)
        } else {
            socket
                .broadcast
                .to(message.room)
                .emit('message', message)
        }
    })
})
