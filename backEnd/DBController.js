'use strict'

const postgresControlFile = require('./PostgresController') //connects to PSQL
const postgresController = new postgresControlFile()

const redisControlFile = require('./redisController') //connects to redis
const redisController = new redisControlFile()

/**
     * still work in progress
     */

module.exports = class DBController {
    /**
     * run command to connect to the PostgreSQL Database
     */
    connect() {
        dbcommands.connectDB()
    }
    /**
     * If the input is a 'message', then send the message() to DBCOmmands and redisCOntroller
     *      which resolves into a message saving into both DB
     * If the input is 'command', then send the command() to Abstraction
     *      which resolves into a String Object to send to sandbox
     * @param {Request} req
     * @param {Response} res
     */
    get(req, res) {
        let command = req.query.cmd
        let message = req.query.message



module.exports = class DBC {

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
}