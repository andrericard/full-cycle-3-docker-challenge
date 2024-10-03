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

let connection;

const connectToDatabase = (callback) => {
  connection = mysql.createConnection(config);
  connection.connect(err => {
    if (err) {
      return callback(false);
    }
    callback(true);
  });
};

const insertNamesAndFetch = (res) => {
  const insertQuery = `INSERT INTO people (name) VALUES ('John'), ('Jane')`;
  connection.query(insertQuery, (err) => {
    if (err) throw err;
    fetchPeople(res);
  });
};

const fetchPeople = (res) => {
  connection.query('SELECT * FROM people', (err, rows) => {
    if (err) throw err;
    renderPeople(res, rows);
  });
};

const renderPeople = (res, people = []) => {
  let response = '<h1>Full Cycle Rocks!</h1><ul>';
  people.forEach(person => {
    response += `<li>${person.name}</li>`;
  });
  response += '</ul>';
  res.send(response);
};

app.get('/', (req, res) => {
  connectToDatabase(connected => {
    if (!connected) {
      return res.send('<h1>Database is starting, please try again in 10 seconds.</h1>');
    }

    const createTable = `CREATE TABLE IF NOT EXISTS people (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))`;
    connection.query(createTable, (err) => {
      if (err) throw err;

      connection.query('SELECT * FROM people', (err, rows) => {
        if (err) throw err;

        if (rows.length === 0) {
          insertNamesAndFetch(res);
        } else {
          renderPeople(res, rows);
        }
      });
    });
  });
});

app.listen(port);
