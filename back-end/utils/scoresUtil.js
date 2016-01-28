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
		//builds out the first two values for each score element
		while(!testTestObj(testObj)){
			var currentSubType = scoreObjs[currentIndex].type
			var currentInvestmentType = investmentTypes[currentSubType]
			if(!testObj[currentSubType]){
				testObj[currentSubType] = true
				resultObj[currentInvestmentType][currentSubType] = scoreObjs[currentIndex].score
			}
			currentIndex--;
		}
		addTotalsToResultObj(resultObj);
		callback(err, [resultObj, scoreObjs])
	})
}


getScoresHistWithCurrentScores(3,console.log)
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
	getScoresHistWithCurrentScores:getScoresHistWithCurrentScores
}
