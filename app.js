const inquirer = require('inquirer');
const manageDepartments = require('./selections/manageDepartments');
const manageRoles = require('./selections/manageRoles');
const manageEmployees = require('./selections/manageEmployees');
const viewReports = require('./selections/viewReports');
const mysql = require('mysql');
const table = require('console.table');

const databaseConfig = {
    host: "localhost",
    user: "root",
    password: "bootcamp",
    database: "content_management_systems_db"
};

const pool = mysql.createPool(databaseConfig);

welcomeScreen();
start();
async function start() {
    while (true) {
        const { selection } = await primarySelectionPrompt();
        switch (selection) {
            case "Manage Departments":
                await manageDepartments(pool);
                break;
            case "Manage Roles":
               await manageRoles(pool);
                break;
            case "Manage Employees":
                await manageEmployees(pool);
                break;
            case "View Reports":
                await viewReports(pool);
                break;
            default:
                pool.end();
                return;
        }
    }
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

async function viewAllEmployeesByDepartment() {
    return new Promise((resolve) => {

        var query = 'SELECT d.Name as "Department", e.first_name as "First Name", e.last_name as "Last Name" '
            + 'FROM department d LEFT JOIN role r '
            + 'ON d.id = r.department_id '
            + 'LEFT JOIN employee e '
            + 'ON r.id = e.role_id '
            + 'ORDER BY d.Name';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\nEmployees By Department\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

function welcomeScreen() {
    console.log("____________________________________________________");
    console.log("|   _____                 _                        |");
    console.log("|  | ____|_ __ ___  _ __ | | ___  _   _  ___  ___  |");
    console.log("|  |  _| | '_ ` _ \\| '_ \\| |/ _ \\| | | |/ _ \\/ _ \\ |");
    console.log("|  | |___| | | | | | |_) | | (_) | |_| |  __/  __/ |");
    console.log("|  |_____|_| |_| |_| .__/|_|\\___/ \\__. |\\___|\\___| |");
    console.log("|                  |_|           |____/            |");
    console.log("|   __  __                                         |");
    console.log("|  |  \\/  | __ _ _ __   __ _  __ _  ___ _ __       |");
    console.log("|  | |\\/| |/ _` | '_ \\ / _` |/ _` |/ _ \\ '__|      |");
    console.log("|  | |  | | (_| | | | | (_| | (_| |  __/ |         |");
    console.log("|  |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|         |");
    console.log("|                            |___/                 |");
    console.log("|__________________________________________________|");
}