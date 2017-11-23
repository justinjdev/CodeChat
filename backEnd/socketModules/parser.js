'use strict'

const VC = require('./virtualizationCommands')
const virtulization = new VC() //connects to justin

// DBC() const Abstraction = require('./Abstraction') //connects to sandbox
// //TODO: Don't forget abstraction is just a working name. It'll have to be
// named something else. const abstraction = new Abstraction()

module.exports = class Parser {
    async readInput(message) {
        console.log(message)
        let words = message
            .text
            .split(' ')
        let command = words[0]
            .substring(1, words[0].length)
            .toLowerCase()
        let argument = words
            .slice(1)
            .join(' ')
        switch (command) {
            case 'join':
                {
                    message.text = "join command " + argument
                    return (message)
                    break
                }
            case 'nick':
                {
                    message.text = `${message.nick} is now ${argument}`
                    message.oldNick = message.nick
                    message.newNick = argument
                    message.nick = "server"
                    message.command = 'nick'
                    console.log(message)
                    return (message)
                    break
                }
            case 'python':
                { // console.log("python command")
                    message.text = "python command" + argument
                    message.text = argument
                    let messages
                    try {
                        messages = await virtulization.language(argument)
                        return messages
                    } catch (error) {
                        console.error("ERROR: ", error)
                    }
                    // return (message)
                    break
                }
            case 'java':
                {
                    message.text = "java command" + argument
                    return (message)
                    message.text = argument
                    let messages
                    try {
                        messages = await virtulization.virtulizeLanguage(argument)
                    }catch(error){
                        console.error("ERROR: ", error)
                    }
                    // return (message)
                    break
                }
            case 'javascript':
                {
                    message.text = "javascript command" + argument
                    return (message)
                    message.text = argument
                    let messages
                    try {
                        messages = await virtulization.virtulizeLanguage(argument)
                    }catch(error){
                        console.error("ERROR: ", error)
                    }
                    // return (message)
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
                    message.text = `
                        Chat commands:
                        Change nickname: /nick [username],
                        Join or Create room: /join [room name]
                        `
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
