var passport = require('./Auth/passport.facebook');


module.exports = function (app, express) {
	app.get('/auth/facebook',
		// inside the scope array, we can include additional permissionns. 
	  passport.authenticate('facebook', { scope: ['public_profile'] }),
	  function(req, res){});

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/#/' }),
	  function(req, res) {
	    res.redirect('/#/newsfeed');
	  });

  app.get('/profile', function(req, res) {
    console.log('this route worked!');
    var test = {
      data: 'hello'
    }
    res.send(test);
  })

  app.get('/leaders', function(req, res) {
    console.log("leader route worked too");
    var test = {
      data: 'hello here are my leaders'
    }
    res.send(test);
  })
};





