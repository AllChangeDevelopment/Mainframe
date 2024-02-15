import request from "./request.js";
import {cmdLogger} from "./logger.js";

import dotenv from 'dotenv'
import unban from "./handler/unban.js";
import ban from "./handler/ban.js";
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
}