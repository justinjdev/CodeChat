'use strict'

module.exports = class Socket {
    constructor(io) {
        this.nicknames = {}
        this.io = io
        this.listenOnIO() //actually start listening on the sockets because for some reason it doesn't work without getting called.
        const Parser = require('./parser')
        this.parser = new Parser(io)
    }
    /**
    * @param {object} socket
    * listen on socket connection
    */
    listenOnIO() {
        this
            .io
            .on('connection', socket => {
                console.log(socket.id, "connected")

                // when they connect to the server, default to lobby channel
                socket.join('Lobby')
                // when they join, emit the message 'joinResult'
                socket.emit('joinResult', {room: 'Lobby'}) //let the client know that it's defaulted to the lobby
                socket.emit('nickRequest', "nickname pls")
                socket.on('nickReply', nickname => {
                    id = socket.id
                    nicknames.id = nickname
                })
                /**
            * when the socket connection disconnects then you remove the nickname and name used from the list of names used
            */
                socket.on('disconnect', () => {
                    console.log(socket.io, "disconnected")
                })
                let name = socket.id
                socket.emit('message', {text: `Welcome ${name}`})

                /**
            *  If the SPECIFIC SOCKET sends join, then it leaves object: previous room and
            *  joins a new room. Then emit joinResult to the room 'newRoom'.
            */
                socket.on('join', room => {
                    socket.leave(room.previousRoom)
                    socket.join(room.newRoom)
                    socket.emit('joinResult', {room: room.newRoom})

                })

                socket.on('message', message => {
                    console.log(message)
                    // remove invalid messages
                    if (message.text === '') { // do nothing
                    } else {
                        if (message.text[0] === '/') {
                           this. parser
                                .readInput(message)
                                .then(res => {
                                    socket.broadcast.to('Lobby').emit('message',res)
                                })
                        } else {
                            message.nick = "A user"
                            message.id = socket.id
                            socket
                                .broadcast
                                .to(message.room)
                                .emit('message', {
                                    text: socket.id + ": " + message.text
                                })
                        }
                    }
                })

            })
    }
}
