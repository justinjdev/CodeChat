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
            default:
                console.log("unrecognized command")
                // message.text = 'Unrecognized Command.'
                break
        }
    }
}
