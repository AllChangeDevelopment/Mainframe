import request from "../request.js";


//uid
//dur
//reason
export default {
    title: "mute",
    description: "Mutes a user for a given period of time",
    args: [{name: "user", type: 6, description: "Target user", required: true},
        {name: "duration", type:10, description: "Duration for mute in hours. Decimals accepted.", required: true},
        {name: "reason", type: 3, description: "Reason for unban", required: false}],
    async execute(interaction) {
        // unban user
        let params = interaction.data.options
        let user = params.find(e => e.name === "user").value
        let ending = params.find(e => e.name === "duration").value*(3.6*10**6)+Date.now()
        console.log(ending)
        console.log(ending+Date.now())
        let duration = new Date(ending).toISOString()
        console.log(duration)
        let reason = ""
        try {reason = params.find(e => e.name === "reason").value} catch(e) {}

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        await request(`/guilds/${interaction.guild.id}/members/${user}`, "PATCH",
            {'X-Audit-Log-Reason': reason}, {communication_disabled_until: duration})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "User muted successfully."
        })
    }
}