const inquirer = require('inquirer');
const table = require('console.table');
const manageRoles = require('./manageRoles');
const commonPrompts = require('./commonPrompts');

async function manageEmployees(pool) {
    while (true) {
        const { selection } = await commonPrompts.manageSelectionPrompt();
        switch (selection) {
            case "View":
                await viewAllEmployees(pool);
                break;
            case "Add":
                var { result: first_name } = await getNamePrompt("Please enter a First Name:");
                var { result: last_name } = await getNamePrompt("Please enter a Last Name:");
                var role_id = await getEmployeeRole(pool, 0);
                var manager_id = await getEmployeeManager(pool, 0);
                await addEmployee(pool, first_name.trim(), last_name.trim(), role_id, manager_id);
                break;
            case "Edit":
                var { res: list } = await getAllEmployees(pool);
                var employees = list.map(item => item.first_name + " " + item.last_name).sort();
                var { item } = await commonPrompts.selectItemPrompt("Please select a Employee to edit:", employees);
                var found = list.filter((x) => (x.first_name + " " + x.last_name) === item)[0];

                var { result: first_name } = await getNameWithDefaultPrompt("Please enter a First Name:", found.first_name);
                var { result: last_name } = await getNameWithDefaultPrompt("Please enter a Last Name:", found.last_name);
                var role_id = await getEmployeeRole(pool, found.role_id);
                var manager_id = await getEmployeeManager(pool, found.manager_id);
                await updateEmployee(pool, found.id, first_name.trim(), last_name.trim(), role_id, manager_id);
                break;
            case "Delete":
                var { res: list } = await getAllEmployees(pool);
                var employees = list.map(item => item.first_name + " " + item.last_name).sort();
                var { item } = await commonPrompts.selectItemPrompt("Please select an Employee to delete:", employees);
                console.log(item);
                var found = list.filter((x) => (x.first_name + " " + x.last_name) === item)[0];
                await deleteEmployee(pool, found.id);
                break;
            default:
                return;
        }
    }
}

async function getEmployeeManager(pool, manager_id) {
    var { res: employees } = await getAllEmployees(pool);
    var found = employees.filter((x) => x.id === manager_id);
    var managers = ["None", ...employees.map(item => item.first_name + " " + item.last_name).sort()];
    if (found.length > 0) {
        var { item: manager } = await commonPrompts.selectItemWithDefaultPrompt("Please select a Manager:", managers, found[0].first_name + " " + found[0].last_name);
    } else {
        var { item: manager } = await commonPrompts.selectItemPrompt("Please select a Manager:", managers);
    }
    var manager_id = null;
    if (manager !== "None") {
        manager_id = employees.filter((x) => (x.first_name + " " + x.last_name) === manager)[0].id;
    }
    return manager_id;
}

async function getEmployeeRole(pool, role_id) {
    var { res: list } = await manageRoles.getAllRoles(pool);
    var found = list.filter((x) => x.id === role_id);
    var roles = ["None", ...list.map(item => item.title).sort()];
    if (found.length > 0) {
        var { item: role } = await commonPrompts.selectItemWithDefaultPrompt("Please select a Role:", roles, found[0].title);
    } else {
        var { item: role } = await commonPrompts.selectItemPrompt("Please select a Role:", roles);
    }
    var role_id = null;
    if (role !== "None") {
        role_id = list.filter((x) => x.title === role)[0].id;
    }
    return role_id;
}

//#region Manage Employees mySQL
function getAllEmployees(pool) {
    return new Promise((resolve) => {
        var query = 'SELECT * FROM employee';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                resolve({ result: !err, res });
            });
    });
}

function viewAllEmployees(pool) {
    return new Promise((resolve) => {

        var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name", d.Name as "Department", r.title as "Title", r.salary as "Salary", CONCAT(m.first_name, " ", m.last_name) AS Manager '
            + 'FROM employee e LEFT JOIN role r '
            + 'ON e.role_id = r.id '
            + 'LEFT JOIN employee m '
            + 'ON m.id = e.manager_id '
            + 'LEFT JOIN department d '
            + 'ON d.id = r.department_id';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

function addEmployee(pool, first_name, last_name, role_id, manager_id) {
    return new Promise((resolve) => {
        var query = 'INSERT INTO employee SET ?';
        pool.query(query,
            [{
                first_name: first_name, last_name: last_name, role_id: role_id, manager_id: manager_id,
            }], (err) => {
                if (err) throw err;
                console.log(`Employee ${first_name} ${last_name} added!`);
                resolve({ result: !err });
            });
    });
}

function updateEmployee(pool, id, first_name, last_name, role_id, manager_id) {
    return new Promise((resolve) => {
        var query = 'UPDATE employee SET ? WHERE ?';
        pool.query(query,
            [
                {
                    first_name: first_name, last_name: last_name, role_id: role_id, manager_id: manager_id,
                },
                {
                    id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log(`Employee ${first_name} ${last_name} updated!`);
                resolve({ result: !err });
            });
    });
}

function deleteEmployee(pool, id) {
    return new Promise((resolve) => {
        var query = 'DELETE FROM employee WHERE ?';
        pool.query(query,
            [
                {
                    id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                console.log('Employee deleted!');
                resolve({ result: !err });
            });
    });
}
//#endregion

//#region Employee Prompts
function getNamePrompt(message) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            message: message,
            validate: (value) => {
                if (!value.trim()) {
                    console.log(`Please enter a valid input.`)
                    return false;
                }
                return true;
            }
        }
    ]);
}

function getNameWithDefaultPrompt(message, defaultValue) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: message,
            validate: (value) => {
                if (!value.trim()) {
                    console.log(`Please enter a valid input.`)
                    return false;
                }
                return true;
            }
        }
    ]);
}
//#endregion

module.exports = manageEmployees;