var faker = require('faker');
var mainController = require('./mainController')
var transactionUtil = require('../../utils/transactionUtil')

//gets all users and then adds some random transactions to them
mainController.getAllUsers(function(err, users){
	var users = users;
	var length = users.length;
	var totalTransactions = length;
	var currentTransaction = 1;

	for(var i = 0; i < length; i++){
	// for(var i = 0; i < users.length; i++){
		var numberOfNewTransactions = Math.floor(Math.random() * 10);
		totalTransactions += numberOfNewTransactions;
		
		for(var subI = 0; subI < numberOfNewTransactions; subI++){
			var type = Math.random() > .5? 'buy' : 'sell';
			var randomTransactionObj = {
				user_id: i+1,
				target_id: Math.ceil(Math.random() * users.length),
				type: type,
				numberShares: Math.ceil(Math.random() * 50),
				karma: Math.ceil(Math.random() * 20000),
			}
			transactionUtil.makePopulateTransaction(randomTransactionObj, function(err, response){
				console.log("inserting trasaction # " + currentTransaction)
				if(currentTransaction === totalTransactions){
					process.exit();
				}
				currentTransaction++;
			})
		}		
	}
})
