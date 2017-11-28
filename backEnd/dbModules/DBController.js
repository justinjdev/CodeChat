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
    async postgresTest() {
        // let test1 try {     test1 = await this.registerUser('114', 'email@email.com',
        // 'password', 'username', 'firstname', 'register user last name', 'this is a
        // bio about me and other unimportant garbage') } catch (error) {
        // console.log("test 1 error", error) } console.log("test1", test1)
        // TODO: can implement now let test2 try {     test2 = await
        // this.registerMessage('115', '32123',     '123', 'messagetext', 'TRUE',
        // 'responding', '1267890', 'FALSE') } catch (error) {     console.log("test 2
        // error", error) } console.log("test2", test2)      //successful insert let
        // test3 try {     test3 = await this.registerChannel('67121', 'ada') } catch
        // (error) {     console.log("test 3 error", error) } console.log("test3",
        // test3)      //tested let test4 try {     test4 = await
        // this.Insert_Users_In_Channel('4516', '123') } catch (error) {
        // console.log("test 4 error", error) } console.log("test4", test4) let test12
        // try {     test12 = await this.deleteUser_in_channel('1', '12')     return }
        // catch (error) {     console.error('test 12 error', error) }
        // console.error('test12', test12) let test11 try {     test11 = await
        // this.deleteChannel('12')     return } catch (error) {     console.error('test
        // 11 error', error) } console.error('test11', test11) let test10 try {
        // test10 = await this.search_channel("YOLO") } catch (error) {
        // console.error('test 10 error', error) } console.error('test10', test10)

        // TODO:failed let test9 try {     test9 = await this.change_userBio('4321', "yo
        // I'm such a lord of swag") } catch (error) {     console.log("test 9 error",
        // error) } console.log("test9", test9)

        // let test8
        // try {
        //     test8 = await this.change_channelName('3', 'Ada')
        // } catch (error) {
        //     console.log("test 8 error", error)
        // }
        // console.log("test8", test8)

        // let test7
        // try {
        //     test7 = await
        //     this.change_username('114', 'burris fails you')
        // } catch (error) {
        //     console.log("test 7 error", error)
        // }
        // console.log("test7", test7)

        // let test6
        // try {
        //     test6 = await this.Get_Users_In_Channel('1')
        // } catch (error) {
        //     console.log("test 6 error", error)
        // }
        // console.log("test6", test6)

        // let test5
        // try {
        //     test5 = await this.Users_Email()
        // } catch (error) {
        //     console.log("test 5 error", error)
        // }
        // console.log("test5", test5)

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
        return(checkEmail)
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
        return(UsersInChannel)
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
        let delUserInChannel
        try {
            delUserInChannel = await postgresController.delete_user_from_channel(ch_id, u_id)
            // returns if succssessful in postgress
        } catch (error) {
            console.error(error)
        }
    }
}