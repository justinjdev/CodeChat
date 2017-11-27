'use strict'

module.exports = class ObjectResponse {
    constructor(io) {
        this.io = io
    }
    async sendResponseToFrontEnd(response) {
        let parsedResponse = JSON.parse(response)
        parsedResponse.text = parsedResponse.output
        parsedResponse.user = "server"
        this
            .io
            .in(parsedResponse.room)
            .emit('message', parsedResponse)

    }
}