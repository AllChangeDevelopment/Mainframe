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

export default function bot() {
    const db = new Mongo()

    const conLink  = "wss://gateway.discord.gg/?v=10&encoding=json"
    let con = new WebSocket(conLink)
    con.on('open', () => {
        gatewayLogger.info("Gateway connection open")
    })

    let hbint = 0
    let ident = false
    con.on('close', (code, reason) => {
        gatewayLogger.error(code+" "+reason)
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
                gatewayLogger.verbose("Time until next heartbeat: "+hbint)
                gatewayLogger.verbose("Identifying: "+!ident)

                if (!ident) {
                    con.send(JSON.stringify({op: 2, d: {
                        token: process.env.TOKEN,
                        intents: 3276799,
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
                gatewayLogger.debug("Event: "+message.t)
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

                    }
                }
        }

    })

    loop.on("code", body => {
        // code handler
    })
}

export function msg(body) {
    loop.emit("code", body)
}
