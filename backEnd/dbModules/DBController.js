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
        // console.log("getting cached messages for room:", roomName)
        return new Promise((resolve, reject) => {
            try {
                redisController
                    .getCachedMessages(roomName)
                    .then(messages => {
                        // console.log("getting messages in dbcontroller?", messages)
                        resolve(messages)
                    })

            } catch (error) {
                console.error("ERROR: ", error)
                reject(error)
            }
        })
    }
    async postgresTest() {}

    //1) insert a user record
    async registerUser(u_id, u_email, u_password, u_username, u_firstname, u_lastname, u_bio) {
        return new Promise((resolve, reject) => {
            postgresController
                .insert_New_User(u_id, u_email, u_password, u_username, u_firstname, u_lastname, u_bio)
                .then(user => {
                    resolve(user)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
    //1) insert a user record
    async loginUser(u_email, u_pass) {
        return new Promise((resolve, reject) => {
            postgresController
                .get_user_name(u_email, u_pass)
                .then(user => {
                    console.log("db login:", user)
                    resolve(user)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    //2) insert a Message record
    async registerMessage(m_id, ch_id, u_id, m_text, isCode, m_response, m_time, hasInputs) {
        let registerMessageAttempt
        try {
            registerMessageAttempt = await postgresController.insert_message(m_id, ch_id, u_id, m_text, isCode, m_response, m_time, hasInputs)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error) //show error if not saved
        }
    }

    //3) insert a Channel record
    async registerChannel(ch_id, language) {
        let registerChannelAttempt
        try {
            registerChannelAttempt = await postgresController.insert_channel(ch_id, language)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }

    //4) insert a Users_In_Channel record
    async Insert_Users_In_Channel(u_id, ch_id) {
        let addUsersToChannel
        try {
            addUsersToChannel = await postgresController.user_in_channel(u_id, ch_id)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }

    // 5) get list of all User emails is not the same parameters for the
    // postgressController.ls !!
    async Users_Email() {
        let checkEmail
        try {
            checkEmail = await postgresController.user_email_query()
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
        return (checkEmail)
    }

    //6) get the list of all usernames currently in a channel
    async Get_Users_In_Channel(ch_id) {
        let UsersInChannel
        try {
            UsersInChannel = await postgresController.user_channel_query(ch_id)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
        return (UsersInChannel)
    }

    //7) change a username
    async change_username(u_id, new_username) {
        let usernameUpdate
        try {
            usernameUpdate = await postgresController.change_username(u_id, new_username)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }

    //8) change a channel name
    async change_channelName(ch_id, new_channelname) {
        let updateChannelName
        try {
            updateChannelName = await postgresController.change_channelname(ch_id, new_channelname)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }

    //9) change a user bio
    async change_userBio(u_id, new_userbio) {
        let updateBio
        try {
            updateBio = await postgresController.change_userBio(u_id, new_userbio)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }

    // 10) user search function (specify 1. a category (Message, User, Channel), 2.
    // then keyword(s))
    async search_channel(keyword) {
        let searchFunc
        try {
            searchFunc = await postgresController.search_channel(keyword)
            console.log("searchfunc:", searchFunc)
            return searchFunc
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }

    //11) delete a channel
    async deleteChannel(ch_id) {
        let delChannel
        try {
            delChannel = await postgresController.delete_channel(ch_id)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }

    //12) delete a user from a channel
    async deleteUser_in_channel(ch_id, u_id) {
        return new Promise((resolve, reject) => {
            postgresController.delete_user_from_channel(ch_id, u_id)
        })
    }

    async return_all_channel_names() {
        return new Promise((resolve, reject) => {
            postgresController.return_all_channel_names()
            // returns if succssessful in postgress
        })

    }

}