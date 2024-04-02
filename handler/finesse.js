import request from "../request.js";

export default {
    title: "finesse",
    description: "Finesses a user",
    args: [{name: "user", type: 6, description: "Target user", required: true}],
    async execute(interaction) {
        const params = interaction.data.options
        const user = params.find(e => e.name === "user").value

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        let channel = await request(`/users/@me/channels`, "POST", {}, {recipient_id: user})
        await request(`/channels/${channel.id}/messages`, "POST", {}, {content: `You have been given admin permissions in All Change`})// TODO add server link

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "User finessed successfully."
        })
    }
}