const inquirer = require('inquirer');
const table = require('console.table');
const manageDepartments = require('./manageDepartments');
const commonPrompts = require('./commonPrompts');

async function manageRoles(pool) {
    while (true) {
        const { selection } = await commonPrompts.manageSelectionPrompt();
        switch (selection) {
            case "View":
                await viewAllRoles(pool);
                break;
            case "Add":
                var { res: list } = await getAllRoles(pool);
                var { result: title } = await getRolePrompt(list);
                var { result: salary } = await getSalaryPrompt();
                var department_id = await getRoleDepartment(pool);
                await addRole(pool, title.trim(), salary, department_id);
                break;
            case "Edit":
                var { res: list } = await getAllRoles(pool);
                var titles = list.map(item => item.title);
                var { item } = await commonPrompts.selectItemPrompt("Please select a Department to edit:", titles);
                var found = list.filter((x) => x.title === item)[0];
                var startingSalary = list.filter((x) => x.title === item)[0].salary;
                var { result: title } = await getRoleWithDefaultPrompt(item, list);
                var { result: salary } = await getSalaryWithDefaultPrompt(startingSalary);
                var department_id = await getRoleDepartment(pool);
                await updateRole(pool, found.id, title.trim(), salary, department_id);
                break;
            case "Delete":
                var { res: list } = await getAllRoles(pool);
                var titles = list.map(item => item.title);
                var { item } = await commonPrompts.selectItemPrompt("Please select a Role to delete:", titles);
                var id = list.filter((x) => x.title === item)[0].id;
                await deleteRole(pool, id);
                break;
            default:
                return;
        }
    }
}

async function getRoleDepartment(pool) {
    var { res: departments } = await manageDepartments.getAllDepartments(pool);
    var deps = ["None", ...departments.map(item => item.name)];
    var { item: department } = await commonPrompts.selectItemPrompt("Please select a Department:", deps);
    var department_id = null;
    if (department !== "None") {
        department_id = departments.filter((x) => x.name === department)[0].id;
    }
    return department_id;
}

//#region Manage Roles mySQL
async function getAllRoles(pool) {
    return new Promise((resolve) => {
        var query = 'SELECT * FROM role ORDER BY title';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                resolve({ result: !err, res });
            });
    });
}

async function viewAllRoles(pool) {
    return new Promise((resolve) => {
        var query = 'SELECT role.id as "ID", role.title as "Title", role.salary as "Salary", department.name as "Department Name" '
            + 'FROM role LEFT JOIN department '
            + 'ON role.department_id = department.id '
            + 'ORDER BY title';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

async function addRole(pool, title, salary, department_id) {
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

async function updateRole(pool, id, title, salary, department_id) {
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

async function deleteRole(pool, id) {
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
//#endregion

//#region Role Prompts
function getSalaryPrompt() {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            message: "Please enter a Salary:",
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]);
}

function getSalaryWithDefaultPrompt(defaultValue) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: "Please enter a Salary:",
            validate: (value) => {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]);
}

function getRolePrompt(list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            message: "Please enter a Title:",
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

function getRoleWithDefaultPrompt(defaultValue, list) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: "Please enter a Title:",
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

module.exports = {
    manageRoles,
    getAllRoles
}
