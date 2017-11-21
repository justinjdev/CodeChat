'use strict'

const postgresControlFile = require('./postgresController') //connects to PSQL
const postgresController = new postgresControlFile()

const redisControlFile = require('./redisController') //connects to redis
const redisController = new redisControlFile()

module.exports = class DBController {

    save(message) {
        redisController.cacheMessage(message)
    }
    async getCachedMessages(roomName) {
        let messages
        try {
            messages = await redisController.getCachedMessages(roomName)
            return messages

        } catch (error) {
            console.error("ERROR: ", error)
        }
    }
    async postgresTest() {
        let test
        try {
            test = await postgresController.testDB()
            return
        } catch (error) {
            console.error(error)
        }
    }

}