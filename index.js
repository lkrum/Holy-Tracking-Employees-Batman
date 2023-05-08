
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
// sql code: SET employee.role = "`${role}`" WHERE id = `${id}`

// required imports
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to mysql database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'yee',
    database: 'gotham_db'
  },
  console.log(`Connected to the gotham_db database 🦇.`)
);

// inquirer prompts
function init() {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        choices: [
          'view all departments',
          'view all roles',
          'view all employees',
          'add a department',
          'add a role',
          'add an employee',
          'update an employee role',
          'exit'
        ],
        name: 'options'
      },
    ])
    // Jessica Saddington inspired me to try a switch case for the first time instead of using an if statement
    .then((data) => {
      switch (data.options) {
        case 'view all departments':
          viewDepartments();
          break;
        case 'view all roles':
          viewRoles();
          break;
        case 'view all employees':
          viewEmployees();
          break;
        case 'add a department':
          addDepartment();
          break;
        case 'add a role':
          addRole();
          break;
        case 'add an employee':
          addEmploy()
          break;
        case 'update an employee role':
          break;
        case 'exit':

      }
    });

  // creating separate functions for each prompt that user can choose
  // function for viewing all departments
  function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
      console.table(results);
      init();
    });
  }

  // function for viewing all roles
  function viewRoles() {
    db.query(`
              SELECT role.id, 
              role.title, 
              role.salary, 
              department.name AS department 
              FROM role 
              INNER JOIN department ON role.department_id = department.id`, function (err, results) {
      console.table(results);
    });
  }

  // function for viewing all employees
  // refereneced stackoverflow for how to create an alias name
  function viewEmployees() {
    db.query(`
            SELECT employee.id, 
            employee.first_name, 
            employee.last_name, 
            role.title, 
            department.name AS department, 
            role.salary, 
            CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            LEFT JOIN employee AS manager ON manager.id = employee.manager_id;`, function (err, results) {
      console.table(results);
    });
  }

  // function for adding a department
  function addDepartment() {
    inquirer.prompt([
      {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'department'
      },
    ])
      .then((data) => {
        console.log(data);
        db.query(`INSERT INTO department SET ?`, {name: data.department}, function (err, results) {
          if (err) {
            throw err;
          }
          console.log(`${data.department} has been added`);
        });
      });
  }
}

// function for adding a role
function addRole() {
  // add a query to get the department name from the id
  inquirer.prompt([
    {
      type: 'input',
      message: 'What is the name of the role?',
      name: 'role'
    },
    {
      type: 'input',
      message: 'What is the salary of the role?',
      name: 'salary'
    },
    {
      type: 'list',
      message: 'Which department does the role belong to?',
      choices: ['Sales', 'Technology', 'HR', 'Operations'],
      name: 'departmentType'
    }
  ])
    .then((data) => {
      console.log(data);
      db.query(`
      INSERT INTO role 
      (title, 
      salary, 
      department.name) 
      VALUES (?, ?, ?)`, [data.role, data.salary, data.departmentType], function (err, results) {
        if (err) {
          throw err;
        }
        console.table(results);
      });
    })
}


// function for adding an employee
function addEmploy() {
  inquirer.prompt([
    {
      type: 'input',
      message: "What is the employes's first name?",
      name: 'employeeFirst'
    },
    {
      type: 'input',
      message: "What is the employes's last name?",
      name: 'employeeLast'
    },
    {
      type: 'list',
      message: "What is the employee's role?",
      choices: ['Sales Lead', 'Software Developer', 'Cybersecurity Specialist', 'Lead Strategist', 'Human Resources Manager', 'Marketing Assistant', 'Recruitor', 'Strategic Advisor'],
      name: 'roleName'
    },
    {
      type: 'list',
      message: "Who is the employee's manager?",
      choices: ['Dick Grayson', 'Harley Quinn', 'Bruce Wayne', 'Alfred Pennyworth'],
      name: 'managerName'
    }
  ])
    .then((data) => {
      console.log(data);
      db.query(`
      SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN employee manager ON manager.id = employee.manager_id;
      INSERT INTO employee (first_name, last_name, title, manager) VALUES (?, ?, ?, ?, ?, ?)`, [data.employeeFirst, data.employeeLast, data.roleName, data.managerName,], function (err, results) {
        if (err) {
          throw err;
        }
        console.table(results);
      });
    })


  // function for updating an employee role
  // function updateEmployeeRole() {
  //   db.query(`UPDATE role SET ?`, {}, function (err, results) {
  //     if (err) {
  //       throw err;
  //     }
  //     console.table(results);
  //   });
  // }
  // async addDepartment() {
  //   const inquiry = await inquirer.prompt({
  //     type: 'input',
  //     message: 'What is the name of the department?',
  //     name: 'department'
  //   })







}

init();