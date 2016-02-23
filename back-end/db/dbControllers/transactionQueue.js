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
// Adds a transaction to the queue

// Example transactionQueue obj:
// var transactionObj = {
// 	user_id: 1,
// 	type: "sell",
// 	target_id: 100,
// 	numberShares: 9
// }
var addTransactionToQueue = function(transactionObj, callback){
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

//Finds all transactions associated with a target_id
//Callback operates on err and an array of all open tranasctions for the target
//Can be multiple sell requests or buy requests open
//Not likely to have both buy and sell
var findOpenTransaction = function(target_id, type, callback){
	callback = arguments[arguments.length - 1]
	connection.query('SELECT * FROM openTransactions WHERE target_id=? AND type=?', [target_id, type], function(err, rows){
		if(err){
			console.log("Error finding transactions for target " + target_id, err)
			callback(err, null);
		} else{
			callback(null, rows);
		}
	})
}

//Queries for a requested transaction in the transaction queue where a user wants to buy/sell another specific user
var findOpenUserTransactionForTarget = function(user_id, target_id, type, callback){
  callback = arguments[arguments.length - 1]
  connection.query('SELECT * FROM openTransactions Where user_id=? AND target_id=? AND type=?', [user_id, target_id, type], function(err, rows){
    if(err){
      console.log("Error finding "+ type + " transactions for user" + user_id + " and target " + target_id, err)
      callback(err, null);
    } else{
      callback(null, rows);
    }
  })
}

//Queries for all open transactions in the transaction queue for a specific user
var findOpenUserTransactions = function(user_id, callback){
	connection.query('SELECT * FROM openTransactions WHERE user_id=?', user_id, function(err, rows){
		if(err){
			console.log("Error finding transactions for user " + user_id, err)
			callback(err, null);
		} else{
			callback(null, rows);
		}
	})
}


//Removes an open transaction from the Queue
var deleteOpenTransaction = function(transactionId, callback){
	connection.query('DELETE FROM openTransactions WHERE id = ?',transactionId, function (err, response) {
    if (err) {
    	console.log("error deleting transaction " + transactionId, err)
    	callback(err, null)
    }else{
	    console.log('Deleted transaction number ' + transactionId);
	    callback(null, response);
    }
  });
}

//Updates a the number of shares available/desired in the queue
var updateOpenTransaction = function(transactionId, sharesChange, callback){
	connection.query('UPDATE openTransactions SET numberShares = numberShares-? Where ID = ?',[sharesChange, transactionId], function (err, response) {
    if (err){
    	console.log("Error updating numberShares of transactionId " + transactionId)
    	callback(err, null)
    } else{
	    console.log('Changed open transaction # ' + transactionId + '\'s shares by ' + sharesChange);
	    callback(null, response);
    }
  });
}


module.exports = {
	connection: connection,
	addTransactionToQueue: addTransactionToQueue,
	findOpenTransaction: findOpenTransaction,
	deleteOpenTransaction: deleteOpenTransaction,
	updateOpenTransaction: updateOpenTransaction,
	findOpenUserTransactions: findOpenUserTransactions,
  findOpenUserTransactionForTarget: findOpenUserTransactionForTarget,
}
