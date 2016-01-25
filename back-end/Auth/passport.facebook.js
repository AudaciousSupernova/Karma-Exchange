var passport = require('passport');
// var constants = require('./../../constants'); 
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
    // profileFields: ['id', 'name','picture.type(large)', 'emails', 'displayName', 'about', 'gender']
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      console.log('Facebook Profile',profile.id);
      console.log('Access Token', accessToken);
      return done(null, profile);
    });
  }
));

module.exports = passport;