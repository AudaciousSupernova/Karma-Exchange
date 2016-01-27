var mysql = require('mysql');


var connection = mysql.createConnection({
  user: "root",
  password: "supernova",
  database: "main"
});

connection.connect(function(err){
	if(err){
		console.log("error connection to Main Db");
		return;
	}
	console.log('Connected to Main Db')
});

//<h3> User database functions </h3>
//takes a userObj with name, email, karma, facebookKey, id, password
var addUser = function(userObj, callback){
	connection.query('INSERT INTO users SET ?', userObj, function(err, res){
		if(err){
			console.log("error inserting into users", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}

//finds a user based on the name and password inserted
//returns an array of obj's (should only be one) usefull for login
var findUser = function(name, password, callback){
	connection.query('SELECT * FROM users where name=? and password=?', [name, password], function(err, rows){
		// just do callback(err, user)
		if(err){
			console.log("Error finding user by name :", err)
			callback(err, null);
		} else{
			console.log(rows)
			callback(null, rows);
		}
	})
}


//finds the user by id, useful for buy/sell events
//returns an array of obj's (should only be one)
var findUserById = function(userId, callback){
	connection.query('SELECT * FROM users WHERE id=?', [userId], function(err, rows){
		if(err){
			console.log("Error finding user by id :", err)
			callback(err,null);
		} else {
			console.log(rows);
			callback(null,rows);
		}
	})
}


//finds the user by facebookKey, useful for buy/sell events
//returns an array of obj's (should only be one)
var findUserByFbKey = function(fbKey, callback){
	connection.query('SELECT * FROM users WHERE facebookKey=?', [fbKey], function(err, rows){
		if(err){
			console.log("Error finding user by facebookKey :", err)
			callback(err,null);
		} else {
			console.log(rows);
			callback(null,rows);
		}
	})
}

//returns a count of the number of users in the Db
var countUsers = function(callback){
	connection.query('select count(*) from users', function(err, count){
		if(err){
			console.log("Error counting users :", err)
			callback(err, null)
		} else{
			// the response is an array of objects with the "count(*)" key
			// since we are actually doing the wildcard count that will be our key
			callback(null, count[0]['count(*)'])
		}
	})
}

//returns an array of all users, can be used for populating
var getAllUsers = function(callback){
	connection.query('select * from users', function(err, users){
		if(err){
			console.log("Error collecting users :", err)
			callback(err, null)
		} else{
			// the response is an array of objects with the "count(*)" key
			// since we are actually doing the wildcard count that will be our key
			callback(null, users)
		}
	})

}


//updates the karma of a specified user
var updateKarma = function(userId, newKarma, callback){
	connection.query('UPDATE users SET karma = ? Where ID = ?',[newKarma, userId], function (err, result) {
	    if (err){
	    	console.log("Error updating Karma of userId " + userId)
	    	callback(err, null)
	    } else{
		    console.log('Changed user ' + userId + '\'s karma to ' + newKarma);
		    callback(null, userId);
	    }
	  }
	);
}


//updates the photo of a specified user
var updatePhoto = function (userId, newPhoto, callback){
	connection.query('UPDATE users SET profile_photo = ? Where facebookKey = ?',[newPhoto, userId], function (err, result) {
	    if (err){
	    	console.log("Error updating Photo of userId " + userId)
	    	callback(err, null)
	    } else{
		    console.log('Changed user ' + userId + '\'s photo to ' + newPhoto);
		    callback(null, userId);
	    }
	  }
	);
}


var deleteUser = function(userId, callback){
	connection.query('DELETE FROM users WHERE id = ?',userId, function (err, result) {
    if (err) {
    	console.log("error deleting user " + userId, err)
    	callback(err, null)
    }else{
	    console.log('Deleted user number ' + userId);
	    callback(null, userId);
    }
  });
}


//<h3>Transaction History functions</h3>
//userId and type
//transaction object = {user_id,target_id,type,numberShares,karma}
//type = buy/sell
//userId and target are foreign keys referencing the user schema
// var sampleTransaction = {
// 	user_id: 1,
// 	target_id: 2,
// 	type: "sell",
// 	numberShares: 15,
// 	karma: 44
// }
// addTransaction(sampleTransaction)

var addTransaction = function(transactionObj, callback){
	connection.query('INSERT INTO transactionHist SET ?', transactionObj, function(err, res){
		if(err){
			console.log("error inserting into transactionHist", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}

//takes a userId and returns a transaction history for that userId
var getTransactionHist = function(userId, callback){
	connection.query('SELECT * FROM transactionHist where user_id=?', userId, function(err, rows){
		if(err){
			console.log("Error finding transactionHist of user_id :" + userId, err)
			callback(err, null);
		} else{
			console.log(rows)
			callback(null, rows);
		}
	})
};

//<h3>Score History functions</h3>
//adds a score to the users history
//do not pass a timestamp, mysql will do this for you
//type can be social or social-investment
//other types will be available in the future
//scoreObj example

var scoreObj = {
	user_id: 243,
	type: "social",
	score: 5
}

var addScore = function(scoreObj, callback){
	connection.query('INSERT INTO scoreHist SET ?', scoreObj, function(err, res){
		if(err){
			console.log("error inserting into scoresHist", err)
			callback(err, null)
		} else{
			console.log("last inserted Id: ", res.insertId);
			callback(null, res.insertId)
		}
	})
}

// var getScores


//<h3>Current Stocks</h3>

// var addStock

// var getStocks

var getStocks = function(userId, callback){
	console.log("am i in HERE NOW", userId);
  connection.query('SELECT * FROM currentStocks WHERE user_id=?', [userId], function(err, rows){
    if(err){
      console.log("Error finding user by id :", err)
      callback(err,null);
    } else {
      console.log(rows);
      callback(null,rows);
    }
  })
}

// var updateStock

// var deleteStock

module.exports = {
	connection: connection,
	addUser: addUser,
	findUser: findUser,
	findUserById: findUserById,
	updateKarma: updateKarma,
	deleteUser: deleteUser,
	countUsers: countUsers,
	getAllUsers:getAllUsers,
	findUserByFbKey: findUserByFbKey,
	updatePhoto:updatePhoto,
	//transaction methods

	addTransaction:addTransaction,
	getTransactionHist:getTransactionHist,
	getStocks: getStocks

	//score History methods
	//addScore: addScore,
	//getScores: getScores,

	//Current Stock methods
	// addStock:addStock,
	// getStocks:getStocks,
	// updateStock:updateStock,
	// deleteStock:deleteStock,
}
