'use strict'

const express = require('express')
const app = express()
const http = require('http')


app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

let server = app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})

// creation of variables. Socket.io listening at "server" which I'll just make
// localhost/serverAddress
const io = require('socket.io').listen(server)
let guestNumber = 1
let nickNames = {}
let namesUsed = []
let name
let nameIndex

/**
 * @param {object} socket
 *
 * Small explanation of socket vs io:
 *
 **** Read up on the technologies here: https://socket.io/
 *
 * Sockets send a string + an object for every emit to the server and the server does
 * whatever the hell it wants with that object. In chats it usually forwards it to whatever room the socket is in.
 *
 *
 * On the io connection the whole function fires with the paramater of the socket.
 * socket.on/socket.emit means sending to the specific socket that it is connected to.
 */
io.on('connection', (socket) => {
  // when they connect to the server, default to lobby channel
  socket.join('Lobby')
  // when they join, emit the message 'joinResult'
  socket.emit('joinResult', {room: 'Lobby'}) //let the client know that it's defaulted to the lobby

  /**
   * when the socket connection disconnects then you remove the nickname and name used from the list of names used
   */
  socket.on('disconnect', () => {
    nameIndex = namesUsed.indexOf(nickNames[socket.id])
    delete namesUsed[nameIndex] // I really don't like using that explicitly but if it works...
    delete nickNames[socket.id]
  })

  // create variable name = 'Guest' + number, then save that in the object
  // {socket.id: name}
  name = 'Guest' + guestNumber
  nickNames[socket.id] = name
  socket.emit('nameResult', { //then tell the client that the namechange was successful and go for it
    success: true,
    name: name
  })
  namesUsed.push(name) //add new nickname to the names used list, (note: no way to remove from the list)
  guestNumber += 1

  socket.on('nameAttempt', (name) => {
    if (name.indexOf('Guest') == 0) {
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      })
    } else {
      // if the name was not in the list, change the nickname and add to the list
      if (namesUsed.indexOf(name) == -1) {
        namesUsed.push(name)
        nickNames[socket.id] = name
        dblink.saveUsername(name)
        socket.emit('nameResult', {
          success: true,
          name: name
        })
      } else {
        socket.emit('nameResult', {
          success: false,
          message: 'That name is already in use.'
        })
      }
    }
  })

  /**
   *  If the SPECIFIC SOCKET sends join, then it leaves object: previous room and
   *  joins a new room. Then emit joinResult to the room 'newRoom'.
   */
  socket.on('join', (room) => {
    socket.leave(room.previousRoom)
    socket.join(room.newRoom)
    socket.emit('joinResult', {room: room.newRoom})

  })

  socket.on('message', (message) => {
    message.nick = nickNames[socket.id]
    message.id = socket.id
    console.log(message)
    socket
      .broadcast
      .to(message.room)
      .emit('message', {
        text: nickNames[socket.id] + ': ' + message.text
      })
  })

})
