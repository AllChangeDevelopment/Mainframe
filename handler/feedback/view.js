import request from "../../request.js";

export default {
    async execute(interaction, db) {
        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        console.log(interaction)

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: interaction.member.user.id})

        let feedback = (await db.get("feedback", {user:interaction.member.user.id}))[0]  // member.user.id

        if (!feedback) {
            await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
                type: 4, content: `No feedback was found on the system. If you think this was a mistake, please contact AC support.`
            })
            return
        }

        const embed = [
            {
                "type": "rich",
                "title": "User feedback",
                "description": "For more detailed feedback directly from your application reader, contact AC support",
                "color": feedback.pass ? 0x00ff00 : 0xff0000,
                "fields": [
                    {
                        "name": "Pass",
                        "value": `${feedback.pass}`,
                        "inline": true
                    },
                    {
                        "name": "Mark",
                        "value": `${feedback.score}`,
                        "inline": true
                    }
                ]
            }
        ]


        await request(`/channels/${channel.id}/messages`, "POST", {}, {embeds: embed})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: `Check DMs for feedback!`
        })
    }
}