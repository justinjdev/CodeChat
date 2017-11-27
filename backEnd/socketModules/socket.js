'use strict'

const DBcontroller = require('../dbModules/DBController')
const dbcontroller = new DBcontroller()
const ParserFile = require('./parser')
// const parser = new ParserFile()

module.exports = class Socket {
    constructor(io) {
        this.nicknames = {}
        // this.listenOnIO(io) //actually start listening on the sockets because for
        // some reason it doesn't work without getting called.
        this.io = io
        this.nicknames = {}
        this.parser = new ParserFile(io)
    }
    /**
    * @param {object} socket
    * listen on socket connection
    */
    listenOnIO() {
        this
            .io
            .on('connection', socket => {
                console.log("NICKNAMES!!", this.nicknames)
                socket.emit('nickRequest', "nickname pls")
                socket.on('nickReply', nickname => {
                    id = socket.id
                    this.nicknames.id = nickname
                })

                console.log(socket.id, "connected")

                this.listSocketsInRoom()

                // when they connect to the server, default to lobby channel

                socket.join('Lobby', () => {
                    let rooms = Object.keys(socket.rooms) // rooms is a list of rooms the socket is in, beginning with its own id.
                    console.log(this.allRoomStuff)
                })

                // this.listSocketsInRoom(io.sockets,io)
                this.getCachedMessages('Lobby', socket)
                // when they join, emit the message 'joinResult'
                socket.emit('joinResult', {room: 'Lobby'}) //let the client know that it's defaulted to the lobby

                /**
            * when the socket connection disconnects then you remove the nickname and name used from the list of names used
            */
                socket.on('disconnect', () => {
                    console.log(socket.id, "disconnected")
                    this.listSocketsInRoom()
                })
                let name = socket.id
                socket.emit('message', {
                    user: "Server",
                    text: `Welcome ${name}`
                }) // sends only back to that one socket

                /**
            *  If the SPECIFIC SOCKET sends join, then it leaves object: previous room and
            *  joins a new room. Then emit joinResult to the room 'newRoom'.
            */
                socket.on('join', room => {
                    console.log("😲 OMG JOINing!😲 ",room)
                    socket.leave(room.previousRoom)
                    socket.join(room.newRoom)
                    this.getCachedMessages(room.newRoom,socket)
                    this.listSocketsInRoom()
                    socket.emit('joinResult', {room: room.newRoom})
                })
                socket.on('message', (message, response) => {
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
                                    res.newNick
                                        ? this.nicknames[socket.id] = res.newNick
                                        : console.log()
                                    response(res)
                                    socket
                                        .broadcast
                                        .to(messages.room) // room name
                                        .emit('message', res) // message name and res is the object being sent
                                })
                        } else {
                            message.nick = message.nick || "A User"
                            message.id = socket.id
                            socket
                                .broadcast
                                .to(message.room)
                                .emit('message', message)
                            response(message)
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
            console.error("cached messages error:",error)
            return error
        }
    }

    async listSocketsInRoom() {
        // console.log(io.sockets.adapter.rooms)
        let clients = Object.keys(this.io.sockets.sockets)
        // console.log("CLIENTS:", clients)
        let actualRooms
        try {
            actualRooms = await this.getRooms()
            console.log("waitingggggg")
        } catch (error) {
            console.log(error)
        }
        // console.log("actualRooms you mother 🙃 ", actualRooms)

        for (let i of actualRooms) {
            // TODO: implement gets the sockets/users from room const clients =
            // this.io.sockets.clients('Lobby') // all users from room `Lobby` May need to
            // refine later.
            this
                .io
                .of('/')
                . in(i)
                .clients((error, clients) => {
                    console.log(`${clients} in ${i}`)
                    try {
                        this.sendUserList(i, clients)
                    } catch (emitError) {
                        console.error(emitError)
                    }

                    if (error)
                        throw error // Returns an array of client IDs like["Anw2LatarvGVVXEIAAAD"]
                    })
        }
    }
    async sendUserList(roomName, userList) {
        this
            .io
            .sockets
            . in(roomName) // room name
            .emit('userList', this.nicknames[userList])
    }
    async getRooms() {
        let clients = Object.keys(this.io.sockets.sockets)

        let room_list = []
        let rooms = this.io.sockets.adapter.rooms
        for (let room in rooms) {
            if (!rooms[room].hasOwnProperty(room)) {
                room_list[room] = Object
                    .keys(rooms[room])
                    .length
            }
        }
        let actualRooms = []
        for (let i in room_list) {
            if (clients.indexOf(i) < 0) {
                actualRooms.push(i)
            }
        }
        console.log(actualRooms)
        return (actualRooms)
    }
}