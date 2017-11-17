'use strict'

const DBC = require('./DBController') //connects to database
const dbc = new DBC()

const Abstraction = require('./Abstraction') //connects to sandbox //TODO: Don't forget abstraction is just a working name. It'll have to be named something else.
const abstraction = new Abstraction()

module.exports = class Parser {
    readInput(message) {
        let words = message
            .text
            .split(' ')
        let command = words[0]
            .substring(1, words[0].length)
            .toLowerCase()
        switch (command) {
            case 'join':
                console.log("join command")
                break
            case 'nick':
                console.log("nick command")
                break
            case 'python':
                console.log("python command")
                break
            case 'python':
                break
            case 'java':
                break
            case 'javascript':
                break
            case 'bunny':
                return(`
                (\\  /)
                (0.0)
               c(uu)
                UU
                `)
                break
            case 'shrug':
                return(`¯\\_(ツ)_/¯`)
            break
            default:
                console.log("unrecognized command")
                // message.text = 'Unrecognized Command.'
                break
        }
    }
}
