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
    var data = {
      name: 'Neeraj Kohirkar', 
      scores: [
        {
          name: 'Neeraj Kohirkar', 
          score: 98, 
          date: 'January 1 2013'
        }, 
        {
          name: 'Neeraj Kohirkar', 
          score: 99, 
          date: 'February 22, 2014'
        }, 
        {
          name: 'Neeraj Kohirkar', 
          score: 22, 
          date: 'June 2, 2010'
        }
      ], 
      currentScore: 99
  };
    res.send(data);
  })

  app.get('/leaders', function(req, res) {
    console.log("leader route worked too");
    var test = [
    {
      name: 'Kyle Morehead', 
      score: 95
    }, 
    {
      name: 'Ranjit Rao', 
      score: 99
    }, 
    {
      name: 'Karthik Vempathy', 
      score: 99
    }
  ];
    res.send(test);
  })
};





