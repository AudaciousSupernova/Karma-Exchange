var mysql = require('mysql');


var connection = mysql.createConnection({
  user: "root",
  password: "supernova",
  database: "main"
});

connection.connect();

module.exports = connection;
