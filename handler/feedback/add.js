import request from "../../request.js";

export default {
    async execute(interaction, db) {
        const params = interaction.data.options[0].options
        const user = params.find(e => e.name === "user").value
        const pass = params.find(e => e.name === "pass").value
        const score = params.find(e => e.name === "score").value


        if ((interaction.member.permissions & 8) !== 8) {
            await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {}, {
                type: 4, data: {content: "You don't have permission to access this command!"}
            })
        } else {
            await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
                {type: 5})

            let str = ""

            if (await db.get("feedback", {user})) {
                await db.patch("feedback", {user}, {"$set": {user, pass, score}})
                str = "updated"
            } else {
                await db.post("feedback", [{user, pass, score}])
                str = "added"
            }

            const embed = [
                {
                    "type": "rich",
                    "title": `Feedback ${str}`,
                    "color": 0x0000ff,
                    "fields": [
                        {
                            "name": "User",
                            "value": `<@${user}>`,
                            "inline": true
                        },
                        {
                            "name": "Pass",
                            "value": `${pass}`,
                            "inline": true
                        },
                        {
                            "name": "Score",
                            "value": `${score}`,
                            "inline": true
                        }
                    ]
                }
            ]

            await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
                type: 4, embeds: embed
            })
        }
    }
}