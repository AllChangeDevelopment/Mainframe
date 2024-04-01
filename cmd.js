import request from "./request.js";
import {cmdLogger} from "./logger.js";

import dotenv from 'dotenv'
import unban from "./handler/unban.js";
import ban from "./handler/ban.js";
import kick from "./handler/kick.js";
import mute from "./handler/mute.js";
import unmute from "./handler/unmute.js";
import warnings from "./handler/warnings.js";
import feedback from "./handler/feedback.js";

dotenv.config({path: './secrets.env'})

/**
 * Registers commands
 * @returns {Promise<void>}
 */
export default async function cmd() {
    cmdLogger.info("Registering /unban")
    await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
        name: unban.title,
        description: unban.description,
        options: unban.args,
        default_member_permissions: "4",
        dm_permission: false
    })

    cmdLogger.info("Registering /ban")
    await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
        name: ban.title,
        description: ban.description,
        options: ban.args,
        default_member_permissions: "4",
        dm_permission: false
    })

    setTimeout(async () => {

        cmdLogger.info("Registering /kick")
        await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
            name: kick.title,
            description: kick.description,
            options: kick.args,
            default_member_permissions: "2",
            dm_permission: false
        })

        cmdLogger.info("Registering /mute")
        await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
            name: mute.title,
            description: mute.description,
            options: mute.args,
            default_member_permissions: "1099511627776",
            dm_permission: false
        })

        setTimeout(async () => {

            cmdLogger.info("Registering /unmute")
            await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
                name: unmute.title,
                description: unmute.description,
                options: unmute.args,
                default_member_permissions: "1099511627776",
                dm_permission: false
            })

            cmdLogger.info("Registering /warnings")
            await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
                name: warnings.title,
                description: warnings.description,
                options: warnings.args,
                default_member_permissions: "1099511627776",
                dm_permission: false
            })

            cmdLogger.info("Registering /feedback")
            await request(`/applications/${process.env.CID}/commands`, "POST", {}, {
                name: feedback.title,
                description: feedback.description,
                options: feedback.args,
                dm_permission: false
            })
        }, 5000)
    }, 5000)
}