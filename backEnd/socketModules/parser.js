'use strict'

const VC = require('./VirtualizationCommands')
// const virtulization = new VC() //connects to justin DBC() 

module.exports = class Parser {
    constructor(io) {
        console.log('contructing')
        this.io = io
        this.virtulization = new VC(io)
    }
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
                    // this.socket.emit('nameAttempt', argument);
                    console.log(message)
                    return (message)
                    break
                }
            case 'python':
                {
                    console.log("python command")
                    message.text = argument
                    message.language = "python"
                    let serverRes
                    try {
                        serverRes = await this
                            .virtulization
                            .language(message)
                        console.log("server res:", serverRes)
                        return serverRes
                    } catch (error) {
                        console.error("ERROR in python case: ", error)
                    }
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
                    } catch (error) {
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
                    } catch (error) {
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
                        To send code and specify the language, it will look like this
                        type,
                        /python print(test);

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
