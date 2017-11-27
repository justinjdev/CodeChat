'use strict'

const WebSocket = require('ws')
const ws = new WebSocket("ws://104.131.129.223:3003")

// const socketfile = require('./Socket') const socketio =  Proxy( new
// socketfile())

const ObjectResponseFile = require('./objectResponse')
const objectResponse = (new ObjectResponseFile())

module.exports = class VirtualizationCommands {
    constructor(io) {
        ws.addEventListener('open', (event, error) => {
            console.log("opened websocket connection")
            if (error) {
                console.log("Can't connect to the virtualization server yo! :(")
            }
        })
        this.serverResponse = 'default'
        this.objectResponse = new ObjectResponseFile(io)
        // Listen for messages ws.addEventListener('message', (event) => {
        this.prevResponse = ''
        ws.onerror = function (error) {
            console.log(error)
        }
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
        ws.onmessage = event => {
            console.log('Message from server ', event.data)
            this
                .objectResponse
                .sendResponseToFrontEnd(event.data)
        }
        return (message)
    }
<<<<<<< HEAD
}
=======
    ignorethis() {
        ws.addEventListener('open', (event) => {
            ws.send('Hi Server!', (err, res) => {
                if (err)
                    console.log("Error:", err)
            })
        })

    }

}
>>>>>>> 68caea2048bef6d8521201a9daf33f56ca656813
