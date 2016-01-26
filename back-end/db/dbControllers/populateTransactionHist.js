var faker = require('faker');
var mainController = require('./mainController')
//'./db/dbControllers/populateMainDb'
mainController.getAllUsers(function(err, users){
	var users = users
	for(var i = 0; i < users.length; i++){
		var numberOfNewTransactions = Math.floor(Math.random() * 10)
		
		for(var subI = 0; subI < numberOfNewTransactions; subI++){
			var type = Math.random() > .5? 'buy' : 'sell';
			var randomTransactionObj = {
				user_id: i+1,
				target_id: Math.ceil(Math.random() * users.length),
				type: type,
				numberShares: Math.ceil(Math.random() * 50),
				karma: Math.ceil(Math.random() * 20000),
			}
			
			console.log(randomTransactionObj)
		}		
	}

})
// var sampleTransaction = {
// 	user_id: 1,
// 	target_id: 2,
// 	type: "sell",
// 	numberShares: 15,
// 	karma: 44
// }

// var numberOfNewTransactions = 100;
// var insertedUser = 1;

// for(var i = 0; i< numberOfNewUsers; i++){
// 	var randomUserObj = {
// 		name : faker.name.findName(), // Rowan Nikolaus
// 		password : faker.internet.password(),
// 		email : faker.internet.email(), // Kassandra.Haley@erich.biz
// 		karma : Math.floor(Math.random() * 20000),
// 		facebookKey : faker.random.uuid(),
// 		profile_photo : faker.image.avatar(),
// 	}
// 	mainController.addUser(randomUserObj, function(err, response){
// 		console.log("insertingUser", insertedUser)
// 		if(insertedUser === numberOfNewUsers){
// 			process.exit()
// 		}
// 		insertedUser++
// 	})
// }
