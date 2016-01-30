var mainController = require('../db/dbControllers/mainController')

var sampleTransactionObj = {
	user_id: 3,
	target_id: 2,
	type: "sell",
	numberShares: 15, 
}
//usefull when you are not sure if the stocks exist in the current
//users portfolio

var updateOrAddStocks = function(transactionObj, callback){
	if(transactionObj.type === "sell"){
		transactionObj.numberShares = -transactionObj.numberShares
	}
	delete transactionObj['type']
	mainController.getStockRow(transactionObj.user_id, function(err, stockObj){
		if(err){
			callback(err)
		} else {
			var changeShares = transactionObj.numberShares
			var user_id = transactionObj.user_id
			var target_id = transactionObj.target_id
			if(stockObj.length){
				if(stockObj.numberShares + transactionObj.numberShares === 0){
					//delete
					mainController.deleteStock(user_id, target_id, function(err, response){
						if(err){
							console.log(err)
						}
					})
				} else {
					//update
					mainController.updateStock(user_id, target_id, changeShares, function(err, response){
						if(err){
							console.log(err)
						}
					})
				}
			} else {
				//create new entry
				mainController.addStock(transactionObj, function(err, response){
					if(err){
						console.log(err)
					}
				})
			}
		}
	})
}