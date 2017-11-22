'use strict'

const DBcontroller = require('../dbModules/DBController')
const dbcontroller = new DBcontroller()
const Parser = require('./parser')

module.exports = class Socket {
    constructor(io) {
        this.nicknames = {}
        this.listenOnIO(io) //actually start listening on the sockets because for some reason it doesn't work without getting called.
        this.parser = new Parser(io)
    }
    /**
    * @param {object} socket
    * listen on socket connection
    */
    listenOnIO(io) {
        io.on('connection', socket => {
            console.log(socket.id, "connected")
            // when they connect to the server, default to lobby channel
            socket.join('Lobby')
            this.getCachedMessages('Lobby', socket)
            // when they join, emit the message 'joinResult'
            socket.emit('joinResult', {room: 'Lobby'}) //let the client know that it's defaulted to the lobby
            // socket.emit('nickRequest', "nickname pls") socket.on('nickReply', nickname =>
            // {     id = socket.id     nicknames.id = nickname })
            /**
            * when the socket connection disconnects then you remove the nickname and name used from the list of names used
            */
            socket.on('disconnect', () => {
                console.log(socket.id, "disconnected")
            })
            let name = socket.id
            socket.emit('message', {
                user: "Server",
                text: `Welcome ${name}`
            })
            // TODO: implement gets the sockets/users from room const clients =
            // io.sockets.clients('Lobby'); // all users from room `Lobby`

            /**
            *  If the SPECIFIC SOCKET sends join, then it leaves object: previous room and
            *  joins a new room. Then emit joinResult to the room 'newRoom'.
            */
            socket.on('join', room => {
                console.log("😲 OMG JOIN! 😲 ")
                socket.leave(room.previousRoom)
                socket.join(room.newRoom)
                this.getCachedMessages(room.newRoom)

                socket.emit('joinResult', {room: room.newRoom})
            })

            socket.on('message', message => {
                dbcontroller.save(message)
                console.log(message)
                // remove invalid messages
                if (message.text === '') { // do nothing
                } else {
                    if (message.text[0] === '/') {
                        this
                            .parser
                            .readInput(message)
                            .then(res => {
                                console.log('response')
                                console.log(res)
                                socket
                                    .broadcast
                                    .to('Lobby')
                                    .emit('message', res)
                            })
                    } else {
                        message.nick = message.nick || "A User"
                        message.id = socket.id
                        socket
                            .broadcast
                            .to(message.room)
                            .emit('message', message)
                    }
                }
            })

        })
    }
    async getCachedMessages(roomName, socket) {
        let messages
        try {
            messages = await dbcontroller.getCachedMessages(roomName)
            socket.emit('cachedMessages', messages)
            // return messages
        } catch (error) {
            socket.emit('cachedMessages', error)
            console.error(error)
            return error
        }
    }

}
