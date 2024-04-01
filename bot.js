import Mongo from "./db.js"
import {EventEmitter} from 'node:events'
import {WebSocket} from 'ws'
const loop = new EventEmitter
import dotenv from 'dotenv'
dotenv.config({path: "./secrets.env"})
import {gatewayLogger} from "./logger.js";

import ban from './handler/ban.js'
import unban from "./handler/unban.js";
import kick from "./handler/kick.js";
import mute from "./handler/mute.js";
import unmute from "./handler/unmute.js";
import warnings from "./handler/warnings.js";
import feedback from "./handler/feedback.js";

/**
 * Connects to Discord Gateway and launches the bot.
 */
export default function bot() {
    const db = new Mongo()

    const conLink  = "wss://gateway.discord.gg/?v=10&encoding=json"
    const con = new WebSocket(conLink)
    con.on('open', () => {
        gatewayLogger.info("Gateway connection open")
    })

    let hbint = 0
    let ident = false
    con.on('close', (code, reason) => {
        gatewayLogger.error(`${code} ${reason}`)
        bot()
    })
    con.on('message', message => {
        message = JSON.parse(message)

        switch(message.op) {
            case 10:
                gatewayLogger.verbose("Hello received")
                hbint = message.d.heartbeat_interval
                con.send(JSON.stringify({op: 1,s:null,t:null,d:{}}))
                gatewayLogger.info("Heartbeat sent")
                break
            case 11:
                gatewayLogger.info("Heartbeat acknowledged")
                setTimeout(() => {
                    con.send(JSON.stringify({op: 1,s:null,t:null,d:{}}))
                    gatewayLogger.info("Heartbeat sent")
                }, hbint)
                gatewayLogger.verbose(`Time until next heartbeat: ${hbint}`)
                gatewayLogger.verbose(`Identifying: ${!ident}`)

                if (!ident) {
                    con.send(JSON.stringify({op: 2, d: {
                        token: process.env.TOKEN,
                        intents: 32769,
                        properties: {
                            os: "darwin",
                            browser: "who knows",
                            device: "all change"
                        }
                    }}))

                    gatewayLogger.verbose("Identify sent")
                    ident = true
                }

                break
            case 1:
                gatewayLogger.info("Heartbeat received")
                con.send(JSON.stringify({op: 1,s:null,t:null,d:{}}))
                gatewayLogger.info("Heartbeat sent")
                break
            case 0:
                gatewayLogger.debug(`Event: ${message.t}`)
                if (message.t === "INTERACTION_CREATE") {
                    switch (message.d.data.name) {
                        case 'ban':
                            ban.execute(message.d)
                            break
                        case 'unban':
                            unban.execute(message.d)
                            break
                        case 'kick':
                            kick.execute(message.d)
                            break
                        case 'mute':
                            mute.execute(message.d)
                            break
                        case 'unmute':
                            unmute.execute(message.d, db)
                            break
                        case 'warnings':
                            warnings.execute(message.d, db)
                            break
                        case 'feedback':
                            feedback.execute(message.d, db)
                            break
                        default:
                            throw new Error("Command not added to switch statement!")
                    }
                }
                break

            default:
                gatewayLogger.error(`Unknown gateway opcode sent: ${message.op}`)
                throw new Error("Unknown gateway opcode sent")
        }

    })

    loop.on("code", () => {
        // code handler
        // TODO re-add.js body parameter when implementing
    })
}

export function msg(body) {
    loop.emit("code", body)
}
