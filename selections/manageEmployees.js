const inquirer = require('inquirer');
const table = require('console.table');
let pool;

async function manageEmployees(mysqlpool) {
    pool =mysqlpool;
    while (true) {
        const { selection } = await manageSelectionPrompt();
        switch (selection) {
            case "View":
                await viewAllEmployees();
                break;
            case "Add":
                var { result: first_name } = await getStringPrompt("Please enter a First Name:");
                var { result: last_name } = await getStringPrompt("Please enter a Last Name:");
                var role_id = await getEmployeeRole();
                var manager_id = await getEmployeeManager();
                await addEmployee(first_name.trim(), last_name.trim(), role_id, manager_id);
                break;
            case "Edit":
                var { res: list } = await getAllEmployees();
                var employees = list.map(item => item.first_name + " " + item.last_name);
                var { item } = await selectItemPrompt("Please select a Employee to edit:", employees);
                var found = list.filter((x) => (x.first_name + " " + x.last_name) === item)[0];

                var { result: first_name } = await getDefaultStringPrompt("Please enter a First Name:", found.first_name);
                var { result: last_name } = await getDefaultStringPrompt("Please enter a Last Name:", found.last_name);
                var role_id = await getEmployeeRole();
                var manager_id = await getEmployeeManager();
                await updateEmployee(found.id, first_name.trim(), last_name.trim(), role_id, manager_id);
                break;
            case "Delete":
                var { res: list } = await getAllEmployees();
                var employees = list.map(item => item.first_name + " " + item.last_name);
                var { item } = await selectItemPrompt("Please select an Employee to delete:", employees);
                console.log(item);
                var id = list.filter((x) => (x.first_name + " " + x.last_name) === item)[0].id;
                await deleteEmployee(id);
                break;
            default:
                return;
        }
    }
}

async function getEmployeeManager() {
    var { res: employees } = await getAllEmployees();
    var managers = ["None", ...employees.map(item => item.first_name + " " + item.last_name)];
    var { item: manager } = await selectItemPrompt("Please select a Manager:", managers);
    var manager_id = null;
    if (manager !== "None") {
        manager_id = employees.filter((x) => (x.first_name + " " + x.last_name) === manager)[0].id;
    }
    return manager_id;
}

async function getEmployeeRole() {
    var { res: list } = await getAllRoles();
    var roles = ["None", ...list.map(item => item.title)];
    var { item: role } = await selectItemPrompt("Please select a Role:", roles);
    var role_id = null;
    if (role !== "None") {
        role_id = list.filter((x) => x.title === role)[0].id;
    }
    return role_id;
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

//#region Manage Employees mySQL
async function getAllEmployees() {
    return new Promise((resolve) => {
        var query = 'SELECT * FROM employee';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                resolve({ result: !err, res });
            });
    });
}

async function viewAllEmployees() {
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

async function addEmployee(first_name, last_name, role_id, manager_id) {
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

async function updateEmployee(id, first_name, last_name, role_id, manager_id) {
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

async function deleteEmployee(id) {
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

async function fixEmployeeManagers(id) {
    return new Promise((resolve) => {
        var query = 'UPDATE employee SET ? WHERE ?';
        pool.query(query,
            [
                {
                    manager_id: null
                },
                {
                    manager_id: id
                }
            ],
            (err, res) => {
                if (err) throw err;
                if (res.changedRows > 0) {
                    console.log(`${res.changedRows} employee manager set to null!`);
                }
                resolve({ result: !err });
            });
    });
}
//#endregion

//#region generic Prompts
function getStringPrompt(message) {
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

function getDefaultStringPrompt(message, defaultValue) {
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

module.exports = manageEmployees;