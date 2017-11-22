'use strict'

const redis = require('redis')
const redisClient = redis.createClient(process.env.REDIS_URL || '//localhost:6379')

module.exports = class redisController {
    constructor() {
        redisClient
            .on('connect', function () {
                console.log('connected to redis')
            })
    }
    async cacheMessage(message) {
        let room = message.room
        //get length of the specific room name
        redisClient.llen(`${room}`, (err, len) => {
            if (len >= 20) { //if length is > 20 (it's initialized at 1) then just get rid of the old one
                redisClient.rpop(`${room}`)
            }
        })
        redisClient.lpush(`${room}`, JSON.stringify(message))
    }
    async getCachedMessages(roomName) {
        redisClient.LRANGE(`${roomName}`, 0, -1, (err, messages) => {
            // console.log("roomName", roomName, "Messages:", messages)
            this.messages = messages
        })
        return(this.messages)
    }

}