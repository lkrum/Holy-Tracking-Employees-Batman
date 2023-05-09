// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

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
          addEmploy();
          break;
        case 'update an employee role':
          updateEmployeeRole();
          break;
        case 'exit':
          return;
      }
    });

  // creating separate functions for each prompt that the user can choose
  // function for viewing all departments
  function viewDepartments() {
    db.query('SELECT * FROM department', function (err, results) {
      console.log(results);
      // console.table(results);
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
      init();
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
      init();
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
        // Wesley Clements advised me to format the query using set and a 
        db.query(`INSERT INTO department SET ?`, { name: data.department }, function (err, results) {
          if (err) {
            throw err;
          }
          console.log(`${data.department} has been added to the database`);
          init();
        });
      });
  }

  // function for adding a role
  function addRole() {
    // Jessica Saddington helped me come up with the map method
    // have to query the department table to get the list of department names 
    db.query(`SELECT name FROM department`, function (err, results) {
      if (err) {
        throw err;
      };
    // creating an array to store the department name to use in the inquirer prompt
      const departName = results.map((department) => `${department.name}`)
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
          choices: departName,
          name: 'departmentType'
        }
      ])
        .then((data) => {
          console.log(data);
          db.query(`INSERT INTO role (title, salary, department_id)
      SELECT ?, ?, department_id FROM department 
      WHERE name = ?`, [data.role, data.salary, data.departmentType], function (err, results) {
            if (err) {
              throw err;
            }
            console.log(`${data.role} has been added to the database`);
            init();
          });
        });
    });
  }

  // function for adding an employee
  function addEmploy() {
    // creating a query to get the full list of roles for the prompts
    db.query(`SELECT title FROM role`, function (err, results) {
      if (err) {
        throw err;
      };
    });
    // creating an array to store the roles so we can list them in the inquirer prompt
    const roleName = results.map((roles) => `${roles.name}`)

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
        choices: roleName,
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
      INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES (?, ?, ?, ?, ?, ?);
      SELECT employee.id, employee.first_name, employee.last_name, role.title, CONCAT(manager.first_name, ' ' , manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN employee manager ON manager.id = employee.manager_id`, [data.employeeFirst, data.employeeLast, data.roleName, data.managerName,], function (err, results) {
          if (err) {
            throw err;
          }
          console.log(`${data.employeeFirst} + ${data.employeeLast} has been added to the database`);
          init();
        });
      });
  });
}

// function for updating an employee role
function updateEmployeeRole() {
  // var viewEmploy = db.query(`SELECT first_name, last_name FROM employee`, function (err, results));
  inquirer.prompt([
    {
      type: 'list',
      message: "Which employee's role do you want to update?",
      choices: viewEmploy,
      name: 'employNameUp'
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
      db.query(`UPDATE role SET ?`, {}, function (err, results) {
        if (err) {
          throw err;
        }
        console.log(`${data.role} has been added to the database`);
      });
    });
}
}

init();