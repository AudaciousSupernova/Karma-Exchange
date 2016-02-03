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
  console.log(user.name + "'s social score is: ", user.social);
  console.log(user.name + "'s social_investment score is: ", user.social_investment);
  console.log(user.name + "'s total current score is: ", user.currentScore)
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
//The getFacebookData function should be called using a set interval every day at 3 AM
//Sample setInterval implementation: setInterval(getFacebookData, 3.6e+6);
//Note: getFacebookData function should also include a setTimeout at the end of each user's update score

module.exports = {
  getFacebookData: getFacebookData, 
  getFacebookUserData: getFacebookUserData
}

