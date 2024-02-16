import request from "./request.js";
import {cmdLogger} from "./logger.js";

import dotenv from 'dotenv'
import unban from "./handler/unban.js";
import ban from "./handler/ban.js";
import kick from "./handler/kick.js";
import mute from "./handler/mute.js";
import unmute from "./handler/unmute.js";
dotenv.config({path: './secrets.env'})

export default async function cmd(body) {
    cmdLogger.info("Registering /unban")
    await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
        name: unban.title,
        description: unban.description,
        options: unban.args
    })

    cmdLogger.info("Registering /ban")
    await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
        name: ban.title,
        description: ban.description,
        options: ban.args
    })

    cmdLogger.info("Registering /kick")
    await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
        name: kick.title,
        description: kick.description,
        options: kick.args
    })

    cmdLogger.info("Registering /mute")
    await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
        name: mute.title,
        description: mute.description,
        options: mute.args
    })

    cmdLogger.info("Registering /unmute")
    await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
        name: unmute.title,
        description: unmute.description,
        options: unmute.args
    })
}