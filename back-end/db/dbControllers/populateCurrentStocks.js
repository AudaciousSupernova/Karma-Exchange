var faker = require('faker');
var mainController = require('./mainController')

//gets all users and then adds some random scores to their history
mainController.getAllUsers(function(err, users){
	var users = users;
	var length = users.length;
	var totalAdditions = 0;
	var currentAddition = 1;

	for(var i = 0; i < length; i++){
	// for(var i = 0; i < users.length; i++){
		var numberOfNewStocks = Math.floor(Math.random() * 10);
		totalAdditions += numberOfNewStocks;
		
		for(var subI = 0; subI < numberOfNewStocks; subI++){
			var randomStockObj = {
				user_id: i+1,
				target_id: Math.ceil(Math.random() * length),
				numberShares: Math.ceil(Math.random() * 100),
			}
			mainController.addStock(randomStockObj, function(err, response){
				console.log("inserting stock # " + currentAddition)
				console.log(currentAddition + ":" + totalAdditions)
				if(currentAddition === totalAdditions){
					process.exit();
				}
				currentAddition++;
			})
		}		
	}
})
