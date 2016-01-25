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
var addUser = function(userObj){
	connection.query('INSERT INTO users SET ?', userObj, function(err, res){
		if(err){
			console.log("error inserting into users", err)
		} else{
			console.log("last inserted Id: ", res.insertId);
			return res.insertId
		}
	})
}

//finds a user based on the name and password inserted
//returns an array of obj's (should only be one) usefull for login
var findUser = function(name, password){
	connection.query('SELECT * FROM users where name=? and password=?', [name, password], function(err, rows){
		if(err){
			console.log("Error finding user by name :", err)
		} else{
			console.log(rows)
			return rows
		}
	})
}


//finds the user by id, useful for buy/sell events
//returns an array of obj's (should only be one)
var findUserById = function(userId){
	connection.query('SELECT * FROM users where id=?', userId, function(err, rows){
		if(err){
			console.log("Error finding user by id :", err)
		} else{
			console.log(rows)			
			return rows
		}
	})
}
var updateKarma = function(userId, newKarma){
	connection.query('UPDATE users SET karma = ? Where ID = ?',[newKarma, userId], function (err, result) {
	    if (err){
	    	console.log("Error updating Karma of userId " + userId)
	    } else{
		    console.log('Changed user ' + userId + '\'s karma to ' + newKarma);
	    }
	  }
	);
}


var deleteUser = function(userId){
	connection.query('DELETE FROM users WHERE id = ?',userId, function (err, result) {
    if (err) {
    	console.log("error deleting user " + userId, err)
    }else{
	    console.log('Deleted user number ' + userId);   	
    }
  });
}


//<h3>Transaction History functions</h3>
//userId and type
//transaction object = {userId,type,target,shares,karma}
//type = buy/sell
//userId and target are foreign keys referencing the user schema
var addTransaction = function(transactionObj){
	connection.query('INSERT INTO transactionHist SET ?', transactionObj, function(err, res){
		if(err){
			console.log("error inserting into transactionHist", err)
		} else{
			console.log("last inserted Id: ", res.insertId);
			return res.insertId
		}
	})
}


//<h3>Score History functions</h3>

module.exports = {
	connection: connection,
	addUser: addUser,
	findUser: findUser,
	findUserById: findUserById,
	updateKarma: updateKarma,
	deleteUser: deleteUser,
}


//example code

// var db = require('../db');

// module.exports = {

//   messages: {
//     get: function (callback) {
//       // fetch all messages
//       // text, username, roomname, id
//       var queryStr = "select messages.id, messages.text, messages.roomname, users.username \
//                       from messages left outer join users on (messages.userid = users.id) \
//                       order by messages.id desc";
//       db.query(queryStr, function(err, results) {
//         callback(err, results);
//       });
//     },
//     post: function (params, callback) {
//       // create a message for a user id based on the given username
//       var queryStr = "insert into messages(text, userid, roomname) \
//                       value (?, (select id from users where username = ? limit 1), ?)";
//       db.query(queryStr, params, function(err, results) {
//         callback(err, results);
//       });
//     }
//   },
//   users: {
//     get: function (callback) {
//       // fetch all users
//       var queryStr = "select * from users";
//       db.query(queryStr, function(err, results) {
//         callback(err, results);
//       });
//     },
//     post: function (params, callback) {
//       // create a user
//       var queryStr = "insert into users(username) values (?)";
//       db.query(queryStr, params, function(err, results) {
//         callback(err, results);
//       });
//     }
//   }
// };