var mainController = require('../db/dbControllers/mainController')
var transactionQueueController = require('../db/dbControllers/transactionQueue')
var scoresUtil = require('./scoresUtil')
var stocksUtil = require('./stocksUtil')


//<h3>Make transaction</h3>
//this is the big function of the utils. It checks for a transaction
//then, using the number of shares, updates the transaction queue for each
//open transaction present in the order added to the queue

var sampleTransaction = {
	user_id: 5,
	target_id: 4,
	type: "buy",
	numberShares: 12
}


//callback can be added in the future
var makeTransaction = function(transactionObj){
	var desiredShares = transactionObj.numberShares
	var savedDesiredShares = desiredShares
	var type = transactionObj.type === "buy"? "sell" : "buy";
	//checkTransaction returns a tuple with the first el being the number
	//of shares available/desired and the second being an array of queued
	//transactions.

	checkTransaction(transactionObj.target_id, type, function(err, transactionQueueObj){

		mainController.findUserById(transactionObj.target_id, function(err, targetUserObj){
			//sets the current share value to be used in all interactions
			var shareValue = targetUserObj[0].currentScore
			var currentShares = transactionQueueObj[0]
			console.log("What are my desired shares", desiredShares);
			console.log("What is my transactionQueueObj", transactionQueueObj);
			//Does error checking to make sure the input is accurate
			if(desiredShares >  transactionQueueObj[0]){
				var errorMessage ="Error in transaction util.js. Number desired exceeds number available"
				console.log(errorMessage)
			} else {
				var openTransactions = transactionQueueObj[1]
				var i = 0
				while(desiredShares > 0){
					var sharesAvailable = openTransactions[i].numberShares
					if(desiredShares >= sharesAvailable){
						desiredShares -= sharesAvailable
						closeOpenTransaction(openTransactions[i], shareValue)
					//if more available than desired make a partial transaction
					}	else if(desiredShares < sharesAvailable){
						//update the queue and update a partial transaction
					  updateOpenTransactionAndStocks(openTransactions[i], desiredShares, shareValue)
						desiredShares = 0
					//in the 0 case close the transaction and exit the loop
					}
					i++;
				}
				//needs to close the overarcing transaction and update karma
				closeTransactionRequest(transactionObj, shareValue)
			}
		})
	})
}

// makeTransaction(sampleTransaction);

// var sampleTransaction1 = {
// 	user_id: 3,
// 	target_id: 2,
// 	type: "sell",
// 	numberShares: 15,
// }
//closes a transaction request that either goes through make transaction
//or one that goes directly through the server
var closeTransactionRequest = function(transactionObj, shareValue){

	var desiredShares = transactionObj.numberShares
	desiredShares = transactionObj.type === "buy"? desiredShares : -desiredShares;
	transactionObj.karma = shareValue * -desiredShares

	mainController.addTransaction(transactionObj, function(err, response){
		if(err){
			console.log(err)
		}
	})
	//may want to add the update karma call into the add transaction
	mainController.updateKarma(transactionObj.user_id, transactionObj.karma, function(err, response){
		if(err){
			console.log(err)
		}
	})
	stocksUtil.updateOrAddStocks(transactionObj, function(err, response){
		if(err){
			console.log(err)
		}
			scoresUtil.newSocialInvestmentScore(transactionObj.target_id);
			//call updateInvestmentScore function from scoresUtil
			//pass the transactionObj.target_id

	})
}

// closeTransactionRequest(sampleTransaction1, 25)

var closeOpenTransaction = function(transactionQueueObj, shareValue){
	var desiredShares = transactionQueueObj.numberShares
	desiredShares = transactionQueueObj.type === "buy"? desiredShares : -desiredShares;
	var transactionId = transactionQueueObj.id
	//converts the object so it can be stored in the transaction hist table
	transactionQueueObj.karma = shareValue * -desiredShares;
	delete transactionQueueObj['id']
	mainController.addTransaction(transactionQueueObj, function(err, response){
		if(err){
			console.log(err)
		}
	})
	mainController.updateKarma(transactionQueueObj.user_id, transactionQueueObj.karma, function(err, response){
		if(err){
			console.log(err)
		}
	})
	transactionQueueController.deleteOpenTransaction(transactionId, function(err, response){
		if(err){
			console.log(err)
		}
	})
	stocksUtil.updateOrAddStocks(transactionQueueObj, function(err, response){
		if(err){
			console.log(err)
		}
	})
}

// var sampleQueueObj = {
// 	user_id:3,
// 	type:'sell',
// 	target_id:2,
// 	numberShares:8,
// 	id:78
// }
//takes a tranasctionQueueObj adds the transaction to the users
//history, updates karma, and deleted the entry from the transaction Queue

var updateOpenTransactionAndStocks = function(transactionQueueObj, sharesChange, shareValue){
	var karmaChange = transactionQueueObj.type === "sell"? sharesChange * shareValue : -sharesChange * shareValue;
	transactionQueueController.updateOpenTransaction(transactionQueueObj.id, sharesChange,function(err, transactionQueueObj){
		if(err){
			console.log(err)
		}
	})
	delete transactionQueueObj['id']
	transactionQueueObj.karma = karmaChange;
	transactionQueueObj.numberShares = sharesChange;
	mainController.addTransaction(transactionQueueObj, function(err, response){
		if(err){
			console.log(err)
		}
	})
	mainController.updateKarma(transactionQueueObj.user_id, karmaChange, function(err, response){
		if(err){
			console.log(err)
		}
	})
	stocksUtil.updateOrAddStocks(transactionQueueObj, function(err, response){
		if(err){
			console.log(err)
		}
	})
}

// updateOpenTransactionAndStocks(sampleQueueObj, 3, 50)

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

var getHistWithNames = function(user_id, callback){
	mainController.getTransactionHist(user_id, function(err, histObjs){
		var newHistObjs = [];
		if(err){
			callback(err)
		}
		var addNamesToObjs = function(i, histObjs){
			if(i === histObjs.length){
				callback(null, histObjs)
			} else {
			var histObj = histObjs[i]
			mainController.findUserById(histObj.target_id, function(err, userObj){
				if(err){
					callback(err)
				} else {
					histObj.target_name = userObj[0].name
					addNamesToObjs(i+1, histObjs)
				}
			})
			}
		}
		addNamesToObjs(0, histObjs)
	})
}
//tests
// makeTransaction(sampleTransaction)
// transactionQueueController.deleteOpenTransaction(3, console.log)
// transactionQueueController.updateOpenTransaction(4, 10, console.log)
// checkTransaction(2, "buy", console.log);

// var transactionObj = {
// 	user_id: 1,
// 	type: "buy",
// 	target_id: 2,
// 	numberShares: 3
// }
// transactionQueueController.addTransactionToQueue(transactionObj, console.log)

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
	getHistWithNames: getHistWithNames,
	closeTransactionRequest:closeTransactionRequest,
}
