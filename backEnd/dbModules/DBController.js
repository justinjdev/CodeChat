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
        console.log("getting cached messages for room:",roomName)
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

    //1) insert a user record
    async registerUser(u_id, u_email, u_password, u_username, u_firstname, u_lastname, u_bio) {
        let registerUserAttempt
        try {
            registerUserAttempt = await postgresController.insert_New_User(u_id, u_email, u_password, u_username, u_firstname, u_lastname, u_bio)
            return "Succsessfully added User"
        } catch (error) {
            console.error(error)
        }
    }

    //2) insert a Message record
    async registerMessage(m_id, ch_id, u_id, message_text, isCode, m_response, m_time, hasInputs) {
       let registerMessageAttempt
       try{
           registerMessageAttempt = await postgresController.insert_message(m_id, ch_id, u_id, 'message_text', isCode, m_response, m_time, hasInputs)
           // returns if succssessful in postgress
       } catch(error){
           console.error(error) //show error if not saved
       }
    }

    //3) insert a Channel record
    async registerChannel(ch_id, language) {
        let registerChannelAttempt
        try{
            registerChannelAttempt = await postgresController.insert_channel(ch_id, 'language')
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //4) insert a Users_In_Channel record
    async Insert_Users_In_Channel(u_id, ch_id) {
        let addUsersToChannel
        try{
            addUsersToChannel = await postgresController.user_in_channel(u_id, ch_id)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //5) get list of all User emails
    // is not the same parameters for the postgressController.ls !!
    async Users_Email(u_id, u_email) {
        let checkEmail
        try{
            checkEmail = await postgresController.user_email_query(u_id, u_email)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //6) get the list of all usernames currently in a channel
    async Get_Users_In_Channel(ch_id) {
        let UsersInChannel
        try{
            UsersInChannel = await postgresController.user_channel_query(ch_id)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //7) change a username
    async change_username(u_id, new_username) {
        let usernameUpdate
        try{
            usernameUpdate = await postgresController.change_username(u_id, new_username)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //8) change a channel name
    async change_channelName(ch_id, new_channelname) {
        let updateChannelName
        try{
            updateChannelName = await postgresController.change_channelname(ch_id, new_channelname)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //9) change a user bio
    async change_userBio(u_id, new_userbio) {
        let updateBio
        try{
            updateBio = await postgresController.change_userBio(u_id, new_userbio)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //10) user search function (specify 1. a category (Message, User, Channel), 2. then keyword(s))
    async serch(m_id, ch_id, u_id, keyword_list) {
        let searchFunc
        try{
            searchFunc = await postgresController.search(m_id, ch_id, u_id, keyword_list)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //11) delete a channel
    async deleteChannel(ch_id) {
        let delChannel
        try{
            delChannel = await postgresController.delete_channel(ch_id)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }

    //12) delete a user from a channel
    async deleteUser_in_channel(ch_id, u_id) {
        let delUserInChannel
        try{
            delUserInChannel = await postgresController.delete_user_from_channel(ch_id, u_id)
            // returns if succssessful in postgress
        }catch(error){
            console.error(error)
        }
     }
}