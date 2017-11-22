'use strict'

const WebSocket = require('ws')
const ws = new WebSocket("ws://104.131.129.223:3003")

ws.addEventListener('open', (event) => {
    ws.send('Hai Server!', (err, res) => {
        if (err)
            console.log("Error:", err)
    })
})

// Listen for messages
ws.addEventListener('message', (event) => {
    console.log('Message from server ', event.data);
});
