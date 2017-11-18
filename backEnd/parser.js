'use strict'

const DBC = require('./DBController') //connects to database
const dbc = new DBC()

const Abstraction = require('./Abstraction') //connects to sandbox //TODO: Don't forget abstraction is just a working name. It'll have to be named something else.
const abstraction = new Abstraction()

module.exports = class Parser {
    async readInput(message) {
        console.log(message)
        let words = message
            .text
            .split(' ')
        let command = words[0]
            .substring(1, words[0].length)
            .toLowerCase()
        switch (command) {
            case 'join':
                console.log("join command")
                message.text = "join command"
                return(message)
                break;
            case 'nick':
                console.log("nick command")
                message.text = "nick command"
                return(message)
                break
            case 'python':
                // console.log("python command")
                message.text = "python command"
                return(message)
                break
            case 'python':
                message.text = "python command"
                return(message)
                break
            case 'java':
                message.text = "java command"
                return(message)
                break
            case 'javascript':
                message.text = "javascript command"
                return(message)
                break
            case 'bunny':
                message.text = `
                        (\\  /)
                        (0.0)
                        c(uu)
                        UU
                        `
                return(message)
                break
            case 'shrug':
            message.text = `¯\\_(ツ)_/¯`
                return(message)
            break
            default:
                console.log("unrecognized command")
                message.text = "unrecognized command"
                return(message)
                // message.text = 'Unrecognized Command.'
                break
        }
    }
}
