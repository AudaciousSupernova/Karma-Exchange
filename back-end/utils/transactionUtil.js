var mainController = require('../db/dbControllers/mainController')
var transactionQueueController = require('../db/dbControllers/transactionQueue')
var scoresUtil = require('./scoresUtil')
//<h3>Make transaction</h3>
//this is the big function of the utils. It checks for a transaction
//then, using the number of shares, updates the transaction queue for each
//open transaction present in the order added to the queue

// var sampleTransaction = {
// 	user_id: 1,
// 	target_id: 2,
// 	type: "sell",
// 	numberShares: 15,
// 	karma: 44
// }
var makeTransaction = function(transactionObj, callback){
	var desiredShares = transactionObj.numberShares
	var savedDesiredShares = desiredShares
	checkTransaction(transactionObj.target_id, transactionObj.type, function(err, response){
		if(err){
			console.log("Error finding transaction ", err)
		} else {
			//Does error checking to make sure the input is accurate
			if(desiredShares >  response[0]){
				var errorMessage ="Error in transaction util.js. Number desired exceeds number available"
				console.log(errorMessage)
				callback(errorMessage)
			} else{
				var openTransactions = response[1]
				while(desiredShares > 0){
					var sharesAvailable = openTransactions[i].numberShares
					if(desiredShares - sharesAvailable >= 0){
					}				
				}
			}
		}
	})
}

// adds a transaction to the queue
// example transactionQueue obj
// var transactionObj = {
// 	user_id: 1,
// 	type: "buy",
// 	target_id: 2,
// 	numberShares: 3
// }
var closeOpenTransaction = function(){

}


//turns the buyer into seller and switched the type
//so that both records are maintained
var reverseTransaction = function(transactionObj){
	//switches the type between buy and sell
	var newType = transactionObj.type === "buy"? "sell" : "buy";
	var newUserId = transactionObj.target_id;
	transactionObj.target_id = transactionObj.user_id;
	transactionObj.user_id = newUserId;
	transactionObj.type = newType;
}

//<h3>Transaction Queue Checkers</h3>
//checks for transactions of a type from a specific target
//uses a callback on a tuple with the first value as the number
//of total shares available to buy/sell then an array of 
//the transactionQueue objects
var checkTransaction = function(target_id, type, callback){
	transactionQueueController.findOpenTransaction(target_id,type, function(err, rows){
		if(err){
			callback(err, null)
		} else {
			var numberOfShares = 0;
			for(var i = 0; i < rows.length; i++){
				numberOfShares += rows[i].numberShares;
			}
			callback(null, [numberOfShares, rows])			
		}
	})
}

// transactionQueueController.deleteOpenTransaction(3, console.log)
// transactionQueueController.updateOpenTransaction(4, 10, console.log)
// checkTransaction(2, "buy", console.log);

// var transactionObj = {
// 	user_id: 1,
// 	type: "buy",
// 	target_id: 2,
// 	numberShares: 3
// }
// // transactionQueueController.addTransaction(transactionObj, console.log)

//creates both the buy and sell transaction and adds them
//to the transactionHist database. Usefull for populating
//the database, also can be used for direct transactions which
//is not currently supported
var makePopulateTransaction = function(transactionObj, callback){
	//set to a custom callback or a default that just logs errors
	callback = callback || function(err, response){
		if(err){
			console.log("error making transaction ", err)
		}
	}
	//adds the first transaction, swaps the data then
	//adds the second transaction
	mainController.addTransaction(transactionObj, callback)
	reverseTransaction(transactionObj);
	mainController.addTransaction(transactionObj, callback)
}

module.exports = {
	makeTransaction: makeTransaction,
	checkTransaction: checkTransaction,
	makePopulateTransaction: makePopulateTransaction,
}