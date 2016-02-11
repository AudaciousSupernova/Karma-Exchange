var passport = require('passport');
var mainController = require('../db/dbControllers/mainController')
var fbRequests = require('../db/dbControllers/fbRequests')
var FacebookStrategy = require('passport-facebook').Strategy;
var callbackURL;


//<h3> Facebook authentication with Passport </h3>
if(process.env.PORT){
  //If there is a development environment, set callbackURL to deployed.
  callbackURL = "http://karmaexchange.io/auth/facebook/callback"
} else {
  //If there isn't a development environment, set callbackURL to local.
  callbackURL = "http://127.0.0.1:3000/auth/facebook/callback"
}

// The user profile is used to identify the user from passport.
passport.serializeUser(function(user, done) {
  done(null, user);
});
// Passport will return the input user, since we are not actually serializing the user.
passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(new FacebookStrategy({
    clientID: '767594746706952',
    clientSecret: 'd917065bc815ddf8ab8779c9f0b3c664',
    callbackURL: callbackURL,
    enableProof: true,
    //fields from facebook profile that Nova uses
    profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      // console.log('Facebook Profile',profile);
      // console.log('Access Token', accessToken);
      // console.log(profile.id)
      var id = profile.id
      var displayName = profile.displayName;
      var photo = profile.photos[0].value;
      var email = profile.emails[0].value;
      var token = accessToken;
      // Passport will search the database for a record of a user
      mainController.findUserByFbKey(profile.id, function(err, profile){
        //If the user is not found, we will add the user using the authentication details
        //obtained from Facebook Authentication
        if (!profile.length) {
          var addObj = {
            'facebookKey': id,
            'name': displayName,
            'karma': 5000,
            'profile_photo':photo,
            'email': email,
            'social': 5,
            'social_investment':1,
            'currentScore':10,
            'access_token': token
          };
          mainController.addUser(addObj, function (err, userId) {
            if (err){
              console.log('Error');
            } else {
              var scoreObj = {
                user_id: userId,
                social_investment: 1,
                social: 5,
                currentScore: 10
              };
              mainController.addScore(scoreObj, function(err, response) {
                if (err) {
                  console.log("scoreObj was not added", err);
                } else {
                  addObj.id = userId;
                  fbRequests.getFacebookUserData(addObj.id)
                  done(null, addObj);
                }
              })
            }
          })
        } else {
          //If the user is found, run a check to see if the users photo has been changed
          //since the last login.
          //profile[0] is what is returned from the database when a user is found
          if (profile[0].profile_photo !== photo || profile[0].access_token !== accessToken) {
            profile[0].access_token = accessToken;
            profile[0].profile_photo = photo;
            mainController.updateUser(profile[0], function(err, user) {
              if (err) {
                console.log('Error');
              }
            });
          }
          done(null, profile[0]);
        }
      })
    });
  }
))

module.exports = passport;
