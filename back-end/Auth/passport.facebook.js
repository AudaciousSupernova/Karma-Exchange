var passport = require('passport');
var mainController = require('../db/dbControllers/mainController')
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
      // Passport will search the database for a record of a user
      mainController.findUserByFbKey(profile.id, function(err, profile){
        //If the user is not found, we will add the user using the authentication details
        //obtained from Facebook Authentication
        if (!profile.length) {
          var addObj = {'facebookKey': id, 'name': displayName, 'karma': 1000, 'profile_photo':photo, 'email': email};
          mainController.addUser(addObj, function (err, userId) {
            if (err){
              console.log('Error');
            } else {
              console.log(userId,'userId');
              return done(null, addObj);
            }
          })
        } else {
          //If the user is found, run a check to see if the users photo has been changed
          //since the last login.
          if (profile[0].profile_photo !== photo) {
            //Update the photo with the value provided from the most recent login
            mainController.updatePhoto(id, photo, function(err, userId) {
              if (err) {
                console.log('Error');
              } else {
                console.log('Changed picture of ' + userId);
              }
            });
          }
          console.log(profile[0], 'passport log on found user')
          return done(null, profile[0]);
        }
      })
    });
  }
))

module.exports = passport;
