var faker = require('faker');
var mainController = require('./mainController')
var transactionUtil = require('../../utils/transactionUtil')

//<h3>Internal Use Functions For Faker Data Popoulation </h3>
//Gets all users and then adds some random transactions to them
mainController.getAllUsers(function(err, users){
	var users = users;
	var length = users.length;
	for(var i = 0; i < length; i++){
		var user_id = i+1
		addToStocks(user_id, length)

	}
})

var addToStocks = function(user_id, i, length){
	mainController.getStocks(user_id, function(err, stocks){
		for(var stockIdx = 0; stockIdx < stocks.length; stockIdx++){
			var stock = stocks[stockIdx];
			var stocksAddedToHistory = 0

			while(stocksAddedToHistory < stock.numberShares){
				var randomTransactionObj = {
					user_id: user_id,
					target_id: stock.target_id,
					type: "buy",
					numberShares: Math.ceil(Math.random() * 50),
				}
				randomTransactionObj.karma = Math.ceil(Math.random() * 100)*randomTransactionObj.numberShares,


				mainController.addTransaction(randomTransactionObj, function(err, insertionId){
					if(user_id === length-1){
						process.exit();
					}
				})
				stocksAddedToHistory += randomTransactionObj.numberShares
			}
		}
	})
}
