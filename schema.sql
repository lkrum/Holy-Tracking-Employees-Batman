-- creating the database
DROP DATABASE IF EXISTS gotham_db;
CREATE DATABASE gotham_db;

USE gotham_db;

-- creating the department table
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
-- creating the role table
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
  REFERENCES department(id)
);
-- creating the employee table
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL REFERENCES role(id),
  manager_id INT REFERENCES employee(id),
  PRIMARY KEY (id)
);

-- inserting table information
USE gotham_db;

INSERT INTO department (id, name)
VALUES
    (1, "Sales"),
    (2, "Technology"),
    (3, "HR"),
    (4, "Operations");

INSERT INTO role (id, title, salary, department_id)
VALUES
    ( 1, "Sales Lead", 100000, 1),
    ( 2, "Software Developer", 85000, 2),
    ( 3, "Cybersecurity Specialist", 70000, 2),
    ( 4, "Lead Strategist", 200000, 4),
    ( 5, "Human Resources Manager", 50000, 3),
    ( 6, "Marketing Assistant", 55000, 1),
    ( 7, "Recruitor", 60000, 3),
    ( 8, "Strategic Advisor", 90000, 4);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
    ( 1, "Dick", "Grayson", 2, null),
    ( 2, "Barbara", "Gordon", 3, 1 ),
    ( 3, "Pamela", "Isley", 6, 4),
    ( 4, "Harley", "Quinn", 1, null),
    ( 5, "Bruce", "Wayne", 4, null),
    ( 6, "Alfred", "Pennyworth", 5, null),
    ( 7, "Jason", "Todd", 7, 6),
    ( 8, "Jim", "Gordan", 8, 5);
   