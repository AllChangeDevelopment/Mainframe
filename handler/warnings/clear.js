import request from "../../request.js";

export default {
    async execute(interaction, db) {
        const params = interaction.data.options[0].options
        const user = params.find(e => e.name === "user").value

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        await db.delete("warnings", {user})

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: user})
        await request(`/channels/${channel.id}/messages`, "POST", {}, {content: `Lucky you! Your All Change warnings have been completely cleared.`})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "Warnings cleared successfully!"
        })
    }
}