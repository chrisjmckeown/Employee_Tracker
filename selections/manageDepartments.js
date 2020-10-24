const inquirer = require('inquirer');
const table = require('console.table');
let pool;

async function manageDepartments(mysqlpool) {
    pool =mysqlpool;
    while (true) {
        const { selection } = await manageSelectionPrompt();
        switch (selection) {
            case "View":
                await viewAllDepartments();
                break;
            case "Add":
                var { res: list } = await getAllDepartments();
                var { result: name } = await getDepartmentStringPrompt("Please enter a Name:", list);
                await addDepartment(name.trim());
                break;
            case "Edit":
                var { res: list } = await getAllDepartments();
                var { item } = await selectItemPrompt("Please select a Department to rename:", list);
                var id = list.filter((x) => x.name === item)[0].id;
                var { result: name } = await getDepartmentDefaultStringPrompt("Please enter a Title:", item, list);
                await updateDepartment(id, name.trim());
                break;
            case "Delete":
                var { res: list } = await getAllDepartments();
                var { item } = await selectItemPrompt("Please select a Department to delete:", list);
                var id = list.filter((x) => x.name === item)[0].id;
                await deleteDepartment(id);
                break;
            default:
                return;
        }
    }
}

//#region switch Prompts
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
//#endregion

//#region Manage Department mySQL
async function getAllDepartments() {
    return new Promise((resolve) => {
        var query = 'SELECT * FROM department';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                resolve({ result: !err, res });
            });
    });
}

async function viewAllDepartments() {
    return new Promise((resolve) => {
        var query = 'SELECT id as "ID", name as "Name" FROM department';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

async function addDepartment(name) {
    return new Promise((resolve) => {
        var query = 'INSERT INTO department SET ?';
        pool.query(query,
            {
                name: name,
            }, (err) => {
                console.log(`Department ${name} added!`);
                resolve({ result: !err });
            });
    });
}

async function updateDepartment(id, name) {
    return new Promise((resolve) => {
        var query = 'UPDATE department SET ? WHERE ?';
        pool.query(query,
            [
                {
                    name: name
                },
                {
                    id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`Department Name updated to: ${name}!`);
                resolve({ result: !err });
            });
    });
}

async function deleteDepartment(id) {
    return new Promise((resolve) => {
        var query = 'DELETE FROM department WHERE ?';
        pool.query(query,
            [
                {
                    id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log('Department deleted!');
                resolve({ result: !err });
            });
    });
}

async function fixRoleDepartments(id) {
    return new Promise((resolve) => {
        var query = 'UPDATE role SET ? WHERE ?';
        pool.query(query,
            [
                {
                    department_id: null
                },
                {
                    department_id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                if (res.changedRows > 0) {
                    console.log(`${res.changedRows} role departments set to null!`);
                }
                resolve({ result: !err });
            });
    });
}

//#endregion

//#region generic Prompts
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
//#endregion

//#region Department Prompts
function getDepartmentStringPrompt(message, list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            message: message,
            validate: (value) => {
                const found = list.some(item => item.name === value);
                if (found) {
                    console.log(`\nPlease enter a unique Department. ${value} is already added.`)
                    return false;
                }
                if (!value.trim()) {
                    console.log(`Please enter a valid Name.`)
                    return false;
                }
                return true;
            }
        }
    ]);
}

function getDepartmentDefaultStringPrompt(message, defaultValue, list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: message,
            validate: (value) => {
                const found = list.some(item => item.name === value);
                if (found.length > 1) {
                    console.log(`\nPlease enter a unique Department. ${value} is already added.`)
                    return false;
                }
                if (!value.trim()) {
                    console.log(`Please enter a valid Name.`)
                    return false;
                }
                return true;
            }
        }
    ]);
}
//#endregion

module.exports = manageDepartments;