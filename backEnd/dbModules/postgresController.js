'use strict'

//stevan & sabian queries
const promise = require('bluebird')
const pgp = require('pg-promise')({
    promiseLib: promise
})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/codechat'
const client = pgp(connectionString)

module.exports = class PostgresController {
    async testDB() {}
    //}
    //modules.exports = class DBCommands {

    //will connect to DB
    connectBD() {
        client.connect((err) => {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                console.log('Connected to Postgres')
            }
        })
    }

    //disconnect from  DB
    disconnectDB() {
        client.end((err) => {
            if (err) {
                console.error('disconnection error', err.stack)
            } else {
                console.log('disconnected from Postgres')
            }
        })
    }

    //1) insert a New User record (registers with website)
        //not tested
    insert_New_User(u_id, u_email, u_pass, u_username, u_firstname, u_lastname, u_bio) {
        {
            client
                .any(`INSERT INTO "Users"(u_username", "u_pass", "u_email", "u_id", "u_firstname", "u_lastname", "u_bio") VALUES ('${u_username}', '${u_pass}', '${u_email}',  '${u_id}', '${u_firstname}", '${U_lastname}', '${u_bio}') returning u_username`)
                .then(() => {
                    resolve("Successful Insert of new user.")
                })
                .catch(error => {
                    reject(error)
                })
        }
    }
    
    // 2)insert message into DB, not finished.
        //not tested
        insert_message(m_id, ch_id, u_id, message_text, isCode, m_response, m_time, hasInputs){
            return new Promise((resolve, reject) => {
            Client
            .any(`INSERT INTO "Messages"("m_id", "ch_id", "u_id","message_text", "isCode", "m_response", "m_time", "hasInputs") VALUES ('${m_id}', '${ch_id}', '${u_id}', '${message_text}', '${isCode}', '${m_response}', '${m_time}', '${hasinputs}') returning m_id`)
            .then(() => {
                resolve("Successful Insert of Message.")
            })
                .catch(error => {
                reject(error)
                })
            })
        }

    // 3)insert a channel record when a channel is created
        //not tested
        insert_channel(ch_id, type){
            return new Promise((resolve, reject) => {
            client
                .any(`INSERT INTO "Channel"("ch_id", "type") VALUES ('${ch_id}', '${type}') returning type`)
                .then(ch_id => {
                    resolve(ch_id)
            })
            .catch(error => {
                reject(error)
        })
    })
        }

    //4)user in channel , when user joins channel
        //not tested
        user_in_channel(u_id, ch_id){
            return new Promise((resolve, reject) => {
            client
                .any(`INSERT INTO "Users_In_Channel"("u_id", "ch_id") VALUES ('${u_id}', '${ch_ID}') returning u_id`)
                .then(() => {
                    resolve("Successful Inserted user into channel.")
            })
            .catch(err => {
                reject(error)
            })
        })

    }


    //5)query list of all user emails(for if email has already been registered)
        //not tested
        user_email_query(){
            console.log("listing in command")
            return new Promise((resolve, reject) => {
                console.log("promising")
                client
                    .any(`SELECT * FROM ${Users}`)
                    .then(data => {
                        resolve(data)
                })
                .catch(err => {
                    reject(error)
                })
            })

        }

    //6)query list of all users in channel(for GUI display)
        //not tested
        user_channel_query(ch_id){
            return new Promise((resolve, reject) => {
                client
                    .any(`SELECT * FROM ${Users_In_Channel} ORDER BY u_id,ch_id;`)
                    .then(data => {
                    if (data.length > 0) {
                        resolve(data)
                    } else {
                        reject(error)
                    }
                })
                .catch(error => {
                    reject(error)
                })
            })
        }

    //7)change a username
        //not tested - Most likely horribly wrong
        change_username(u_id, new_username){
            return new Promise((resolve, reject) => {
                console.log(`UPDATE "public"."${Users}" SET '${u_id}', '${u_username}'='${new_username}' RETURNING "u_username"`)
                .any(`UPDATE "public"."${Users}" SET '${u_id}', '${u_username}'='${new_username}' RETURNING "u_username"`)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
            })
        }

    //8)change a channel name
        //not tested
        change_channelname(ch_id, new_channelname){
            return new Promise((resolve, reject) => {
                console.log(`UPDATE "public"."${Channels}" SET '${ch_id}', '${ch_name}'='${new_channelname}' RETURNING "ch_name"`)
                .any(`UPDATE "public"."${Channels}" SET '${ch_id}', '${ch_name}'='${new_channelname}' RETURNING "ch_name"`)
                .then(data =>{
                    resolve(data)
            })
                .catch(error => {
                    reject(error)
                })
            })
        }

    //9)change a user bio
        //not tested
        change_userBio(u_id, new_userbio){
            return new Promise((resolve, reject) => {
                console.log(`UPDATE "public"."${Users}" SET '${u_id}', '${u_bio}'='${new_userbio}' RETURNING "u_bio"`)
                .any(`UPDATE "public"."${Users}" SET '${u_id}', '${u_bio}'='${new_userbio}' RETURNING "u_bio"`)
                .then(data =>{
                    resolve(data)
            })
                .catch(error => {
                    reject(error)
                })
            })
        }

    //10)user search function
        //not tested
        search(m_id, ch_id, u_id, keyword_list){
            return new Promise((resolve, reject) => {
                client
                    .any(`SELECT * FROM ${m_id} ORDER BY u_id,ch_id;`)
                    .then(data => {
                    if (data.length > 0) {
                        resolve(data)
                    } else {
                        reject(error)
                    }
                    })
                })
                .catch(error => {
                    reject(error)
                })
            }

    //11)delete a channel
        //not tested
        delete_channel(ch_id){
            return new Promise((resolve, reject) => {
                console.log(`DELETE "public"."${Channels}" WHERE '${ch_id}'`) // not sure how to set up a delete function
                .any(`DELETE "public"."${Channels}" WHERE '${ch_id}'`)// not sure ..^
                .then(data =>{
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
            })
        }


    //12)delete a user from a channel
        //not tested
        delete_user_from_channel(ch_id, u_id){
            return new Promise((resolve, reject) => {
                console.log(`DELETE "public"."${Users}" WHERE '${ch_id, u_id}'`) // not sure how to set up a delete function
                .any(`DELETE "public"."${Users}" WHERE '${ch_id, u_id}'`)// not sure ..^
                .then(data =>{
                    resolve(data)
            })
                .catch(error => {
                    reject(error)
                })
            })
        }
    }
