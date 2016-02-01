var mainController = require('../db/dbControllers/mainController')
var _ = require('underscore')
var usefullVariables = require('./usefullVariables.js')

var daysInMonthByIndex = usefullVariables.daysInMonthByIndex
var monthIndexBy3Letters = usefullVariables.monthIndexBy3Letters
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

//<h3>Get Scores Functions</h3>
//The various get scores functions call the getScores controller method which returns an array populated with scoreObj's sorted by timestamp the array is then checked vs the time to return the relevant information to the client. In the future it might be usefull to combine some of this information to single days to limit the amount of information sent back to client.

//var sampleScoresObj = {	
// 	currentScore: 63
// 	id: 11749
// 	social: 43
// 	social_investment: 94
// 	ts: "2015-11-03T03:24:29.000Z"
// 	user_id: 2
// }
// returns the scores from x number of days into the past
var getScoresFromDaysAway = function(target_id, daysIntoPast, callback){
	//daysInMonthByIndex
	mainController.getScores(target_id, function(err, scoresObjs){
		if(err){
			callback(err)
		} else {
			var arrayOfScores = []
			var currentDate = new Date;
			var currentMonth = currentDate.getUTCMonth();
			var currentDay = currentDate.getUTCDate();

			var currentDayOfYear = dayOfYear(currentMonth, currentDay)
			if(currentDayOfYear <= daysIntoPast){
				currentDayOfYear += 365
			}
			//bellow is an array, the first elements has the current day being checked and the second is all of the scores for that day which will be averaged. The third element in the array will be a saved obj that will be used to store the averaged value and passed back to the user
			var singleDayValues = [-1,{"social":[],"currentScore":[]}]
			for(var i = scoresObjs.length - 1; i > 0 ; i--){
				var scoreObj = scoresObjs[i];

				var scoreTime = scoreObj.ts.toString().split(" ")
				var scoreMonth = scoreTime[1]
				var scoreDay = Number([scoreTime[2]])
				var scoreDayOfYear = dayOfYear(scoreMonth, scoreDay)
				var scoreDiff = currentDayOfYear - scoreDayOfYear
				if(scoreDiff < 0 || (scoreDiff > daysIntoPast && scoreDiff < 365)){
					break;
				}
				delete scoreObj['social_investment']
				if(singleDayValues[0] === scoreDayOfYear){
					console.log("checking again")
					singleDayValues[1].social.push(scoreObj.social)
					singleDayValues[1].social.push(scoreObj.currentScore)
					singleDayValues[2] = scoreObj
				}else{
					if(singleDayValues[1].social.length){
						var yesterdaysScoreObj = singleDayValues[2]
						var sumScore = _.reduce(singleDayValues[1].social, function(a, b){return a + b})
						yesterdaysScoreObj.social = sumScore / singleDayValues[1].social.length
						sumScore = _.reduce(singleDayValues[1].currentScore, function(a, b){return a + b})
						yesterdaysScoreObj.currentScore = sumScore / singleDayValues[1].social.length
						arrayOfScores.unshift(yesterdaysScoreObj)
					}
					singleDayValues [scoreDayOfYear,{"social":[],"currentScore":[]}]
					arrayOfScores.unshift(scoreObj)
				}
			}
			callback(null, arrayOfScores)
		}
	})
}


var dayOfYear = function(month, day){
	var dayOfYear = day
	if(typeof month === "string"){
		month = monthIndexBy3Letters[month]
	}
	for(var i = 0; i < month; i++){
		dayOfYear += daysInMonthByIndex[i]
	}
	return dayOfYear
}

getScoresFromDaysAway(2, 30, console.log)

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
	getScoresFromDaysAway: getScoresFromDaysAway,
	getScoresHistWithCurrentScores: getScoresHistWithCurrentScores, 
	newSocialInvestmentScore: newSocialInvestmentScore, 
	updateScores: updateScores
}
