var passport = require('./Auth/passport.facebook');
var mainController = require('./db/dbControllers/mainController.js');


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
    var id = req.params.id;
    mainController.findUserById(id, function(error, response) {
      if (error) {
        console.log("there was an error", error);
      } else {
        res.send(response);
      }
    })
  });

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
    var id = req.params.id;
    console.log(id);
    mainController.getStocks(id, function(err, results) {
      if (err) {
        console.log("here is the error", err);
      } else {
        var subRoutine = function(counter, results) {
          if (counter === results.length) {
            res.send(results);
          } else {
            mainController.findUserById(results[counter].target_id, function(err, response) {
              if (err) {
                console.log("there was an error", err);
              } else {
                results[counter].name = response[0].name;
                counter++;
                subRoutine(counter, results);
              }
            })
          }
        }
        subRoutine(0, results);
      }
    })
    
  })

  /*
  var id = req.params.id;
    var myStocks = [];
    mainController.getStocks(id, function(error, results) {
      var counter = 0;
      results.forEach(function(investment) {
        if (counter === results.length) {

          res.send(results);
        } else {

          mainController.findUserById(investment.target_id, function(error, response) {
              if (error) {
                console.log("there was an error", error);
              } else {
                investment.targetName = response[0].name;
                myStocks.push(investment);
                console.log("these are my stocks", myStocks);
              }
            })
          })
        }
      // console.log("what are my stocks", results);
      // res.send(results);
    })
  */

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





