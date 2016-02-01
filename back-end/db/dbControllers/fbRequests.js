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


var getFacebookData = function() {
  //call get all users
  var users;
  mainController.getAllUsers(function(err, results) {
    if (err) {
      console.log("There was an error retrieving all users", err);
    } else {
      users = results;
      users.forEach(function(user) {
        var friends
        var pictures = 0;
        var posts = 0;
        //refresh this user's access token
          //update the user's access token in the database if it is different than what is already existing
        request('https://graph.facebook.com/v2.2/me/friends/?access_token=' + user.access_token, function (error, response, body) {
          friends = JSON.parse(body).summary.total_count;
          request('https://graph.facebook.com/v2.2/me/photos/?access_token=' + user.access_token, function (error, response, body) {
            pictures += JSON.parse(body).data.length;
            request('https://graph.facebook.com/v2.2/me/posts/?access_token=' + user.access_token, function (error, response, body) {
              posts += JSON.parse(body).data.length;
              console.log(posts);
              //calculate new base score for user
              //calculate new current score
              //user.currentScore = new current score
              //user.social = new social
              mainController.updateUser(user, function(err, results) {
                if (err) {
                  console.log('There was an error updating the user', err);
                } else {
                  console.log("This is the udpated user", user);
                  setTimeout(console.log('one user has been completed'), 1000);
                }
              })

            });
          });      
        });      
      })
    }
  })
}

// setInterval(getFacebookData, 3.6e+6);

module.exports = {
  getFacebookData: getFacebookData
}

