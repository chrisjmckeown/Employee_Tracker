# Employee Tracker
    
![GitHub stars](https://img.shields.io/github/stars/chrisjmckeown/Employee_Tracker?style=social)![GitHub forks](https://img.shields.io/github/forks/chrisjmckeown/Employee_Tracker?style=social)![GitHub watchers](https://img.shields.io/github/watchers/chrisjmckeown/Employee_Tracker?style=social)![GitHub followers](https://img.shields.io/github/followers/chrisjmckeown?style=social)
    
[![license](https://img.shields.io/github/license/chrisjmckeown/Employee_Tracker?style=flat-square)](https://github.com/chrisjmckeown/Employee_Tracker/blob/master/LICENSE)![GitHub repo size](https://img.shields.io/github/repo-size/chrisjmckeown/Employee_Tracker?style=flat-square)![GitHub last commit](https://img.shields.io/github/last-commit/chrisjmckeown/Employee_Tracker?style=flat-square)[![GitHub contributors](https://img.shields.io/github/contributors/chrisjmckeown/Employee_Tracker?style=flat-square)](https://GitHub.com/chrisjmckeown/Employee_Tracker/graphs/contributors/)[![GitHub pull-requests](https://img.shields.io/github/issues-pr/chrisjmckeown/Employee_Tracker?style=flat-square)](https://GitHub.com/chrisjmckeown/Employee_Tracker/pull/)
    
## Description
    
A Content Management Systems interface to able viewing and managing of departments, roles, and employees in a company.
    
## Table of Contents
* [Installation](#Installation)
* [Usage](#Usage)
* [License](#License)
* [Contributing](#Contributing)
* [Tests](#Tests)
* [Questions](#Questions)

## Installation
1. Download and install [Node.js](http://nodejs.org/) (that will install npm as well)
2. Download and install [MySQL Community Server](https://dev.mysql.com/downloads/mysql) and [MySQL Workbench](https://dev.mysql.com/downloads/workbench/). These are the two database tools I used.
4. Install the 3 dependancies.<br />
    ```
    npm install inquirer mysql console.table
   ```
5. Use the seed.sql file to create the mysql database and tables.  
6. You are done for the setup, run the readme generator using 
    ```
    node app.js
   ```  

### Technologies Utilized
![GitHub language count](https://img.shields.io/github/languages/count/chrisjmckeown/Employee_Tracker?style=flat-square)![GitHub top language](https://img.shields.io/github/languages/top/chrisjmckeown/Employee_Tracker?style=flat-square)

<img src="https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/> <img src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>

## Usage
Once installed:
* Run the Employee Tracker using:
```
   node app.js
```

* When prompted, select from: 
    * Manage Departments (to view, add, edit and delete departments)
        * View (View all departments)
        * Add (Add a department)
        * Edit (Edit a department name)
        * Delete (Delete a department)
        
            Note: if a department is assigned to a role then the role's department will be set to null)
        * Exit Manage
    * Manage Roles (to view, add, edit and delete departments)
        * View (View all roles along with department name)
        * Add (Add a role with title, salary and deparment)
        * Edit (Edit a role title, salary and departement)

            Note: the above will default to current values, hit enter to make no changes.
        * Delete (Delete a role)
        
            Note: if a role is assigned to a employee then the employee's role will be set to null)
        * Exit Manage
    * Manage Employees (to view, add, edit and delete departments)
        * View (View all employees along with role title name & salary and manager)
        * Add (Add an employee with first name, last name, role and manager)
        * Edit (Edit an employee's with first name, last name, role and manager)

            Note: the above will default to current values, hit enter to make no changes.
        * Delete (Delete an employee)
        
            Note: if a employee (manager) is assigned to a employee then the employee's manager will be set to null)
        * Exit Manage
    * View Reports (to view custom reports)
        * View All Employees By Department (Department, role and employee tables joined ordered by department name)
        * View All Employees By Manager (Employee tables joined and ordered by manager id and then manager name)
        * View Total Budget By Department (Department and role table joined and grouped by departement name)
        * Exit Reports
    * Exit CMS (this will exit the CLI)

### Demonstration
Click to view the video:
https://chrisjmckeown.github.io/project_team_generator/

[![Video](./Assets/Project_Team_Generator_Demo.png)](https://drive.google.com/file/d/1Tpjjg77FdM1ZBVrWrFHGbx_14C7p-rxx/view) 

## License
 
[![license](https://img.shields.io/github/license/chrisjmckeown/Employee_Tracker.svg?style=flat-square)](https://github.com/chrisjmckeown/Employee_Tracker/blob/master/LICENSE)

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)

## Tests
Test:
* deleting a role with a department dependancy
* deleting a employee with a role dependancy
* deleting a employee with an employee (manager) dependancy
* editing a role and employee ensuring default values are working

## Questions
    
* Follow me at: <a href="https://github.com/chrisjmckeown" target="_blank">https://github.com/chrisjmckeown</a>
    
* Please email with any question at: chris.j.mckeown@hotmail.com
    
© 2020 chrisjmckeown