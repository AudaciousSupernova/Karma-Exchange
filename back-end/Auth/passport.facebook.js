var passport = require('passport');
// var constants = require('./../../constants');
var mainController = require('../db/dbControllers/mainController')
var FacebookStrategy = require('passport-facebook').Strategy;
// var usersController = require('./../components/users/usersController');
var callbackURL;
if(process.env.PORT){
  callbackURL = "http://karmaexchange.io/auth/facebook/callback"
} else {
  callbackURL = "http://127.0.0.1:3000/auth/facebook/callback"
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


passport.use(new FacebookStrategy({
    clientID: '767594746706952',
    clientSecret: 'd917065bc815ddf8ab8779c9f0b3c664',
    callbackURL: callbackURL,
    enableProof: true,
    //fields from facebook profile that Nova uses; don't need at the moment
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
      mainController.findUserByFbKey(profile.id, function(err, profile){
        if (!profile.length) {
          var addObj = {'facebookKey': id, 'name': displayName, 'karma': 0, 'profile_photo':photo, 'email': email};
          mainController.addUser(addObj, function (err, userId) {
            if (err){
              console.log('Error');
            } else {
              console.log(userId,'userId');
              return done(null, addObj);
            }
          })
        } else {
          console.log(profile[0].profile_photo,'value from DB')
          if (profile[0].profile_photo !== photo) {
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
