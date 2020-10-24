DROP DATABASE IF EXISTS content_management_systems_db;
CREATE database content_management_systems_db;

USE content_management_systems_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NULL,
  salary FLOAT DEFAULT 0,
  department_id int,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL ON UPDATE CASCADE,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NULL,
  last_name VARCHAR(30) NULL,
  role_id int,
  manager_id int,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL ON UPDATE CASCADE,
  PRIMARY KEY (id)
);
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