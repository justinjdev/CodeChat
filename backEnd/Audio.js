'use strict'

module.exports = class Audio {
    constructor(io) {
        this.io = io
        this.listenForAudio(io)
    }
    listenForAudio(io) {
        io
            .on('connection', function (socket) {
                console.log("socket is connected:", socket.id)
                socket.on('chat message', function (msg) {
                    io.emit('chat message', msg)
                })
                socket.on('voice', function (blob) {
                    console.log(blob)
                    socket.broadcast.emit('voice', blob)
                })
            })
    }

}