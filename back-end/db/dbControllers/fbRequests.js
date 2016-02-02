var request = require('request');
var mainController = require("./mainController.js");


//<h3> Get Facebook Data Function </h3>

//In this section, getFacebookData should be called every day on all users
//The following all the steps required to achieve this
//make a function call to get all users
  //loop through every user and get facebook data using every user's access key
    //after getting all facebook Data
      //perform function to calculate new base score
      //update current score, so update current user
      //add new score to scores history
      //award any new karma to the user

//me/posts?fields=comments.summary(true),likes.limit(1).summary(true)

//To get the photos data: me/photos?fields=from,likes.summary(true),comments.summary(true),created_time&limit=25 loop 
//To get the feed data: me/feed?fields=from,likes.summary(true),comments.summary(true),created_time&limit=25 loop

var getFacebookData = function() {
  //call get all users
  var users;
  mainController.getAllUsers(function(err, results) {
    if (err) {
      console.log("There was an error retrieving all users", err);
    } else {
      users = results;
      users.forEach(function(user) {
        var friendScore = 0;
        var photoScore = 0;
        var feedScore = 0;
        var friends;
        var newSocialScore;
        request('https://graph.facebook.com/v2.2/me/friends/?access_token=' + user.access_token, function (error, response, body) {
          friends = JSON.parse(body).summary.total_count;
          friendScore = friends/50;
          console.log("number of friends", friendScore)
          request('https://graph.facebook.com/v2.2/me/photos/?fields=from,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
            JSON.parse(body).data.forEach(function(photo) {
              // photo.created_time provides the date the photo was posted
              photoScore += photo.comments.summary.total_count/(Math.sqrt(friends) + 1) * 4;
              photoScore += photo.likes.summary.total_count/(Math.sqrt(friends));
              // console.log("this is my photoScore", photoScore);
            // console.log(photo.from, photo.likes.summary.total_count, photo.comments.summary.total_count);
            //store this information somewhere temporary
            //generate photoScore
           })
              console.log("what is my photoScore", Math.round(photoScore));
            request('https://graph.facebook.com/v2.2/me/feed/?fields=from,type,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
              JSON.parse(body).data.forEach(function(post) {
                // post.created_time provides the date the photo was posted
                var date = new Date();
                var daysAgo = Math.ceil(((date - Date.parse(post.created_time))/(3600 * 1000 * 24)))

                if (!post.likes && !post.comments) {
                  console.log('hello');
                } else if (!post.likes) {
                  feedScore += (post.comments.summary.total_count * 4)/daysAgo;
                } else if (!post.comments) {
                  feedScore += (post.likes.summary.total_count)/daysAgo;
                } else {
                  feedScore += (post.comments.summary.total_count * 4 + post.likes.summary.total_count)/daysAgo;
                }
              })
              console.log("what is my feedscore", feedScore)

              newSocialScore = 0.1 * friendScore + 0.6 * photoScore + 0.3 * feedScore;
              newSocialScore = Math.round(newSocialScore);
              console.log("What is my new social score", newSocialScore);
              // console.log("post details", feedDetails);
              updateScores(newSocialScore, user);
            })
          })
        })
        //       //calculate new base score for user
        //       //calculate new current score
        //       //user.currentScore = new current score
        //       //user.social = new social
        //       mainController.updateUser(user, function(err, results) {
        //         if (err) {
        //           console.log('There was an error updating the user', err);
        //         } else {
        //           console.log("This is the udpated user", user);
        //           setTimeout(console.log('one user has been completed'), 1000);
        //         }
        //       })

        //     });
        //   });      
        // });      
      })
    }
  })
}

var getFacebookUserData = function(id) {
  //call get all users
  var users;

  mainController.findUserById(id, function(err, user) {

    if (err) {
      console.log("There was an error getting the user", err);
    } else {
      user = user[0];
      var friendScore = 0;
        var photoScore = 0;
        var feedScore = 0;
        var friends;
        var newSocialScore;
        request('https://graph.facebook.com/v2.2/me/friends/?access_token=' + user.access_token, function (error, response, body) {
          console.log(body.summary)
          friends = JSON.parse(body).summary.total_count;
          friendScore = friends/50;
          console.log("number of friends", friendScore)
          request('https://graph.facebook.com/v2.2/me/photos/?fields=from,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
            JSON.parse(body).data.forEach(function(photo) {
              // photo.created_time provides the date the photo was posted
              photoScore += photo.comments.summary.total_count/(Math.sqrt(friends) + 1) * 4;
              photoScore += photo.likes.summary.total_count/(Math.sqrt(friends));
              // console.log("this is my photoScore", photoScore);
            // console.log(photo.from, photo.likes.summary.total_count, photo.comments.summary.total_count);
            //store this information somewhere temporary
            //generate photoScore
           })
              console.log("what is my photoScore", Math.round(photoScore));
            request('https://graph.facebook.com/v2.2/me/feed/?fields=from,type,likes.summary(true),comments.summary(true),created_time&limit=25&access_token=' + user.access_token, function (error, response, body) {
              JSON.parse(body).data.forEach(function(post) {
                // post.created_time provides the date the photo was posted
                var date = new Date();
                var daysAgo = Math.ceil(((date - Date.parse(post.created_time))/(3600 * 1000 * 24)))

                if (!post.likes && !post.comments) {
                  console.log('hello');
                } else if (!post.likes) {
                  feedScore += (post.comments.summary.total_count * 4)/daysAgo;
                } else if (!post.comments) {
                  feedScore += (post.likes.summary.total_count)/daysAgo;
                } else {
                  feedScore += (post.comments.summary.total_count * 4 + post.likes.summary.total_count)/daysAgo;
                }
              })
              console.log("what is my feedscore", feedScore)

              newSocialScore = 0.1 * friendScore + 0.6 * photoScore + 0.3 * feedScore;
              newSocialScore = Math.round(newSocialScore);
              console.log("What is my new social score", newSocialScore);
              // console.log("post details", feedDetails);
              updateScores(newSocialScore, user);
            })
          })
        })
    }
  })

}

var updateScores = function(newSocialScore, user) {
  user.social = newSocialScore;

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

// setInterval(getFacebookData, 3.6e+6);

// getFacebookData();
// getFacebookUserData(177)

module.exports = {
  getFacebookData: getFacebookData, 
  getFacebookUserData: getFacebookUserData
}

