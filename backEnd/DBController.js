'use strict'

const postgresControlFile = require('./postgresController') //connects to PSQL
const postgresController = new postgresControlFile()

const redisControlFile = require('./redisController') //connects to redis
const redisController = new redisControlFile()

<<<<<<< HEAD
module.exports = class DBC {
    
=======
/**
     * still work in progress
     */

module.exports = class DBController {

>>>>>>> 54a7df7e707248f4308928d35a9f5668c4098131
    save(message) {
        redisController.cacheMessage(message)
    }
    async getCachedMessages(roomName) {
        let messages
        try {
            messages = await redisController.getCachedMessages(roomName)
            return messages

        } catch (error) {
            console.error("ERROR: ",error)
        }
    }
    //save and restore messages to/from postgres

    //check logininfo with postgres

    //check registerinfo with prostgres

    //save commands from virtulization to postgres

}