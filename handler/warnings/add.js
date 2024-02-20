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

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: `User warned successfully: ${reason}`
        })
    }
}