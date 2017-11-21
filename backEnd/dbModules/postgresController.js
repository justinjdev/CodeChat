'use strict'

//stevan & sabian queries
const promise = require('bluebird')
const pgp = require('pg-promise')({promiseLib: promise})
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/codechat'
const client = pgp(connectionString)

module.exports = class PostgresController {
    async testDB() {}
}