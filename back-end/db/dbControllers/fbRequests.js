var request = require('request');
var mainController = require("./mainController.js");


//<h3> Get Facebook Data </h3>

//This function loops through all users once a day and updates the following sub scores:
  //Friend Score: calculated based on number of friends user has on Facebook
  //Photo Score: calculated based on number of recent photos and engagement (likes and comments) on each
  //Feed Score: calculated based on number of recent feed posts and engagement (likes and comments) on each
//The sub scores are all taken into account to generate a new social score.
//This new score is provided in an update to the user in the database.
//In addition, once a week, the following additional updates are made to the user in the database:
  //Using linear regression, the updateScores function will:
    //1. Update last_week_expected_social_change
    //2. Update last_week_actual_social_change
    //3. Update next_week_expected_social_change
var getFacebookData = function() {
  var users;
  mainController.getAllUsers(function(err, results) {
    if (err) {
      console.log("Not able to retrieve all users", err);
    } else {
      users = results;
      //Loop through all users
      users.forEach(function(user) {
        var friends;
        var friendScore = 0;
        var photoScore = 0;
        var feedScore = 0;
        var social_subScores;
        var newSocialScore;
        request('https://graph.facebook.com/v2.2/me/friends/?access_token=' + user.access_token, function (error, response, body) {
          friends = JSON.parse(body).summary.total_count;
          friendScore = friends/50;
          console.log("This is " + user.name + "'s friendScore: " , friendScore);
          request('https://graph.facebook.com/v2.2/me/photos/?fields=from,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
            JSON.parse(body).data.forEach(function(photo) {
              photoScore += photo.comments.summary.total_count/(Math.sqrt(friends + 1)) * 4;
              photoScore += photo.likes.summary.total_count/(Math.sqrt(friends + 1));
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
              social_subScores = {
                friendScore: friendScore,
                photoScore: photoScore,
                feedScore: feedScore
              }
              social_subScores = JSON.stringify(social_subScores);
              updateScores(newSocialScore, social_subScores, user);
            })
          })
        })
      })
      //All users have been updated here
      //get new time
      //now until next launch time should be the interval

    }
  })
}

//calling getFacebookData only in between the hours of 2AM and 4AM for all users.
setInterval(function () {
  var date = new Date();
  if (date.getHours >=2 && date.getHours <=4) {
    getFacebookData();
  }
}, 7100000)

//Similar to the function above, but only grabs facebook user data for one user by user_id
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
            photoScore += photo.comments.summary.total_count/(Math.sqrt(friends + 1)) * 4;
            photoScore += photo.likes.summary.total_count/(Math.sqrt(friends));
          })
          console.log("This is " + user.name + "'s photoScore: " , photoScore);
          request('https://graph.facebook.com/v2.2/me/feed/?fields=from,type,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
            JSON.parse(body).data.forEach(function(post) {
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

// Gets the basic facebook information using an API call to the Facebook Graph
var getFacebookProfileFromAccessToken = function(access_token, callback){
  request('https://graph.facebook.com/v2.2/me?fields=id,name,picture&access_token=' + access_token, function(err, response, body){
    if(err){
      console.log("Error getting facebook info from access token", err)
      callback(err, null)
    } else {
      callback(null, JSON.parse(body))
    }
  })
}

//Updates the facebook score, or social score for a given user.
var updateScores = function(newScore, social_subScores, user) {
  user.social = newScore;
  var soc_weight = (user.social/(user.social + user.social_investment));
  var social_investment_weight = (1 - soc_weight);
  user.currentScore = Math.round(Math.sqrt(user.social_investment * user.social) + user.social);
  user.social_subScores = social_subScores;
  //change the social_subScores
  var date = new Date();
  // If it's Wednesday, compile information for score reports
  if (date.getDay() === 3) {
    console.log("Today is Wednesday.");
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
        //Get the last week of scores for the user
        mainController.getRecentScores(user.id, function(err, recentScores) {
          if (err) {
            console.log("There was an error retrieving the recent scores", err);
          } else {
            console.log("Successfully retrieved recent scores of user");
            for (var i = 0; i<recentScores.length; i++) {
              recentYVals.push(recentScores[i].social);
              recentXVals.push(i);
            }
            //Get the history of scores for the user
            mainController.getScores(user.id, function(err, scores) {
              if (err) {
                console.log("Unable to retrieve all scores for user", err);
              } else {
                console.log("Successfully retrieved all scores for user");
                for (var i = 0; i<scores.length; i++) {
                    generalYVals.push(scores[i].social);
                    generalXVals.push(i);
                }
                //Linear regression will not work if there is only 1 score in the recent or general history.
                //In this case, populate the trend arrays with a duplicate value.
                //NOTE: This does not alter the scores history in the database
                if (generalXVals.length < 2) {
                  generalXVals.push(generalXVals[0]);
                  generalYVals.push(generalYVals[0]);
                  recentXVals.push(recentXVals[0]);
                  recentYVals.push(recentYVals[0]);
                }
                //Get the slope of the best fit line for the recent and general score trends over time
                recentVelocity = linearRegression(recentYVals, recentXVals).slope;
                generalVelocity = linearRegression(generalYVals, generalXVals).slope;
                //Gather the last weeks social change information
                user.last_week_actual_social_change = JSON.stringify(recentVelocity.toFixed());
                //Provide an estimate for next week's social change information based on the current trajectories
                user.next_week_expected_social_change = JSON.stringify((0.6*recentVelocity + 0.4*generalVelocity).toFixed());
                mainController.updateUser(user, function(err, results) {
                  if (err) {
                    console.log("Unable to update user", err);
                  } else {
                    console.log("Successfully updated user");
                  }
                })
              }
            })

          }
        })


      }
    })
  } else {
    // Update the user as normal on all other days
    mainController.updateUser(user, function(err, results) {
      if (err) {
        console.log("Unable to update user", err);
      } else {
        console.log("Successfully updated user");
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

//<h3>linearRegresssion<h3>

//Linear regression function used to grab slope of scores, recent and general.
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
  getFacebookUserData: getFacebookUserData,
  getFacebookProfileFromAccessToken: getFacebookProfileFromAccessToken
}

