import request from "../request.js";

export default {
    title: "unban",
    description: "Unbans a user",
    args: [{name: "userid", type: 3, description: "ID of target user", required: true},
        {name: "reason", type: 3, description: "Reason for unban", required: false}],
    async execute(interaction) {
        // unban user
        const params = interaction.data.options
        const user = params.find(e => e.name === "userid").value
        let reason = ""
        try {reason = params.find(e => e.name === "reason").value} catch(e) { /* continue regardless */ }

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        await request(`/guilds/${interaction.guild_id}/bans/${user}`, "DELETE",
            {'X-Audit-Log-Reason': reason})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "User unbanned successfully."
        })
    }
}