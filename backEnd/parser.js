module.exports = class Parser {
    readInput(message) {
        let words = message.text.split(' ')
        let command = words[0]
            .substring(1, words[0].length)
            .toLowerCase()
        switch (command) {
            case 'join':
                break
            case 'nick':
                break
            default:
                message = 'Unrecognized Command.'
                break
        }
    }
}
