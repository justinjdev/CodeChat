'use strict'

//stevan & sabian queries
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/codechat'
const client = pgp(connectionString)

module.exports = class PostgresController {
    async testDB() {}
//}
//modules.exports = class DBCommands {

	//will connect to DB
    connectBD() {
        client.connect((err) = > {
            if(err) {
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
}

//1) insert a New User record (registers with website)
    insert_New_User(u_id, u_email, u_pass, u_username, u_firstname, u_lastname, u_bio) {
		{
    client
		.any(`INSERT INTO "Users"(u_username", "u_pass", "u_email", "u_id", "u_firstname", "u_lastname", "u_bio") VALUES ('${u_username}', '${u_pass}', '${u_email}',  '${u_id}', '${u_firstname}", '${U_lastname}', '${u_bio}') returning u_username`)
        .then(() => {
            reslove("Successful Insert of new user.")
        })
		}
	}
	/* insert message into DB, not finished.
	insert_Message(m_id, ch_id, u_id, message_text, isCode, m_response, time, hasInputs){
		Client
		.any(`INSERT INTO `)
	}
    */
