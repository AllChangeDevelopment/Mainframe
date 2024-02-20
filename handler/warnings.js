import add from "./warnings/add.js";
import list from "./warnings/list.js";
import edit from "./warnings/edit.js";
import del from "./warnings/del.js";
import clear from "./warnings/clear.js";
import {gatewayLogger} from "../logger.js";

export default {
    title: "warnings",
    description: "Manage warnings",
    args: [{type: 1,name: "add",description: "Warns a user", options: [
            {type: 6, name: "user", description: "User to warn", required: true}, {type: 3, name: "reason", description: "Reason for warn", required: true}
        ]},
        {type: 1,name: "list",description: "Lists a user's warnings",options: [
            {type: 6, name: "user", description: "Which user to list warnings", required: true}
        ]},
        {type: 1,name: "edit",description: "Edits a warning", options: [
            {type: 3, name: "warnid", description: "ID of warning to edit", required: true},
            {type: 3, name: "newreason", description: "New reason", required: true}
        ]},
        {type: 1,name: "delete",description: "Deletes a warning", options: [
            {type: 3, name: "warnid", description: "ID of warning to edit", required: true}
        ]},
        {type: 1,name: "clear",description: "Clears all warnings of a user", options: [
            {type: 6, name: "user", description: "User to clear warnings of", required: true}
        ]}
    ],
    async execute(interaction, db) {
        switch(interaction.data.options[0].name) {
            case 'add':
                await add.execute(interaction, db)
                break
            case 'list':
                await list.execute(interaction, db)
                break
            case 'edit':
                await edit.execute(interaction, db)
                break
            case 'delete':
                await del.execute(interaction, db)
                break
            case 'clear':
                await clear.execute(interaction, db)
                break
            default:
                gatewayLogger.error("Warning subcommand not registered!")
                throw new Error("Warning subcommand not registered!")
        }
    }
}