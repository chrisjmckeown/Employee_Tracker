const inquirer = require('inquirer');
const table = require('console.table');

async function viewReports(pool) {
    while (true) {
        const { selection } = await vewSelectionPrompt();
        switch (selection) {
            case "View All Employees By Department":
                await viewAllEmployeesByDepartment(pool);
                break;
            case "View All Employees By Manager":
                await viewAllEmployeesByManager(pool);
                break;
            case "View Total Budget By Department":
                await viewTotalBudgetByDepartment(pool);
                break;
            default:
                return;
        }
    }
}

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
                "View Total Budget By Department",
                "Exit Reports"
            ]
        }
    ]);
}
//#endregion

//#region View Reports mySQL
async function viewAllEmployeesByDepartment(pool) {
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

async function viewAllEmployeesByManager(pool) {
    return new Promise((resolve) => {

        var query = 'SELECT CONCAT(m.first_name, " ", m.last_name) AS Manager, CONCAT(e.first_name, " ", e.last_name) as Employee  '
            + 'FROM employee m LEFT JOIN employee e '
            + 'ON m.id = e.manager_id '
            + 'ORDER BY e.manager_id, m.first_name';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\nEmployees By Manager\n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}

async function viewTotalBudgetByDepartment(pool) {
    return new Promise((resolve) => {

        var query = 'SELECT d.Name as "Department", SUM(r.salary) as "Salary" '
            + 'FROM department d LEFT JOIN role r '
            + 'ON d.id = r.department_id '
            + 'GROUP BY d.Name';
        pool.query(query,
            (err, res) => {
                if (err) throw err;
                console.log("\nTotal Budget By Department \n");
                console.table(res);
                resolve({ result: !err });
            });
    });
}
//#endregion

module.exports = viewReports;