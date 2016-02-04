var request = require('request');
var mainController = require("./mainController.js");


//<h3> Get Facebook Data </h3>

//In this section, getFacebookData should be called every day on all users
//The following are the steps required to achieve this
//make a function call to get all users
  //loop through every user and get facebook data using every user's access key
    //after getting all facebook Data
      //perform function to calculate new base score
      //update current score, and update current user
      //add new score to scores history

var getFacebookData = function() {
  var users;
  mainController.getAllUsers(function(err, results) {
    if (err) {
      console.log("Not able to retrieve all users", err);
    } else {
      users = results;
      users.forEach(function(user) {
        var friends;
        var friendScore = 0;
        var photoScore = 0;
        var feedScore = 0;
        var newSocialScore;
        request('https://graph.facebook.com/v2.2/me/friends/?access_token=' + user.access_token, function (error, response, body) {
          friends = JSON.parse(body).summary.total_count;
          friendScore = friends/50;
          console.log("This is " + user.name + "'s friendScore: " , friendScore);
          request('https://graph.facebook.com/v2.2/me/photos/?fields=from,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
            JSON.parse(body).data.forEach(function(photo) {
              // photo.created_time provides the date the photo was posted
              photoScore += photo.comments.summary.total_count/(Math.sqrt(friends) + 1) * 4;
              photoScore += photo.likes.summary.total_count/(Math.sqrt(friends));
           })
            console.log("This is " + user.name + "'s photoScore: ", photoScore);
            request('https://graph.facebook.com/v2.2/me/feed/?fields=from,type,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
              JSON.parse(body).data.forEach(function(post) {
                // post.created_time provides the date the photo was posted
                var date = new Date();
                var daysAgo = Math.ceil(((date - Date.parse(post.created_time))/(3600 * 1000 * 24)))
                if (!post.likes && !post.comments) {
                  console.log("This post does not have any likes or comments!");
                } else if (!post.likes) {
                  feedScore += (post.comments.summary.total_count * 4)/daysAgo;
                } else if (!post.comments) {
                  feedScore += (post.likes.summary.total_count)/daysAgo;
                } else {
                  feedScore += (post.comments.summary.total_count * 4 + post.likes.summary.total_count)/daysAgo;
                }
              })
              console.log("This is " + user.name + "'s feedScore: ", feedScore)
              newSocialScore = Math.round(0.1 * friendScore + 0.6 * photoScore + 0.3 * feedScore);
              console.log("This is " + user.name + "'s newSocialScore: ", newSocialScore);
              updateScores(newSocialScore, user);
            })
          })
        })   
      })
    }
  })
}

var getFacebookUserData = function(id) {
  var users;
  mainController.findUserById(id, function(err, user) {

    if (err) {
      console.log("Unable to find user", err);
    } else {
      user = user[0];
      var friends;
      var friendScore = 0;
      var photoScore = 0;
      var feedScore = 0;
      var newSocialScore;
      request('https://graph.facebook.com/v2.2/me/friends/?access_token=' + user.access_token, function (error, response, body) {
        friends = JSON.parse(body).summary.total_count;
        friendScore = friends/50;
        console.log("This is " + user.name + "'s friendScore: " , friendScore);
        request('https://graph.facebook.com/v2.2/me/photos/?fields=from,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
          JSON.parse(body).data.forEach(function(photo) {
            // photo.created_time provides the date the photo was posted
            photoScore += photo.comments.summary.total_count/(Math.sqrt(friends) + 1) * 4;
            photoScore += photo.likes.summary.total_count/(Math.sqrt(friends));
          })
          console.log("This is " + user.name + "'s photoScore: " , photoScore);
          request('https://graph.facebook.com/v2.2/me/feed/?fields=from,type,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
            JSON.parse(body).data.forEach(function(post) {
              // post.created_time provides the date the photo was posted
              var date = new Date();
              var daysAgo = Math.ceil(((date - Date.parse(post.created_time))/(3600 * 1000 * 24)))

              if (!post.likes && !post.comments) {
                console.log("This post has no likes and no comments");
              } else if (!post.likes) {
                feedScore += (post.comments.summary.total_count * 4)/daysAgo;
              } else if (!post.comments) {
                feedScore += (post.likes.summary.total_count)/daysAgo;
              } else {
                feedScore += (post.comments.summary.total_count * 4 + post.likes.summary.total_count)/daysAgo;
              }
            })
            console.log("This is " + user.name + "'s feedScore: ", feedScore);
            newSocialScore = 0.1 * friendScore + 0.6 * photoScore + 0.3 * feedScore;
            newSocialScore = Math.round(newSocialScore);
            console.log("This is " + user.name + "'s newSocialScore: ", newSocialScore);
            updateScores(newSocialScore, "social", user);
          })
        })
      })
    }
  })
}

