'use strict'

const WebSocket = require('ws')
const ws = new WebSocket("ws://104.131.129.223:3003")
// const websocketServerLocation = ("ws://104.131.129.223:3003") const
// socketfile = require('./Socket') const socketio =  Proxy( new socketfile())

const ObjectResponseFile = require('./objectResponse')
const objectResponse = (new ObjectResponseFile())

module.exports = class VirtualizationCommands {
    constructor(io) {
        ws.onopen = (event) => {
            console.log("opened websocket connection")
        }
        // this.start(websocketServerLocation)
        this.serverResponse = 'default'
        this.objectResponse = new ObjectResponseFile(io)
        // Listen for messages ws.addEventListener('message', (event) => {
        // console.log('Message from server ', event.data) })
        ws.onclose = (e) => {
            // console.log(e)
            console.log(e.code)
            console.log("closed connection")
        }
    }

    async language(message) {
        let msg = JSON.stringify(message)
        // console.log("msg", msg)
        ws.send(msg, (err, res) => {
            if (err)
                console.log("Websocket send Error:", err)
            else {
                console.log(res)
            }
            return false;
        })
        // Listen for messages
        ws.addEventListener('message', event => {
            console.log('Message from server ', event.data)
            this
                .objectResponse
                .sendResponseToFrontEnd(event.data)
        })
        return (message)
    }
}
