'use strict'

const postgresControlFile = require('./PostgresController') //connects to PSQL
const postgresController = new postgresControlFile()

const redisControlFile = require('./redisController') //connects to redis
const redisController = new redisControlFile()

/**
     * still work in progress
     */

module.exports = class DBC {
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

        if (command === 'listUsers') { // not sure what were comparing the command to
            console.log('list')
            dbcommands // check the command
                .listUsers()
                .then(resolve => { //we should send it to abstraction somehow
                    console.log(resolve)
                    res
                        .status(200)
                        .json({status: 'success', users: resolve})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        } else if (command === 'getList') {
            console.log("getting list in dbLink")
            dbcommands
                .getList({username: username})
                .then(resolve => {
                    console.log(resolve)
                    res
                        .status(200)
                        .json({status: 'Success', items: resolve})
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error, problem: "Error in getList Function"})
                })
        } else if (command === 'getItemDesc') {
            console.log(command)
            console.log(foodname)
            dbcommands
                .getFoodDetails({foodname: foodname})
                .then(data => {
                    res
                        .status(200)
                        .json({status: 'successful edit', items: data})
                })
                .catch(error => {
                    console.error(error)
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }
    }
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

    /**
     * this command just creates a user
     * @param {Request} req
     * @param {Response} res
     */
    insert(req, res) {
        console.log("inserting")
        let command = req.query.cmd
        let username = req.query.username
        let password = req.query.password

        if (command === 'register') {
            console.log('register')
            let register = dbcommands.insert({command: 'register', username: username, password: password})
            register.then(resolve => {
                console.log(resolve)
                res
                    .status(200)
                    .json({status: 'successful register'})

            }).catch(error => {
                res
                    .status(500)
                    .json({status: 'Error', error: error})
            })
        } else if (command === 'login') {
            let login = dbcommands.getLogin({username: username, password: password})
            login.then(resolve => {
                if (resolve) {
                    res
                        .status(200)
                        .json({status: 'successful login', data: resolve.username})
                }
            }).catch(error => {
                res
                    .status(404)
                    .json({status: 'Not Exist', error: error})
            })
        } else if (command === 'edit') {
            dbcommands.then(() => {
                dbcommands
                    .editItem({username: username, password: password})
                    .then(resolve => {
                        console.log(resolve)
                        res
                            .status(200)
                            .json({status: 'successful edit', items: resolve})
                    })
                    .catch(error => {
                        res
                            .status(500)
                            .json({status: 'Error', error: error})
                    })
            })

        }
    }

    /**
     * Send the request to delete column in the database where ID is the name
     * @param {Request} req
     * @param {Response} res
     */
    delete(req, res) {
        let cmd = req.query.cmd
        let username = req.query.username
        console.log("deleting in link")
        console.log("username:", username)
        if (cmd === "delUser") {
            dbcommands
                .delete(username)
                .then(resolve => {
                    console.log("resolve", resolve)
                    if (resolve) {
                        res
                            .status(200)
                            .json({status: 'success'})
                    }
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({status: 'Error', error: error})
                })
        }
    }
}