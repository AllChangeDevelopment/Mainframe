import request from "../../request.js";
import {ObjectId} from "mongodb";

export default {
    async execute(interaction, db) {
        const params = interaction.data.options[0].options
        const id = params.find(e => e.name === "warnid").value

        await request(`/interactions/${interaction.id}/${interaction.token}/callback`, "POST", {},
            {type: 5})

        await db.delete("warnings", {_id: new ObjectId(id)})

        await request(`/webhooks/${process.env.CID}/${interaction.token}/messages/@original`, "PATCH", {}, {
            type: 4, content: "Warning "+id+" deleted successfully"
        })
    }
}