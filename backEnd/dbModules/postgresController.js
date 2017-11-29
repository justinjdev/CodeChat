/*---------------General FUnctions Should Follow As Below-------------------------------------------------------------------------------------------------------------
1)  insert a User record (when a user registers)
2)  insert a Message record (when a message/code is sent)
3)  insert a Channel record (when a new channel is created)
4)  insert a Users_In_Channel record (when a user joins a channel)
5)  get list of all User emails (used to determine if an email has already been registered)
6)  get the list of all usernames currently in a channel (to display in the GUI so people can see who is in channel)
7)  change a username (in case a user wants to change their username)
8)  change a channel name (in case a user wants to change the name of a private channel or admin the name of general channel)
9)  change a user bio (when a user wants to change their bio)
10) user search function (specify 1. a category (Message, User, Channel), 2. then keyword(s))
11) delete a channel (when admin wants to delete a channel or a user wants to delete a private channel)
12) delete a user from a channel (when a user leaves a channel)
13) get username from email and u_pass
14) return all channel names
-------------------------------------------------------------------------------------------------------------*/

'use strict'

//stevan & sabian queries
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const config = {
    host: 'localhost',
    port: 5432,
    database: 'codechat_database',
    user: 'postgres',
    password: 'thotpatrol4319',
    poolSize: 10
}
const connectionString = process.env.DATABASE_URL || config
const client = pgp(config)

//declare tables
const Channel = "Channel"
const Message = "Message"
const Users = "Users"
const Users_In_Channel = "Users_In_Channel"

