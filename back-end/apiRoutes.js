var passport = require('./Auth/passport.facebook');
var mainController = require('./db/dbControllers/mainController.js');
var scoresUtil = require('./utils/scoresUtil')
var transactionUtil = require('./utils/transactionUtil')


module.exports = function (app, express) {
	app.get('/auth/facebook',
		// inside the scope array, we can include additional permissionns.
	  passport.authenticate('facebook', { scope: ['public_profile', 'user_friends', 'email', 'user_likes', 'user_photos', 'user_posts'] }));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/#/newsfeed'}));

  app.get('/api/loggedin',
    function (req, res) {
      if (req.isAuthenticated()) {
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

  app.post('/profile/buy', function(req, res) {
    var investment = req.body.investment;
    mainController.addStock(investment, function(err, results) {
      if (err) {
        console.log("could not add investment", err);
      } else {
        res.status(201).json(results);
      }
    })
  })

  app.get('/profile/score/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.params, "these are my req params")
    console.log(id, "this is my id");
    scoresUtil.getScoresHistWithCurrentScores(id, function (err, results) {
      if (err) {
        console.log (err,'error');
      } else {
        console.log(results)
        res.send(results);
      }
    })
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

  app.post('/transaction/sell', function(req, res) {
    var transactionObj = req.body.transactionObj;
    mainController.addTransaction(transactionObj, function(err, results) {
      if (err) {
        console.log("there was an error", err);
      } else {
        res.status(201).json(results);
      }
    })
  })

  app.get('/transaction/check', function(req, res) {
    var target_id = req.body.target_id;
    var type = req.body.type;
    transactionUtil.checkTransaction(target_id, type, function(err, response) {
      if (err) {
        console.log(err, null);
      } else {
        console.log(response); 
        res.json(response[0]); 
      }
    })
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



  app.get('/trending', function(req, res) {
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





