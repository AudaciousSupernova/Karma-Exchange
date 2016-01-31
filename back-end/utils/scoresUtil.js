var mainController = require('../db/dbControllers/mainController')

// <h3>Utilities for controlling score functions</h3>
// gets the score history for a given user and builds their
// current total scores off of it
//
// currently only builds the social score, other scores can
// be added later by extending the testObj and making the first
// value of the tuple an object containing key value pairs of
// scores in question

// {social: {
// 	base:
// 	investment:
// 	total:
// }}

//Update Investment Score Function


/*

	target_id's social investment score is being affected
	get all user info required to digest the score
	run an algorithm
	save new social-investment score

	//then pump new social-investment score and current base score through gradient
	//get new current score

	//update current score and social-investment score for this target_user
	//adding to score's historys



*/

var newSocialInvestmentScore = function(target_id) {

	var originTime = 0;
	var latestTime = 0;
	var timeOnMarket;
	var numShareHolders;
	var sharesOnMarket = 0;
	var numTransactionsMade = 0;
	var newSocialInvestmentScore;
	mainController.findUserById(target_id, function(err, user) {
		if (err) {
			console.log('This is an error', err);
		} else {
			console.log("What does my user look like", user);
			mainController.targetTransactionHist(target_id, function(err, rows) {
				if (err) {
					console.log("There was an error", err);
				} else {
					numTransactionsMade = rows.length;
					mainController.getTargetStocks(target_id, function(err, stocks) {
						if (err) {
						} else {
							numShareHolders = stocks.length;
							stocks.forEach(function(investment) {
								sharesOnMarket+= investment.numberShares;
							})
							mainController.getScores(target_id, function(err, scores) {
								if (err) {
									console.log("There was an error", err);
								} else {
									originTime = scores[0].ts;
									latestTime = scores[scores.length - 1].ts;
									timeOnMarket = latestTime - originTime;
									console.log("what is this", timeOnMarket);
									newSocialInvestmentScore = 100;
									updateScores(newSocialInvestmentScore, user[0]);
								}
							})
						}
					})
				}
			})
		}
	})
}


var updateScores = function(newSocialInvestmentScore, user) {
	user.social_investment = newSocialInvestmentScore;

	var gap = user.social - user.social_investment;
	var soc_weight = (user.social/(user.social + user.social_investment));
	var social_investment_weight = (1 - soc_weight);
	

	user.currentScore = Math.round(Math.sqrt(user.social_investment * user.social) + user.social);
	
	console.log("here are my stats", user.social, user.social_investment, user.currentScore)
	mainController.updateUser(user, function(err, results) {
		if (err) {
			console.log("There was an error", err);
		} else {
			console.log("here is the new userObj", results);
			//add score to scores history
			var scoreObj = {
				user_id: user.id, 
				social: user.social, 
				social_investment: user.social_investment, 
				currentScore: user.currentScore
			}
			mainController.addScore(scoreObj, function(err, results) {
				if (err) {
					console.log("There was an error adding the score to scores' history", err);
				} else {
					console.log("Score was successfully added to scores' history");
				}
			})
		}
	})

	//update user with new current score and newSocialInvestmentScore

}

/*

calculate new social investment score




*/

// var sampleUser = {
// 	name: "Kartik Test", 
// 	password: "test", 
// 	email: 'kartik@gmail.com', 
// 	social: 1000, 
// 	social_investment: 50, 
// 	currentScore: 50
// }

// updateScores(50, sampleUser);

// newSocialInvestmentScore(22)

var getScoresHistWithCurrentScores = function(user_id, callback){
	var testObj = {
		"social" : false,
		"social-investment" : false
	};
	var investmentTypes = {
		"social" : "social",
		"social-investment" : "social"
	}

	mainController.getScores(user_id, function(err, scoreObjs){
		var resultObj = {social:{}}

		var currentScore = 0;
		var currentIndex = scoreObjs.length - 1;

		if (currentIndex < 0) {
			callback(err, [])
		} else {
			//builds out the first two values for each score element
			while(!testTestObj(testObj)){
				console.log("what is type?", scoreObjs[currentIndex].type)
				var currentSubType = scoreObjs[currentIndex].type
				var currentInvestmentType = investmentTypes[currentSubType]
				if(!testObj[currentSubType]){
					testObj[currentSubType] = true
					resultObj[currentInvestmentType][currentSubType] = scoreObjs[currentIndex].score
				}
				currentIndex--;
			}
			addTotalsToResultObj(resultObj);
			callback(null, [resultObj, scoreObjs]);		
		}
	})
}

//tests the test object 
var testTestObj = function(testObj){
	for(var key in testObj){
		if(!testObj[key]){
			return false
		}
	}
	return true
}

var addTotalsToResultObj = function(resultObj){
	for(var key in resultObj){
	var total = 0;
	for(var subKey in resultObj[key]){
		total += resultObj[key][subKey]
	}
	resultObj[key].total = total
	}
}

module.exports = {
	getScoresHistWithCurrentScores:getScoresHistWithCurrentScores, 
	newSocialInvestmentScore: newSocialInvestmentScore, 
	updateScores: updateScores
}
