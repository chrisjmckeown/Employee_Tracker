const inquirer = require('inquirer');

function manageSelectionPrompt() {
    return inquirer.prompt([
        {
            type: "list",
            message: "Do want to?",
            name: "selection",
            choices: [
                "View",
                "Add",
                "Edit",
                "Delete",
                "Exit Manage"
            ]
        }
    ]);
}

function selectItemPrompt(message, items) {
    return inquirer.prompt([
        {
            type: "list",
            message: message,
            name: "item",
            choices: [
                ...items
            ]
        }
    ]);
}

function selectItemWithDefaultPrompt(message, items, defaultValue) {
    return inquirer.prompt([
        {
            type: "list",
            message: message,
            name: "item",
            default: defaultValue,
            choices: [
                ...items
            ]
        }
    ]);
}

module.exports = {
    manageSelectionPrompt,
    selectItemPrompt,
    selectItemWithDefaultPrompt
}