var faker = require('faker');
var mainController = require('./mainController')
//<h3>Internal Use Functions For Faker Data Popoulation </h3>
//Gets all users and then adds some random scores to their history
mainController.getAllUsers(function(err, users){
	var users = users;
	var length = users.length;
	var totalAdditions = 0;
	var currentAddition = 1;

	var generateDate = function () {
		// '0000-00-00 00:00:00' MySQL timestamp format
		var year = (Math.floor(Math.random() * (2017 - 2015)) + 2015).toString();
		if (year === "2015") {
			var month = (Math.floor(Math.random() * (13 - 11)) + 11).toString();
		}
		else {
			var month = (Math.floor(Math.random() * (2 - 1)) + 1).toString();
		}
		var day = (Math.floor(Math.random() * (30 - 1)) + 1).toString();
		var hour = (Math.floor(Math.random() * (24 - 0)) + 0).toString();
		var minute = (Math.floor(Math.random() * (60 - 0)) + 0).toString();
		var second = (Math.floor(Math.random() * (60 - 0)) + 0).toString();
		if (hour.length < 2){
			hour = '0'+ hour;
		}
		if (minute.length < 2){
			minute = '0'+ minute;
		}
		if (second.length < 2){
			second = '0'+ second;
		}
		if (day.length < 2){
			day = '0'+ day;
		}
		if (month.length < 2){
			month = '0'+ month;
		}
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}

	for(var i = 0; i < length; i++){
	// for(var i = 0; i < users.length; i++){
		var numberOfNewScores = Math.floor(Math.random() * 100);
		totalAdditions += numberOfNewScores;

		for(var subI = 0; subI < numberOfNewScores; subI++){
			var randomScoreObj = {
				user_id: i+1,
				social: Math.ceil(Math.random() * 100),
				social_investment: Math.ceil(Math.random() * 100),
				currentScore: Math.ceil(Math.random() * 100),
				ts: generateDate()
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
