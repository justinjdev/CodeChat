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
                message = 'Unrecognized Command.'
                break
        }
    }
}
