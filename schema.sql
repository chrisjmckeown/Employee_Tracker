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