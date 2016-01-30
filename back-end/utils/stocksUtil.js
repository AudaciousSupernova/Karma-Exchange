var mainController = require('../db/dbControllers/mainController')

var sampleTransactionObj = {
	user_id: 3,
	target_id: 2,
	type: "buy",
	numberShares: 8, 
}

//<h3>Update or add stocks</h3>
//usefull when you are not sure if the stocks exist in the current
//users portfolio, updates, deletes, or adds depeding on the type
//of transaction and the number of shares in the portfolio

var updateOrAddStocks = function(transactionObj, callback){
	var transactionObj = {
		user_id: transactionObj.user_id,
		target_id: transactionObj.target_id,
		type: transactionObj.type,
		numberShares: transactionObj.numberShares
	}

	if(transactionObj.type === "sell"){
		transactionObj.numberShares = -transactionObj.numberShares
	}
	delete transactionObj['type']
	mainController.getStockRow(transactionObj.user_id, transactionObj.target_id, function(err, stockObj){
		if(err){
			callback(err)
		} else {
			var changeShares = transactionObj.numberShares
			var user_id = transactionObj.user_id
			var target_id = transactionObj.target_id
			if(stockObj.length){
				if(stockObj[0].numberShares + transactionObj.numberShares <= 0){
					//delete
					mainController.deleteStock(user_id, target_id, function(err, response){
						if(err){
							console.log(err)
							callback(err, null)
						}else {
							callback(null, response)
						}
					})
				} else {
					//update
					mainController.updateStock(user_id, target_id, changeShares, function(err, response){
						if(err){
							console.log(err)
							callback(err, null)
						} else {
							callback(null, response)
						}
					})
				}
			} else {
				//create new entry
				mainController.addStock(transactionObj, function(err, response){
					if(err){
						console.log(err)
						callback(err, null)
					} else {
						callback(null, response)
					}
				})
			}
		}
	})
}

// updateOrAddStocks(sampleTransactionObj, console.log)

// mainController.getStockRow(3, 2, console.log)

module.exports = {
	updateOrAddStocks: updateOrAddStocks,
}