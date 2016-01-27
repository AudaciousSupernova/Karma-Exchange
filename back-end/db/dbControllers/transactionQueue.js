var mysql = require('mysql');


var connection = mysql.createConnection({
  user: "root",
  password: "supernova",
  database: "transactionQueue"
});

connection.connect(function(err){
	if(err){
		console.log("error connection to transactionQueue Db");
		return;
	}
	console.log('Connected to transactionQueue Db')
});

module.exports = {
	connection: connection,
}