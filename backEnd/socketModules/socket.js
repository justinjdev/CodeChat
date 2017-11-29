'use strict'

var SHA256 = require("crypto-js/sha256");

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
        this.parser = new ParserFile(io)
    }
    /**
    * @param {object} socket
    * listen on socket connection
    */
    async listenOnIO() {
        this
            .io
            .on('connection', async(socket) => {
                console.log("NICKNAMES!!", this.nicknames)
                socket.on('nickReply', nickname => {
                    console.log("nickReply!")
                    let id = socket.id
                    // console.log("ID:", id)
                    this.nicknames[id] = nickname
                })

                console.log(socket.id, "connected")

                this.listSocketsInRoom()

                // when they connect to the server, default to lobby channel

                socket.join('Lobby', () => {
                    let rooms = Object.keys(socket.rooms) // rooms is a list of rooms the socket is in, beginning with its own id.
                    console.log(this.allRoomStuff)
                })

                // this.listSocketsInRoom(io.sockets,io)
                await this.getCachedMessages('Lobby', socket)
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
                socket.on('join', async(room) => {
                    this.changeRooms(room, socket)
                })
                socket.on('getCache', async room => {
                    await this.getCachedMessages(room, socket)

                })
                socket.on('message', (message, response) => {
                    let date = Date.now()
                    message.time = date
                    message.id = '666' + date //setting message id
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
                                    // console.log('response') console.log(res)
                                    if (res.newNick) { //change nicknames
                                        let id = socket.id
                                        console.log('ID:', id)
                                        this.nicknames[id] = res.newNick
                                        console.log(this.nicknames)
                                        socket.emit('nickRequest', res.newNick)
                                    }
                                    if (res.command) {
                                        // console.log("res changeROOMS👍:", res)
                                        this.changeRooms({
                                            previousRoom: res.previousRoom,
                                            newRoom: res.newRoom
                                        }, socket)
                                    }
                                    response(res)
                                    socket
                                        .broadcast
                                        .to(res.room) // room name
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
                socket.on('getRooms', () => {
                    socket.emit('roomList', this.actualRooms)
                })
                socket.on('register', (resp, creds) => {
                    var uuid = generateUUID()
                    console.log("Registering new user: ", creds.Username, uuid)
                    dbcontroller.registerUser(uuid, creds.email, SHA256(creds.password), creds.Username, creds.first_name, creds.last_name, "")
                })
            })
    }
    async changeRooms(room, socketuser) {
        // console.log("😲 OMG JOINING!😲 ", room)
        socketuser.leave(room.previousRoom)
        socketuser.join(room.newRoom)
        await this.listSocketsInRoom()
        socketuser.emit('joinResult', {room: room.newRoom})
    }
    async getCachedMessages(roomName, socket) {
        // console.log("getting cached messages from ", roomName)
        let messages
        try {
            dbcontroller
                .getCachedMessages(roomName)
                .then(messages => {
                    // console.log("okay we've got the cached messages in socket:", messages)
                    socket.emit('cachedMessages', messages)
                })
            // return messages
        } catch (error) {
            socket.emit('cachedMessages', error)
            console.error("cached messages error:", error)
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
            // console.log("waitingggggg to list sockets in rooms")
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
        // console.log(userList) console.log("userlist:",this.nicknames)
        for (let i of userList) {
            console.log(this.nicknames[i])
            this
                .io
                .sockets
                . in(roomName) // room name
                .emit('userList', this.nicknames[i])
        }
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
        this.actualRooms = actualRooms
        console.log(actualRooms)
        return (actualRooms)
    }
}

function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x'
                ? r
                : (r & 0x3 | 0x8))
            .toString(16)
            .charCodeAt(0);
    });
}