var updateScores = function(newScore, type, user) {
  user[type] = newScore;
  var soc_weight = (user.social/(user.social + user.social_investment));
  var social_investment_weight = (1 - soc_weight);
  user.currentScore = Math.round(Math.sqrt(user.social_investment * user.social) + user.social);
  //change the social_subScores
  // console.log(user.name + "'s social score is: ", user.social);
  // console.log(user.name + "'s social_investment score is: ", user.social_investment);
  // console.log(user.name + "'s total current score is: ", user.currentScore)
  var date = new Date();
  if (date.getDate() === 4) {
    console.log("I am in the update scores function on the thursday logic!")
    var scoreObj = {
      user_id: user.id, 
      social: user.social, 
      social_investment: user.social_investment, 
      currentScore: user.currentScore
    }
    mainController.addScore(scoreObj, function(err, results) {
      if (err) {
        console.log("Unable to add score to scores' history", err);
      } else {
        console.log("Successfully added new score to scores' history");
        user.last_week_expected_social_change = user.next_week_expected_social_change;
        var generalYVals = [];
        var generalXVals = [];
        var recentYVals = [];
        var recentXVals = [];
        var velocity;
        mainController.getRecentScores(user.id, function(err, recentScores) {
          if (err) {
            console.log("There was an error retrieving the recent scores");
          } else {
            console.log("These are my recent scores", recentScores);
            for (var i = 0; i<recentScores.length; i++) {
              recentYVals.push(recentScores[i].social);
              recentXVals.push(i);
            }
            mainController.getScores(user.id, function(err, scores) {
              if (err) {
                console.log("Unable to retrieve all scores for user", err);
              } else {
                console.log("here are ALL the scores", scores);
                for (var i = 0; i<scores.length; i++) {
                    generalYVals.push(scores[i].social);
                    generalXVals.push(i); 
                }
                if (generalXVals.length < 2) {
                  generalXVals.push(generalXVals[0]);
                  generalYVals.push(generalYVals[0]);
                  recentXVals.push(recentXVals[0]);
                  recentYVals.push(recentYVals[0]);
                }
                recentVelocity = linearRegression(recentYVals, recentXVals).slope;
                generalVelocity = linearRegression(generalYVals, generalXVals).slope;
                console.log("what is the recent velocity", recentVelocity);
                console.log("what is the general velocity", generalVelocity);
                user.last_week_actual_social_change = recentVelocity.toString();
                user.next_week_expected_social_change = (0.6*recentVelocity + 0.4*generalVelocity).toString();
                mainController.updateUser(user, function(err, results) {
                  if (err) {
                    console.log("Unable to update user", err);
                  } else {
                    console.log("Successfully updated user", results);
                  }
                })
              }
            })
            
          }
        })

        
      }
    })
  } else {
    mainController.updateUser(user, function(err, results) {
      if (err) {
        console.log("Unable to update user", err);
      } else {
        console.log("Successfully updated user", results);
        var scoreObj = {
          user_id: user.id, 
          social: user.social, 
          social_investment: user.social_investment, 
          currentScore: user.currentScore
        }
        mainController.addScore(scoreObj, function(err, results) {
          if (err) {
            console.log("Unable to add score to scores' history", err);
          } else {
            console.log("Successfully added new score to scores' history");
          }
        })
      }
    })
  }
}

// getFacebookUserData(179);
//The getFacebookData function should be called using a set interval every day at 3 AM
//Sample setInterval implementation: setInterval(getFacebookData, 3.6e+6);
//Note: getFacebookData function should also include a setTimeout at the end of each user's update score

//Add logic to the updateScores function
//Upon successfully adding the score to the scores' history table
//if the day is Tuesday
  //Reference the social_subScores
  //Reference the social_investment_subScores
  //Reference the last_week_expected_social_trend
  //Reference the last_week_actual_social_trend
  //Reference the next_week_expected_social_trend
  //change the social_subScores
  //change the last_week_expected_social_trend to what next_week's value was

  //get all social scores for users
    //look at actual trend for last week (including latest social score)
    //set that to actual last_week_actual_social_trend
    //compare to linear regression of all social scores for users
    //create a next_week_expected_social_trend value
    //update user
      //addScore

function linearRegression(y,x){
  var lr = {};
  var n = y.length;
  var sum_x = 0;
  var sum_y = 0;
  var sum_xy = 0;
  var sum_xx = 0;
  var sum_yy = 0;

  for (var i = 0; i < y.length; i++) {

    sum_x += x[i];
    sum_y += y[i];
    sum_xy += (x[i]*y[i]);
    sum_xx += (x[i]*x[i]);
    sum_yy += (y[i]*y[i]);
  }

  lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
  lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
  lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

  return lr;
}

module.exports = {
  getFacebookData: getFacebookData, 
  getFacebookUserData: getFacebookUserData
}

