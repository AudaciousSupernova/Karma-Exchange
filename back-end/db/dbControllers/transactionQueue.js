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

var transactionObj = {
	user_id: 1,
	type: "buy",
	target_id: 2,
	numberShares: 3
}

var addTransaction = function(transactionObj, callback){
	connection.query('INSERT INTO openTransaction SET ?', transactionObj, function(err, res){
		if(err){
			console.log("error inserting into transactionQueue", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}

//finds a user based on the name and password inserted
//returns an array of obj's (should only be one) usefull for login
var findOpenTransaction = function(target_id, callback){
	connection.query('SELECT * FROM users where target_id? and password=?', [name, password], function(err, rows){
		// just do callback(err, user)
		if(err){
			console.log("Error finding user by name :", err)
			callback(err, null);
		} else{
			// console.log(rows)
			callback(null, rows);
		}
	})
}

module.exports = {
	connection: connection,
}