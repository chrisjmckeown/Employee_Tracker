USE content_management_systems_db;

INSERT INTO department (name)
VALUES 
("Legal"),
("Engineering"),
("Finance"),
("Sales");

INSERT INTO role (title,salary,department_id)
VALUES 
("Lead Engineer",150000.0,2),
("Legal Team Lead",250000.0,1),
("Lawyer",190000.0,1),
("Sales Lead",100000.0,4),
("Salesperson",80000.0,4),
("Software Engineer",120000.0,2),
("Accountant",125000.0,3);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES
("Ashley","Rodriguez",1,NULL),
("Malia","Brown",7,NULL),
("Sarah","Lourd",2,NULL),
("Mike","Chan",5,1),
("Christrian","Eckenrode",1,2),
("John","Doe",4,3),
("Kevin","Tupik",6,3),
("Tammer","Galal",6,4),
("Tom","Allen",3,6);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;