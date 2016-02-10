var mainController = require('../db/dbControllers/mainController')
var sessions = require('express-session')

var verifyOrAddMobileUser = function(fbUserObj, access_token, callback){
  var userObj = {}
  userObj.name = fbUserObj.name
  userObj.id = fbUserObj.id
  userObj.photo = fbUserObj.picture.data.url
  var photo = userObj.photo

  mainController.findUserByFbKey(userObj.id, function(err, profile){
    //If the user is not found, we will add the user using the authentication details
    //obtained from Facebook Authentication


    if (!profile.length) {
      var addObj = {
        'facebookKey': userObj.id,
        'name': userObj.name,
        'karma': 1000,
        'profile_photo':userObj.photo,
        'email': null,
        'social': 1,
        'social_investment':1,
        'currentScore':1,
        'access_token': access_token
      };
      mainController.addUser(addObj, function (err, userId) {
        if (err){
          console.log('Error');
        } else {
          var scoreObj = {
            user_id: userId,
            social_investment: 1,
            social: 1,
            currentScore: 1
          };

          mainController.addScore(scoreObj, function(err, response) {
            if (err) {
              console.log("scoreObj was not added for new mobile user", err);
            } else {
              addObj.id = userId;
              callback(null, addObj);
            }
          })
        }
      })
    } else {
      //If the user is found, run a check to see if the users photo has been changed
      //since the last login.
      console.log(profile[0].profile_photo===photo, 'checking photo equality')
      //profile[0] is what is returned from the database when a user is found
      if (profile[0].profile_photo !== photo || profile[0].access_token !== access_token) {
        profile[0].access_token = access_token;
        profile[0].profile_photo = photo;
        mainController.updateUser(profile[0], function(err, userId) {
          if (err) {
            console.log('Error');
          } else {
            console.log('Updated user ' + userId);
          }
        });
      }
      callback(null, profile[0]);
    }
  })
}

module.exports = {
  verifyOrAddMobileUser: verifyOrAddMobileUser
}