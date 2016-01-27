var passport = require('./Auth/passport.facebook');


module.exports = function (app, express) {
	app.get('/auth/facebook',
		// inside the scope array, we can include additional permissionns. 
	  passport.authenticate('facebook', { scope: ['public_profile', 'user_friends', 'email', 'user_likes', 'user_photos', 'user_posts'] }),
	  function(req, res){});

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/#/' }),
	  function(req, res) {
	    res.redirect('/#/newsfeed');
	  });

  app.get('/api/loggedin', 
    function (req, res) {
      auth = req.isAuthenticated();
      console.log(auth);
      if (auth) {
        res.send(req.user);
      } else {
        res.redirect('/');
      }
    });

  app.get('/api/logout', 
    function (req,res) {
      req.logout();
      res.redirect('/#/')
    })

  app.get('/profile/:id', function(req, res) {
    console.log('check the params', req.params);
    var data = {
      id: 9999,
      name: 'Neeraj Kohirkar', 
      email: '08nk08@gmail.com', 
      facebookKey: 1234,
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

  app.get('/portfolio/:id', function(req, res) {
    console.log("These are the params", req.params);
    var test = {
      data: [
        {
          currentUser: 'Neeraj Kohirkar', 
          targetUser: 'John Kim', 
          scores: [
            {
              name: 'John Kim', 
              score: 95, 
              date: 'January 5 2014'
            }, 
            {
              name: 'John Kim', 
              score: 96, 
              date: 'February 1 2015'
            }, 
            {
              name: 'John Kim', 
              score: 97, 
              date: 'March 14 2012'
            }
          ], 
          shares: 15, 
          buyingPrice: 18, 
          profit: 145
        }, 
        {
          currentUser: 'Neeraj Kohirkar', 
          targetUser: 'Adam Smith', 
          scores: [
            {
              name: 'Adam Smith', 
              score: 81, 
              date: 'January 5 2014'
            }, 
            {
              name: 'Adam Smith', 
              score: 82, 
              date: 'February 1 2015'
            }, 
            {
              name: 'Adam Smith', 
              score: 83, 
              date: 'March 14 2012'
            }
          ], 
          shares: 100, 
          buyingPrice: 70, 
          profit: -450
        }
      ]
    }
    res.send(test);
  })

  app.get('/trending', function(req, res) {
    console.log("trending route worked too");
    var test = {
      data: [
        {
          name: 'John', 
          scores: [
            {
              name: 'John', 
              score: 98, 
              date: 'January 1 2013'
            }, 
            {
              name: 'John', 
              score: 99, 
              date: 'February 22, 2014'
            }, 
            {
              name: 'John', 
              score: 22, 
              date: 'June 2, 2010'
            }
          ], 
          currentScore: 99
        }, 
        {
          name: 'Bobby', 
          scores: [
            {
              name: 'Bobby', 
              score: 98, 
              date: 'January 1 2013'
            }, 
            {
              name: 'Bobby', 
              score: 99, 
              date: 'February 22, 2014'
            }, 
            {
              name: 'Bobby', 
              score: 22, 
              date: 'June 2, 2010'
            }
          ], 
          currentScore: 99
        }
      ]
    }
    res.send(test);
  })


};





