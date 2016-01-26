var mainController = require('../db/dbControllers/mainController')

//creates both the buy and sell transaction and adds them
//to the transactionHist database
var makeTransaction = function(transactionObj, callback){
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

module.exports = {
	makeTransaction: makeTransaction,
}