import request from "../request.js";
import dotenv from 'dotenv'
dotenv.config({path: './secrets.env'})

export default {
    title: "ban",
    description: "Bans a user",
    args: [{name: "user", type: 6, description: "Target user", required: true},
        {name: "deletion_days", type: 4, description: "How many days of messages to delete", required: false},
        {name: "reason", type: 3, description: "Reason for unban", required: false}],
    async execute(interaction) {
        // ban user
        let params = interaction.data.options
        let user = params.find(e => e.name === "user").value
        let reason = params.find(e => e.name === "reason").value
        let days = params.find(e => e.name === "deletion_days").value * 86400

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        await request(`/guilds/${interaction.guild_id}/bans/${user}`, "PUT",
            {'X-Audit-Log-Reason': reason}, {delete_message_seconds: days})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "User banned successfully."
        })
    }
}