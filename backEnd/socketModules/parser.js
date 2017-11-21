'use strict'

// const DBC = require('./DBController') //connects to database
// const dbc = new DBC()

// const Abstraction = require('./Abstraction') //connects to sandbox //TODO: Don't forget abstraction is just a working name. It'll have to be named something else.
// const abstraction = new Abstraction()

module.exports = class Parser {
    async readInput(message) {
        console.log(message)
        let words = message
            .text
            .split(' ')
        let command = words[0]
            .substring(1, words[0].length)
            .toLowerCase()
        let argument = words.slice(1).join(' ')
        switch (command) {
            case 'join':
                {
                    message.text = "join command " + argument
                    return (message)
                    break
                }
            case 'nick':
                {
                    message.text = "nick command" + argument
                    return (message)
                    break
                }
            case 'python':
                { // console.log("python command")
                    message.text = "python command"
                    return (message)
                    break
                }
            case 'java':
                {
                    message.text = "java command"
                    return (message)
                    break
                }
            case 'javascript':
                {
                    message.text = "javascript command"
                    return (message)
                    break
                }
            case 'bunny':
                {
                    message.text = `
                        (\\  /)
                        (0.0)
                       c(uu)
                        UU
                        `
                    return (message)
                    break
                }
            case 'shrug':
                {
                    message.text = `¯\\_(ツ)_/¯`
                    return (message)
                    break
                }
            case 'help':
                {
                    message.text = `Chat commands: Change nickname: /nick [username], Join/create room: /join [room name]`
                    return (message)
                    break
                }
            default:
                {
                    console.log("Unrecognized Command")
                    message.text = "Unrecognized Command"
                    return (message)
                    break
                }
        }
    }
}
