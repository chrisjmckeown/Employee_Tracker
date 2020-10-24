const inquirer = require('inquirer');
const table = require('console.table');
const commonPrompts = require('./commonPrompts');

async function manageDepartments(pool) {
    while (true) {
        const { selection } = await commonPrompts.manageSelectionPrompt();
        switch (selection) {
            case "View":
                await viewAllDepartments(pool);
                break;
            case "Add":
                var { res: list } = await getAllDepartments(pool);
                var { result: name } = await getDepartmentPrompt(list);
                await addDepartment(pool, name.trim());
                break;
            case "Edit":
                var { res: list } = await getAllDepartments(pool);
                var { item } = await commonPrompts.selectItemPrompt("Please select a Department to rename:", list);
                var id = list.filter((x) => x.name === item)[0].id;
                var { result: name } = await getDepartmentWithDefaultPrompt(item, list);
                await updateDepartment(pool, id, name.trim());
                break;
            case "Delete":
                var { res: list } = await getAllDepartments(pool);
                var { item } = await commonPrompts.selectItemPrompt("Please select a Department to delete:", list);
                var id = list.filter((x) => x.name === item)[0].id;
                await deleteDepartment(pool, id);
                break;
            default:
                return;
        }
    }
}

//#region Manage Department mySQL
async function getAllDepartments(pool) {
    return new Promise((resolve) => {
        var query = 'SELECT * FROM department ORDER BY name';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                resolve({ result: !err, res });
            });
    });
}

async function viewAllDepartments(pool) {
    return new Promise((resolve) => {
        var query = 'SELECT id as "ID", name as "Name" FROM department ORDER BY name';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

async function addDepartment(pool, name) {
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

async function updateDepartment(pool, id, name) {
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

async function deleteDepartment(pool, id) {
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
//#endregion

//#region Department Prompts
function getDepartmentPrompt(list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            message: "Please enter a Name:",
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

function getDepartmentWithDefaultPrompt(defaultValue, list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: "Please enter a Name:",
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

module.exports = {
    manageDepartments,
    getAllDepartments
}