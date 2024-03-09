import request from "../request.js";
import warnings from "./warnings.js";


//uid
//dur
//reason
export default {
    title: "unmute",
    description: "Unmutes a user",
    args: [{name: "user", type: 6, description: "Target user", required: true},
        {name: "reason", type: 3, description: "Reason for unmute", required: false}],
    async execute(interaction, db) {
        // unban user
        const params = interaction.data.options
        if (interaction.data.name !== "unmute") {
            await warnings.execute(interaction, db)
            return
        }

        const user = params.find(e => e.name === "user").value
        let reason = ""
        try {reason = params.find(e => e.name === "reason").value} catch(e) { /* continue regardless */ }

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: user})
        await request(`/channels/${channel.id}/messages`, "POST", {}, {content: `Your have been manually unmuted from All Change Community for the following reason: ${reason}`})

        await request(`/guilds/${interaction.guild.id}/members/${user}`, "PATCH",
            {'X-Audit-Log-Reason': reason}, {communication_disabled_until: (new Date()).toISOString()})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "User unmuted successfully."
        })
    }
}