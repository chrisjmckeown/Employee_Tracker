const inquirer = require('inquirer');
const table = require('console.table');
let pool;

async function manageRoles(mysqlpool) {
    pool =mysqlpool;
    while (true) {
        const { selection } = await manageSelectionPrompt();
        switch (selection) {
            case "View":
                await viewAllRoles();
                break;
            case "Add":
                var { res: list } = await getAllRoles();
                var { result: title } = await getRoleStringPrompt("Please enter a Title:", list);
                var { result: salary } = await getIntPrompt("Please enter a Salary:");
                var department_id = await getRoleDepartment();
                await addRole(title.trim(), salary, department_id);
                break;
            case "Edit":
                var { res: list } = await getAllRoles();
                var titles = list.map(item => item.title);
                var { item } = await selectItemPrompt("Please select a Department to edit:", titles);
                var found = list.filter((x) => x.title === item)[0];
                var startingSalary = list.filter((x) => x.title === item)[0].salary;
                var { result: title } = await getRoleDefaultStringPrompt("Please enter a Title:", item, list);
                var { result: salary } = await getDefaultIntPrompt("Please enter a Salary:", startingSalary);
                var department_id = await getRoleDepartment();
                await updateRole(found.id, title.trim(), salary, department_id);
                break;
            case "Delete":
                var { res: list } = await getAllRoles();
                var titles = list.map(item => item.title);
                var { item } = await selectItemPrompt("Please select a Role to delete:", titles);
                var id = list.filter((x) => x.title === item)[0].id;
                await deleteRole(id);
                break;
            default:
                return;
        }
    }
}

async function getRoleDepartment() {
    var { res: departments } = await getAllDepartments();
    var deps = ["None", ...departments.map(item => item.name)];
    var { item: department } = await selectItemPrompt("Please select a Department:", deps);
    var department_id = null;
    if (department !== "None") {
        department_id = departments.filter((x) => x.name === department)[0].id;
    }
    return department_id;
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

//#region Manage Roles mySQL
async function getAllRoles() {
    return new Promise((resolve) => {
        var query = 'SELECT * FROM role';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                resolve({ result: !err, res });
            });
    });
}

async function viewAllRoles() {
    return new Promise((resolve) => {
        var query = 'SELECT role.id as "ID", role.title as "Title", role.salary as "Salary", department.name as "Department Name" '
            + 'FROM role LEFT JOIN department '
            + 'ON role.department_id = department.id';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

async function addRole(title, salary, department_id) {
    return new Promise((resolve) => {
        var query = 'INSERT INTO role SET ?';
        pool.query(query,
            [{
                title: title, salary: salary, department_id: department_id,
            }], (err) => {
                if (err) throw err;
                console.log(`Role ${title} added!`);
                resolve({ result: !err });
            });
    });
}

async function updateRole(id, title, salary, department_id) {
    return new Promise((resolve) => {
        var query = 'UPDATE role SET ? WHERE ?';
        pool.query(query,
            [
                {
                    title: title, salary: salary, department_id: department_id
                },
                {
                    id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`Role ${title} updated!`);
                resolve({ result: !err });
            });
    });
}

async function deleteRole(id) {
    return new Promise((resolve) => {
        var query = 'DELETE FROM role WHERE ?';
        pool.query(query,
            [
                {
                    id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log('Role deleted!');
                resolve({ result: !err });
            });
    });
}

async function fixEmployeeRoles(id) {
    return new Promise((resolve) => {
        var query = 'UPDATE employee SET ? WHERE ?';
        pool.query(query,
            [
                {
                    role_id: null
                },
                {
                    role_id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                if (res.changedRows > 0) {
                    console.log(`${res.changedRows} employee roles set to null!`);
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

//#region Role Prompts
function getIntPrompt(message) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            message: message,
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]);
}

function getDefaultIntPrompt(message, defaultValue) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: message,
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]);
}

function getRoleStringPrompt(message, list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            message: message,
            validate: (value) => {
                const found = list.some(item => item.title === value);
                if (found) {
                    console.log(`\nPlease enter a unique Role. ${value} is already added.`)
                    return false;
                }
                if (!value.trim()) {
                    console.log(`Please enter a valid Title.`)
                    return false;
                }
                return true;
            }
        }
    ]);
}

function getRoleDefaultStringPrompt(message, defaultValue, list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: message,
            validate: (value) => {
                const found = list.some(item => item.title === value);
                if (found.length > 1) {
                    console.log(`\nPlease enter a unique Role. ${value} is already added.`)
                    return false;
                }
                if (!value.trim()) {
                    console.log(`Please enter a valid Title.`)
                    return false;
                }
                return true;
            }
        }
    ]);
}
//#endregion

module.exports = manageRoles;
