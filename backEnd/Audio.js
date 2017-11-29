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
                socket.on('voice', function (blob) {
                    socket.emit('voice', blob)
                })
            })
    }

}