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
    async registerUser(u_id, u_email, u_password, u_username, u_firstname, u_lastname) {
        let registerUserAttempt
        try {
            registerUserAttempt = await postgresController.insertUserRecord(u_id, u_email, u_password, u_username, u_firstname, u_lastname)
            return "successfully registered user"
        } catch (error) {
            console.error(error)
        }
    }
}
//avery will finish this on wednesday
// save and restore messages to/from postgres check logininfo with postgres
// check registerinfo with prostgres save commands from virtulization to postgres