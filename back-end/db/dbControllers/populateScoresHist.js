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
		var numberOfNewScores = Math.floor(Math.random() * 20);
		totalAdditions += numberOfNewScores;
		
		for(var subI = 0; subI < numberOfNewScores; subI++){
			var type = Math.random() > .5? 'social-investment' : 'social';
			var randomScoreObj = {
				user_id: i+1,
				type: type,
				score: Math.ceil(Math.random() * 100),
			}
			mainController.addScore(randomScoreObj, function(err, response){
				console.log("inserting score # " + currentAddition)
				console.log(currentAddition + ":" + totalAdditions)
				if(currentAddition === totalAdditions){
					process.exit();
				}
				currentAddition++;
			})
		}		
	}
})
