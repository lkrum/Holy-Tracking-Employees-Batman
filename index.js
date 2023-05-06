// GIVEN a command - line application that accepts user input
  // inquirer.prompt []
// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
  // inquirer list
// WHEN I choose to view all departments
  // sql code: SELECT * FROM departments
// THEN I am presented with a formatted table showing department names and department ids
  //
// WHEN I choose to view all roles
  // sql code: SELECT * FROM roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
  // id	title	Department	Salary
  // 1	Sales Lead	Sales	100, 000
  // 2	Software Developer	Technology	85, 000
  // 3	Cybersecurity Specialist	Technology	70, 000
  // 4	Lead Strategist	Operations	200, 000
  // 5	Human Resources Manager	HR	50, 000
  // 6	Marketing Assistant	Sales	55, 000
// WHEN I choose to view all employees
  // sql code: SELECT * FROM employee
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
//   id	First name	Last name	title	Department	salary	manager
// 1	Dick 	Grayson	Software Developer	Technology	85, 000	Bruce Wayne
// 2	Barbara	Gordan	Cybersecurity Specialist	Technology	70, 000	Bruce Wayne
// 3	Poison	Ivy	Marketing Assistant	Sales	55, 000	Harley Quinn
// 4	Harley	Quinn	Sales Lead	Sales	100, 000	Null
// 5	Bruce	Wayne	Lead Strategist	Operations	200, 000	Null
// 6	Alfred 	Pennysworth	Human Resources Manager	HR	50, 000	Bruce Wayne
// WHEN I choose to add a department
  // sql code: INSERT INTO department VALUES ()
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
  //  sql code: INSERT INTO role (`${id}, name, salary, department`)
    //
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
  // VALUES ()
// WHEN I choose to add an employee
  //  sql code: INSERT INTO employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
  // sql code: UPDATE employee.role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
  // sql code: SET employee.role = "`${role}`" WHERE id = `${id}`

// required imports
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'yee',
    database: 'gotham_db'
  },
);


// need functions for each prompt that user can take (e.g. add a role, add an employee, update employee name, delete employee)

// view all departments
function viewDepartment() {
  db.query('SELECT * FROM department', function (err, results) {
    console.log(results);
  });
}


// add department name
function department() {
  db.query(`INSERT INTO department SET ?`, {name: "fish" } , function (err, results) {
    if (err) {
      throw err;
    }
    console.log(results);
  });
}

// inquirer prompts
// inquirer
//   .prompt([
//     {
//       type: 'list',
//       message: 'What would you like to do?',
//       choices: ["add a department"],
//       name: 'fish'
//     },
//   ])
//   .then((data) => {
//     console.log(data)
//     if (data.name )
//   }
//   )