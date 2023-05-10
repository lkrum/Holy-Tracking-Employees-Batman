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
    // switch case that initiates function based on user's choice selection
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
        message: 'What is the name of the department you want to add?',
        name: 'department'
      },
    ])
      .then((data) => {
        console.log(data);
        db.query(`INSERT INTO department SET name = ?`, [data.department], function (err, results) {
          if (err) {
            throw err;
          }
          console.log(`${data.department} has been added to the database.`);
          init();
        });
      });
  }

  // function for adding a role
  function addRole() {
    // Jessica Saddington helped me come up with the map method and inserting data into the query
    // have to query the department table to get the list of department names 
    db.query(`SELECT name FROM department`, function (err, results) {
      if (err) {
        throw err;
      };
      // creating an array to store the department names to use in the inquirer prompt
      const departName = results.map((department) => department.name)

      inquirer.prompt([
        {
          type: 'input',
          message: 'What is the name of the role you want to add?',
          name: 'role'
        },
        {
          type: 'input',
          message: 'What is the salary of this role?',
          name: 'salary'
        },
        {
          type: 'list',
          message: 'Which department does this role belong to?',
          choices: departName,
          name: 'departmentType'
        }
      ])
        .then((data) => {
          console.log(data);
          db.query(`
              INSERT INTO role (title, salary, department_id)
              SELECT ?, ?, id 
              FROM department WHERE name = ?`, [data.role, data.salary, data.departmentType], function (err, results) {
            if (err) {
              throw err;
            }
            console.log(`${data.role} has been added to the database.`);
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
      // creating an array to store the role names to use in the inquirer prompt
      const roleName = results.map((role) => role.title);

      // creating a query to get the full list of manager names
      // Bootcamp tutor Patrick Lake helped me finalize this
      db.query(`SELECT first_name, last_name FROM employee WHERE manager_id IS NULL`, function (err, manResults) {
        if (err) {
          throw err;
        };

        // creating an array to store the manager names so we can list them in the inquirer prompt
        // A classmate helped me format this map function correctly, but they didn't want their name in my project
        const managerName = manResults.map(({ first_name, last_name }) => `${first_name} ${last_name}`);

        inquirer.prompt([
          {
            type: 'input',
            message: "What is the employees's first name?",
            name: 'employeeFirst'
          },
          {
            type: 'input',
            message: "What is the employees's last name?",
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
            choices: managerName,
            name: 'managerName'
          }
        ])
          .then((data) => {
            console.log(data);
            console.log(data.employeeLast)
            // have to get the role id so we can reference it in the employee table
            db.query(`SELECT id FROM role WHERE title = '${data.roleName}'`, function (err, idResults) {
              if (err) {
                throw err;
              }
              const roleId = idResults.map((role) => role.id);

              // have to get the employee id using the manager name (aka the manager_id) so we can reference it in the employee table
              db.query(`SELECT id FROM employee WHERE first_name = '${data.managerName.split(" ")[0]}' AND last_name = '${data.managerName.split(" ")[1]}'`,  function (err, IdResults) {
                if (err) {
                  throw err;
                }
                // mapping the results of the employee id to just get the number value
                const employId = IdResults.map((emId) => emId.id)
                
                //inserting the new employee name, last name, role id, and manager id into the employee table 
                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`, [data.employeeFirst, data.employeeLast, roleId, employId], function (err, results) {
                  if (err) {
                    throw err;
                  }
                  console.log(`${data.employeeFirst} ${data.employeeLast} has been added to the database.`);
                  init();
                });
              });
            });
          });
      });
    })
  }

  // function for updating an employee role
  function updateEmployeeRole() {
    // creating a query to get the full list of employees
    db.query(`SELECT first_name, last_name FROM employee`, function (err, employResults) {
      if (err) {
        throw err;
      }
      // mapping results to store the full names in a new array to use in inquirer prompt
      const employName = employResults.map(({ first_name, last_name }) => `${first_name} ${last_name}`);

      // copying same role query as in the "add employee" query to get the full list of roles stored in a new array
      db.query(`SELECT title FROM role`, function (err, results) {
        if (err) {
          throw err;
        };
        // new array to store the role names to use in the inquirer prompt
        const roleName = results.map((role) => role.title);

        inquirer.prompt([
          {
            type: 'list',
            message: "Which employee's role do you want to update?",
            choices: employName,
            name: 'employNameUp'
          },
          {
            type: 'list',
            message: 'Which role do you want to assign to the selected employee?',
            choices: roleName,
            name: 'updatedRole'
          }
        ])
          .then((data) => {
            console.log(data);
            // have to get the role id for the new employee table
            db.query(`SELECT id FROM role WHERE title = '${data.updatedRole}'`, function (err, titleResults) {
              if (err) {
                throw err;
              }
              const updatedTitle = titleResults.map((role) => role.id);

              // splitting employee selection so we can grab the first and last name to use in the updated table
              const updatedEmployName = data.employNameUp.split(" ");
              let firstName = updatedEmployName[0];
              let lastName = updatedEmployName[1];

              // updating employee table
              db.query(`
            UPDATE employee 
            SET role_id = ${updatedTitle}
            WHERE first_name = '${firstName}' AND last_name = '${lastName}'`, function (err, results) {
                if (err) {
                  throw err;
                }

                console.log(`The employee's role has been updated.`);
                init();
              });
            });
          });
      });
    });
  };

}

init();