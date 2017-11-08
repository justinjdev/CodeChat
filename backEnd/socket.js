module.exports = class Socket {
    constructor(io) {
        this.listenOnIO();
    }
    /**
    * @param {object} socket
    * listen on socket connection
    */
    listenOnIO() {
        io.on('connection', socket => {
            console.log(socket.io, "connected")

            // when they connect to the server, default to lobby channel
            socket.join('Lobby')
            // when they join, emit the message 'joinResult'
            socket.emit('joinResult', {room: 'Lobby'}) //let the client know that it's defaulted to the lobby

            /**
            * when the socket connection disconnects then you remove the nickname and name used from the list of names used
            */
            socket.on('disconnect', () => {
                console.log(socket.io, "disconnected")
            })

            socket.emit('message', {message: `Welcome ${name}`})

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
                let username = message.username
                let room = message.room

                console.log(message)
                socket
                    .broadcast
                    .to(room)
                    .emit('message', {
                        text: nickNames[socket.id] + ': ' + message.text
                    })
            })

        })
    }
}