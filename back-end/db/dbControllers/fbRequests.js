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
        request('https://graph.facebook.com/v2.2/me/friends/?access_token=CAAK6H5Q1fAgBAKSlSCZBlK3Ce091FV8UnfTAKbdIZCvu7tK2GLJfXqzKnJOgZBsu3G3gdqEfkhuQ9xaPxpNeJ2sfZAAqCRBYHZCYdporyZAkeZCa12McSkz0kvysPHxLqpB8OgOZAfgZB8B2ZAHmJqZCZBZCmY2NfLxTGEZCuX8Sg0XKo4QSEqh8VMbEANSPSGJ87YphgklTaRb4jEOQZDZD', function (error, response, body) {
          friends = JSON.parse(body).summary.total_count;

          request('https://graph.facebook.com/v2.2/me/photos/?access_token=CAAK6H5Q1fAgBAKSlSCZBlK3Ce091FV8UnfTAKbdIZCvu7tK2GLJfXqzKnJOgZBsu3G3gdqEfkhuQ9xaPxpNeJ2sfZAAqCRBYHZCYdporyZAkeZCa12McSkz0kvysPHxLqpB8OgOZAfgZB8B2ZAHmJqZCZBZCmY2NfLxTGEZCuX8Sg0XKo4QSEqh8VMbEANSPSGJ87YphgklTaRb4jEOQZDZD', function (error, response, body) {
            pictures += JSON.parse(body).data.length;

            request('https://graph.facebook.com/v2.2/me/posts/?access_token=CAAK6H5Q1fAgBAKSlSCZBlK3Ce091FV8UnfTAKbdIZCvu7tK2GLJfXqzKnJOgZBsu3G3gdqEfkhuQ9xaPxpNeJ2sfZAAqCRBYHZCYdporyZAkeZCa12McSkz0kvysPHxLqpB8OgOZAfgZB8B2ZAHmJqZCZBZCmY2NfLxTGEZCuX8Sg0XKo4QSEqh8VMbEANSPSGJ87YphgklTaRb4jEOQZDZD', function (error, response, body) {
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

