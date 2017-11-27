'use strict'

// const WebSocket = require('ws')
// const ws = new WebSocket("ws://104.131.129.223:3003")

// const socketfile = require('./Socket') const socketio =  Proxy( new
// socketfile())

const ObjectResponseFile = require('./ObjectResponse')
const objectResponse = (new ObjectResponseFile())

module.exports = class VirtualizationCommands {
    constructor(io) {
        // ws.addEventListener('open', (event) => {
        //     console.log("opened websocket connection")
        // })
        this.serverResponse = 'default'
        this.objectResponse = new ObjectResponseFile(io)
        // Listen for messages 
        // ws.addEventListener('message', (event) => {
        // console.log('Message from server ', event.data) })
    }
    //taking language argument
    async language(message) {
        let msg = JSON.stringify(message)
        console.log("msg", msg)
        ws.send(msg, (err, res) => {
            if (err)
                console.log("Websocket send Error:", err)
            else {
                (console.log(res))
            }
        })
        // Listen for messages
        ws.addEventListener('message', event => {
            console.log('Message from server ', event.data)
            this
                .objectResponse
                .sendResponseToFrontEnd(event.data)
        })
        return ('sent')

    }
    ignorethis() {
        ws.addEventListener('open', (event) => {
            ws.send('Hi Server!', (err, res) => {
                if (err)
                    console.log("Error:", err)
            })
        })

    }

}