module.exports = class PostgresController {
    constructor() {
        this.connectDb()
    }
    //will connect to DB
    async connectDb() {
        client.connect((err) => {
            if (err) {
                console.error('connection error', err.stack)
            } else {
                console.log('Connected to Postgres')
            }
        })
    }

    //disconnect from  DB
    disconnectDb() {
        client.end((err) => {
            if (err) {
                console.error('disconnection error', err.stack)
            } else {
                console.log('disconnected from Postgres')
            }
        })
    }

    //1) insert a New User record (registers with website) not tested
    insert_New_User(u_id, u_email, u_pass, u_username, u_firstname, u_lastname, u_bio) {
        return new Promise((resolve, reject) => {

            console.log(`INSERT INTO "Users"("u_username", "u_pass", "u_email", "u_id", "u_firstname", "u_lastname", "u_bio") VALUES ('${u_username}', '${u_pass}', '${u_email}',  '${u_id}', '${u_firstname}', '${u_lastname}', '${u_bio}') returning u_username`)

            client
                .any(`INSERT INTO "Users"("u_username", "u_pass", "u_email", "u_id", "u_firstname", "u_lastname", "u_bio") VALUES ('${u_username}', '${u_pass}', '${u_email}',  '${u_id}', '${u_firstname}', '${u_lastname}', '${u_bio}') returning u_username`)
                .then(() => {
                    resolve("Successful Insert of new user.")
                })
                .catch(error => {
                    reject(error)
                    console.log(error)
                })
        })
    }
    loginUser(u_email, u_pass) {
        return new Promise((resolve, reject) => {
            client
                .any(`Select u_username from "Users" where u_email = '${u_username}' and u_pass = '${u_pass}';`)
                .then(res => {
                    resolve(res)
                })
                .catch(error => {
                    reject(error)
                    console.log(error)
                })
        })
    }

    // 2)insert message into DB, not finished. not tested
    insert_message(m_id, ch_id, u_id, m_text, isCode, m_response, m_time, hasInputs) {
        return new Promise((resolve, reject) => {
            console.log(`INSERT INTO "Message"("m_id", "ch_id", "u_id","m_text", "isCode", "m_response", "m_time", "hasInputs") VALUES ('${m_id}', '${ch_id}', '${u_id}', '${m_text}', '${isCode}', '${m_response}', '${m_time}', '${hasInputs}') returning m_id`)
            client
                .any(`INSERT INTO "Message"("m_id", "ch_id", "u_id","m_text", "isCode", "m_response", "m_time", "hasInputs") VALUES ('${m_id}', '${ch_id}', '${u_id}', '${m_text}', '${isCode}', '${m_response}', '${m_time}', '${hasInputs}') returning m_id`)
                .then(() => {
                    resolve("Successful Insert of Message.")
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    // 3)insert a channel record when a channel is created not tested
    insert_channel(ch_id, ch_name) {
        return new Promise((resolve, reject) => {
            console.log(`INSERT INTO "Channel"("ch_id", "ch_name") VALUES ('${ch_id}', '${ch_name}') returning ch_name`)
            client
                .any(`INSERT INTO "Channel"("ch_id", "ch_name") VALUES ('${ch_id}', '${ch_name}') returning ch_name`)
                .then(ch_id => {
                    resolve(ch_id)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    //4)user in channel , when user joins channel not tested
    user_in_channel(u_id, ch_id) {
        return new Promise((resolve, reject) => {
            console.log(`INSERT INTO "Users_In_Channel"("u_id", "ch_id") VALUES ('${u_id}', '${ch_id}') returning u_id`)
            client
                .any(`INSERT INTO "Users_In_Channel"("u_id", "ch_id") VALUES ('${u_id}', '${ch_id}') returning u_id`)
                .then(() => {
                    resolve("Successful Inserted user into channel.")
                })
                .catch(err => {
                    reject(err)
                })
        })

    }

    // 5)query list of all user emails(for if email has already been registered) not
    // tested
    user_email_query() {
        console.log("listing in command")
        return new Promise((resolve, reject) => {
            console.log(`select u_email from "Users" order by u_email;`)
            client
                .any(`select u_email from "Users" order by u_email;`)
                .then(data => {
                    resolve(data)
                })
                .catch(err => {
                    reject(err)
                })
        })

    }

    //6)query list of all users in channel(for GUI display) not tested
    user_channel_query(ch_id) {
        return new Promise((resolve, reject) => {
            console.log(`select u_username from "Users" natural join "Users_In_Channel" where ch_id = ${ch_id};`)
            client
                .any(`select u_username from "Users" natural join "Users_In_Channel" where ch_id = ${ch_id};`)
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

    //7)change a username not tested - Most likely horribly wrong
    change_username(u_id, new_username) {
        return new Promise((resolve, reject) => {
            console.log(`UPDATE "${Users}" SET  u_username = '${new_username}' WHERE u_id = '${u_id}' RETURNING "u_username"`)
            client
                .any(`UPDATE "${Users}" SET  u_username = '${new_username}' WHERE u_id = '${u_id}' RETURNING "u_username"`)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    //8)change a channel name not tested
    change_channelname(ch_id, new_channelname) {
        return new Promise((resolve, reject) => {
            console.log(`UPDATE "Channel" SET ch_name = '${new_channelname}' WHERE ch_id = ${ch_id};`)
            client
                .any(`UPDATE "Channel" SET ch_name = '${new_channelname}' WHERE ch_id = ${ch_id};`)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    //9)change a user bio not tested
    change_userBio(u_id, new_userbio) {
        return new Promise((resolve, reject) => {
            console.log(`UPDATE "${Users}" SET u_bio = '${new_userbio}' where u_id = ${u_id} RETURNING "u_bio"`)
            // let a = `update "Users" set u_bio = 'I changed my name' where u_id = 4321;`

            client
                .any(`UPDATE "${Users}" SET u_bio = '${new_userbio}' where u_id = ${u_id} RETURNING "u_bio"`)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    // //10)user search function not tested search(m_id, ch_id, u_id, keyword_list)
    // {     return new Promise((resolve, reject) => {         console.log(`SELECT
    // * FROM ${m_id} ORDER BY u_id,ch_id;`);         client .any(`SELECT
    // * FROM ${m_id} ORDER BY u_id,ch_id;`)             .then(data => {     if
    // (data.length > 0) {                     resolve(data) } else { reject(error)
    //           }             })   }).catch(error => { reject(error)     }) }
    // 10)search funcition(specifiying category and then keywords) -incomplete- not
    // tested
    search_channel(keyword) {
        return new Promise((resolve, reject) => {
            console.log(`SELECT * FROM "${Message}" WHERE m_text LIKE '%${keyword}%'; `) //test1, give back any text of keyword.
            //console.log(`SELECT * FROM ${Message} WHERE '${m_text}' = ANY ({keyword} :: text [])`) //test2, search for text, returns text, channel & user id. -incomplete-
            client
                .any(`SELECT * FROM "${Message}" WHERE m_text LIKE '%${keyword}%';`)
                .then(data => {
                    console.log(data)
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    }

    //11)delete a channel not tested
    delete_channel(ch_id) {
        return new Promise((resolve, reject) => {
            console.log(`DELETE * FROM "${Channel}" WHERE '${ch_id}'`) // not sure how to set up a delete function
            client.any(`DELETE * FROM "${Channel}" WHERE '${ch_id}'`) // not sure ..^
                .then(data => {
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //12)delete a user from a channel not tested
    delete_user_from_channel(ch_id, u_id) {
        return new Promise((resolve, reject) => {
            console.log(`DELETE FROM "${Users_In_Channel}" WHERE "u_id" = '${u_id}' AND "ch_id" = '${ch_id}'`) // not sure how to set up a delete function
            client.any(`DELETE FROM "${Users_In_Channel}" WHERE "u_id" = '${u_id}' AND "ch_id" = '${ch_id}'`) // not sure ..^
                .then(data => {
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //13)get username from email and u_pass - not tested
    get_user_name(u_mail, u_pass){
        return new Promise((resolve, reject) => {
            console.log(`SELECT u_username FROM "${Users}" WHERE "u_mail" = '${u_mail}' AND "u_pass" = '${u_pass}`)
            client.any(`SELECT u_username FROM "${Users}" WHERE "u_mail" = '${u_mail}' AND "u_pass" = '${u_pass}`)
            .then(data => {
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    }

    //14)return all channel names
    return_all_channel_names(){
        return new Promise((resolve, reject) => {
            console.log(`SELECT '${ch_name}' FROM "${Channel}"`)
            client.any(`SELECT '${ch_name}' FROM "${Channel}"`)
            .then(data => {
                resolve(data)
            }).catch(error => {
                reject(error)
        })
    })
    }

}
