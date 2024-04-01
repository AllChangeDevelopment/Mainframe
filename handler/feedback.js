import add from './feedback/add.js'
import view from './feedback/view.js'
import {gatewayLogger} from "../logger.js";

export default {
    title: "feedback",
    description: "Manage application feedback",
    args: [{type: 1,name: "add",description: "Submits feedback for a user", options: [
            {type: 6, name: "user", description: "Target user", required: true, autocomplete: true},
            {type: 5, name: "pass", description: "Did the user pass", required: true},
            {type: 10, name: "score", description: "Numeric score for user", required: true},
        ]},{type: 1, name: "view", description: "View your feedback"}
    ],
    async execute(interaction, db) {
        switch(interaction.data.options[0].name) {
            case 'add':
                await add.execute(interaction, db)
                break
            case 'view':
                await view.execute(interaction, db)
                break
            default:
                gatewayLogger.error("Feedback subcommand not registered!")
                throw new Error("Feedback subcommand not registered!")
        }
    }
}