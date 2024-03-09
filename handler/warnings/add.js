// {type: 6, name: "user", required: true}, {type: 3, name: "reason", required: true}

import request from "../../request.js";

export default {
    async execute(interaction, db) {
        const params = interaction.data.options[0].options
        const user = params.find(e => e.name === "user").value
        const reason = params.find(e => e.name === "reason").value

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        await db.post("warnings", [{user, reason}])

        const embed = [
            {
                "type": "rich",
                "title": "Warning added",
                "color": 0xff0000,
                "fields": [
                    {
                        "name": "User",
                        "value": `<@${user}>`,
                        "inline": true
                    },
                    {
                        "name": "Reason",
                        "value": `${reason}`,
                        "inline": true
                    }
                ]
            }
        ]

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: user})
        await request(`/channels/${channel.id}/messages`, "POST", {}, {content: `You've been warned in AC with the following reason: ${reason}`})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: `User warned successfully`, embeds: embed
        })
    }
}