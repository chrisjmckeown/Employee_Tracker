const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('console.table');

const databaseConfig = {
    host: "localhost",
    user: "root",
    password: "bootcamp",
    database: "content_management_systems_db"
};

const pool = mysql.createPool(databaseConfig);

start();
async function start() {
    while (true) {
        const { selection } = await primarySelectionPrompt();
        switch (selection) {
            case "Manage Departments":
                await manageDepartments();
                break;
            case "Manage Roles":
                await manageRoles();
                break;
            case "Manage Employees":
                await manageEmployees();
                break;
            case "View Reports":
                await viewReports();
                break;
            default:
                pool.end();
                return;
        }
    }
}

//#region secondary selections
async function manageDepartments() {
    while (true) {
        const { selection } = await manageSelectionPrompt();
        switch (selection) {
            case "View":
                await viewAllDepartments();
                break;
            case "Add":
                var { res: list } = await getAllDepartments();
                var { result: name } = await getDepartmentStringPrompt("Please enter a Name:", list);
                await addDepartment(name);
                break;
            case "Edit":
                var { res: list } = await getAllDepartments();
                var { item } = await selectItemPrompt("Please select a Department to rename:", list);
                var id = list.filter((x) => x.name === item)[0].id;
                var { result: name } = await getDepartmentDefaultStringPrompt("Please enter a Title:", item, list);
                await updateDepartment(id, name);
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

async function manageRoles() {
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
                await addRole(title, salary, department_id);
                break;
            case "Edit":
                var { res: list } = await getAllRoles();
                var titles = list.map(item => item.title);
                var { item } = await selectItemPrompt("Please select a Department to edit:", titles);
                var id = list.filter((x) => x.title === item)[0].id;
                var startingSalary = list.filter((x) => x.title === item)[0].salary;
                var { result: title } = await getRoleDefaultStringPrompt("Please enter a Title:", item, list);
                var { result: salary } = await getDefaultIntPrompt("Please enter a Salary:", startingSalary);
                var department_id = await getRoleDepartment();
                await updateRole(id, title, salary, department_id);
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

async function manageEmployees() {
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
                await addEmployee(first_name, last_name, role_id, manager_id);
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
                await updateEmployee(found.id, first_name, last_name, role_id, manager_id);
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

async function viewReports() {
    while (true) {
        const { selection } = await vewSelectionPrompt();
        switch (selection) {
            case "View All Employees By Department":
                await viewAllEmployeesByDepartment();
                break;
            case "View All Employees By Manager":
                await viewAllEmployeesByManager();
                break;
            case "View Total Budget By Department":
                await viewTotalBudgetByDepartment();
                break;
            default:
                return;
        }
    }
}
//#endregion

//#region switch Prompts

function vewSelectionPrompt() {
    return inquirer.prompt([
        {
            type: "list",
            message: "Do want to?",
            name: "selection",
            choices: [
                "View All Employees By Department",
                "View All Employees By Manager",
                "View Total budget By Department",
                "Exit Reports"
            ]
        }
    ]);
}

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

function primarySelectionPrompt() {
    return inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "selection",
            choices: [
                "Manage Departments",
                "Manage Roles",
                "Manage Employees",
                "View Reports",
                "Exit CMS"
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

        var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name", r.title as "Title", CONCAT(m.first_name, ", ", m.last_name) AS Manager '
            + 'FROM employee e LEFT JOIN role r '
            + 'ON e.role_id = r.id '
            + 'LEFT JOIN employee m '
            + 'ON m.id = e.manager_id';
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

//#region View Reports mySQL
async function viewAllEmployeesByDepartment() {
    return new Promise((resolve) => {

        var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name", r.title as "Title", CONCAT(m.first_name, ", ", m.last_name) AS Manager '
            + 'FROM employee e LEFT JOIN role r '
            + 'ON e.role_id = r.id '
            + 'LEFT JOIN employee m '
            + 'ON m.id = e.manager_id';

        // var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name",  CONCAT(m.first_name, ", ", m.last_name) AS Manager '
        // + 'FROM employee e LEFT JOIN employee m '
        // + 'ON m.id = e.manager_id';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}
async function viewAllEmployeesByManager() {
    return new Promise((resolve) => {

        var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name", r.title as "Title", CONCAT(m.first_name, ", ", m.last_name) AS Manager '
            + 'FROM employee e LEFT JOIN role r '
            + 'ON e.role_id = r.id '
            + 'LEFT JOIN employee m '
            + 'ON m.id = e.manager_id';

        // var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name",  CONCAT(m.first_name, ", ", m.last_name) AS Manager '
        // + 'FROM employee e LEFT JOIN employee m '
        // + 'ON m.id = e.manager_id';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

async function viewTotalBudgetByDepartment() {
    return new Promise((resolve) => {

        var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name", r.title as "Title", CONCAT(m.first_name, ", ", m.last_name) AS Manager '
            + 'FROM employee e LEFT JOIN role r '
            + 'ON e.role_id = r.id '
            + 'LEFT JOIN employee m '
            + 'ON m.id = e.manager_id';

        // var query = 'SELECT e.id as "ID", e.first_name as "First Name", e.last_name as "Last Name",  CONCAT(m.first_name, ", ", m.last_name) AS Manager '
        // + 'FROM employee e LEFT JOIN employee m '
        // + 'ON m.id = e.manager_id';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\n");
                console.table(res);
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
            message: message
        }
    ]);
}

function getDefaultStringPrompt(message, defaultValue) {
    return inquirer.prompt([
        {
            type: "input",
            name: "result",
            default: defaultValue,
            message: message
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
                return true;
            }
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
                return true;
            }
        }
    ]);
}
//#endregion

