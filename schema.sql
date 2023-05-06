-- creating the database
DROP DATABASE IF EXISTS gotham_db;
CREATE DATABASE gotham_db;

USE gotham_db;
-- creating the 3 tables
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id)
);

-- inserting table information
USE gotham_db;

INSERT INTO department (id, name)
VALUES
    ( 1, "Sales"),
    ( 2, "Technology"),
    ( 3, "HR"),
    ( 4, "Operations");

  INSERT INTO role (id, title, salary, department_id)
VALUES
    ( 1, "Sales Lead", 100000, 1),
    ( 2, "Software Developer", 85000, 2),
    ( 3, "Cybersecurity Specialist", 70000, 2),
    ( 4, "Lead Strategist", 200000, 3),
    ( 5, "Human Resources Manager", 50000, 4),
    ( 6, "Marketing Assistant", 55000, 4);

    INSERT INTO employee (id, first_name, last_name, role_id,  manager_id)
    VALUES
      ( 1, "Dick", "Grayson", 1, 26),
      ( 2, "Barbara", "Gordon", 2, 26),
      ( 3, "Pamela", "Isley", 3, 13),
      ( 4, "Harley", "Quinn", 4, null),
      ( 5, "Bruce", "Wayne", 5, null),
      ( 6, "Alfred", "Pennysworth", 6, 26);
   