import request from "../../request.js";

export default {
    async execute(interaction, db) {
        const params = interaction.data.options[0].options
        const user = params.find(e => e.name === "user").value

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        const list = await db.get("warnings", {user: user})
        let msg = ""

        list.forEach(e => {
            msg += `${e._id}: `
            msg += e.reason
            msg += "\n"
        })

        if (msg === "") {
            msg = "No warnings found"
        }

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: msg
        })
    }
}