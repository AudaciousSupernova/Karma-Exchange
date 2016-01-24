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

  app.get('/portfolio', function(req, res) {
    console.log("portfolio route works");
    var test = {
      data: [
        {
          currentUser: 'Neeraj Kohirkar', 
          targetUser: 'NEW USER', 
          scores: [
            {
              name: 'NEW USER', 
              score: 9000, 
              date: 'January 5 2014'
            }, 
            {
              name: 'NEW USER', 
              score: 9000, 
              date: 'February 1 2015'
            }, 
            {
              name: 'NEW USER', 
              score: 33, 
              date: 'March 14 2012'
            }
          ], 
          shares: 15, 
          buyingPrice: 18, 
          profit: 145
        }, 
        {
          currentUser: 'Neeraj Kohirkar', 
          targetUser: 'NEWEST USER', 
          scores: [
            {
              name: 'NEWEST USER', 
              score: 10000, 
              date: 'January 5 2014'
            }, 
            {
              name: 'NEWEST USER', 
              score: 10000, 
              date: 'February 1 2015'
            }, 
            {
              name: 'NEWEST USER', 
              score: 10000, 
              date: 'March 14 2012'
            }
          ], 
          shares: 900, 
          buyingPrice: 2000, 
          profit: 500
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





