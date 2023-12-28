import Mongo from "db.js"
import {EventEmitter} from 'node:events'
const loop = new EventEmitter

export default function bot() {
    const db = new Mongo()

    /*


            bot shit

     */

    loop.on("code", body => {
        // code handler
    })
}

export function msg(body) {
    loop.emit("code", body)
}
