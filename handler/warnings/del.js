import request from "../../request.js";
import {ObjectId} from "mongodb";

export default {
    async execute(interaction, db) {
        const params = interaction.data.options[0].options
        const id = params.find(e => e.name === "warnid").value

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        const warning = (await db.get("warnings", {_id: new ObjectId(id)}))[0]

        if (!warning) {
            await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
                type: 4, content: `Warning doesn't exist!`
            })
            return
        }

        await db.delete("warnings", {_id: new ObjectId(id)})

        console.log(warning)

        const embed = [
            {
                "type": "rich",
                "title": "Warning deleted",
                "color": 0xff0000,
                "fields": [
                    {
                        "name": "Warning",
                        "value": id,
                        "inline": true
                    }, {
                        "name": "User",
                        "value": `<@${warning.user}>`,
                        "inline": true
                    }, {
                        "name": "Warning reason",
                        "value": warning.reason,
                        "inline": true
                    }
                ]
            }
        ]

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: warning.user})
        await request(`/channels/${channel.id}/messages`, "POST", {}, {content: `Your warning ${id} has been deleted`})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: `Warning deleted successfully`, embeds: embed
        })
    }
}