import request from "../../request.js";
import {ObjectId} from "mongodb";

export default {
    async execute(interaction, db) {
        let params = interaction.data.options[0].options
        let user = params.find(e => e.name === "user").value

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        await db.delete("warnings", {user: user})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "Warnings deleted successfully!"
        })
    }
}