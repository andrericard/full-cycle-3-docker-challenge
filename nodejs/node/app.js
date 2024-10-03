const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

const config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB
};

const connection = mysql.createConnection(config);

const createTable = `CREATE TABLE IF NOT EXISTS people (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
)`;

connection.query(createTable);

const insertQuery = `INSERT INTO people(name) VALUES('John'), ('Jane')`;
connection.query(insertQuery);

app.get('/', (req, res) => {
  connection.query('SELECT * FROM people', (err, rows) => {
    if (err) throw err;
    let response = '<h1>Full Cycle Rocks!</h1><ul>';
    rows.forEach(person => {
      response += `<li>${person.name}</li>`;
    });
    response += '</ul>';
    res.send(response);
  });
});

app.listen(port);
