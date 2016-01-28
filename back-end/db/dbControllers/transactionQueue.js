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

//<h3>Transaction Queue function</h3>
// adds a transaction to the queue
// example transactionQueue obj
var transactionObj = {
	user_id: 1,
	type: "buy",
	target_id: 2,
	numberShares: 4
}

var addTransaction = function(transactionObj, callback){
	connection.query('INSERT INTO openTransactions SET ?', transactionObj, function(err, res){
		if(err){
			console.log("error inserting into transactionQueue", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}
addTransaction(transactionObj, console.log);

//finds all transactions associated with a target_id
//returns an array of all open tranasctions for the target
//can be multiple sell requests or buy requests open
//not likely to have both buy and sell
var findOpenTransaction = function(target_id, type, callback){
	callback = arguments[arguments.length - 1]
	connection.query('SELECT * FROM openTransactions where target_id=? and type=?', [target_id,type], function(err, rows){
		// just do callback(err, user)
		if(err){
			console.log("Error finding transactions for target " + target_id, err)
			callback(err, null);
		} else{
			callback(null, rows);
		}
	})
}

//removes an open transaction from the Queue
var deleteOpenTransaction = function(transactionId, callback){
	connection.query('DELETE FROM openTransactions WHERE id = ?',transactionId, function (err, response) {
    if (err) {
    	console.log("error deleting transaction " + transactionId, err)
    	callback(err, null)
    }else{
	    console.log('Deleted user number ' + transactionId);
	    callback(null, response);
    }
  });
}

//updates a the number of shares available/desired in the queue
var updateOpenTransaction = function(transactionId, newShares, callback){
	connection.query('UPDATE openTransactions SET numberShares = ? Where ID = ?',[newShares, transactionId], function (err, response) {
    if (err){
    	console.log("Error updating numberShares of transactionId " + transactionId)
    	callback(err, null)
    } else{
	    console.log('Changed open transaction # ' + transactionId + '\'s shares to ' + newShares);
	    callback(null, response);
    }
  });
}


module.exports = {
	connection: connection,
	addTransaction: addTransaction,
	findOpenTransaction: findOpenTransaction,
	deleteOpenTransaction: deleteOpenTransaction,
	updateOpenTransaction: updateOpenTransaction,
}