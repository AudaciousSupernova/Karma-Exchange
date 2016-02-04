var passport = require('./Auth/passport.facebook');
var mainController = require('./db/dbControllers/mainController.js');
var scoresUtil = require('./utils/scoresUtil')
var transactionUtil = require('./utils/transactionUtil')
var transactionQueue = require('./db/dbControllers/transactionQueue');
var fbRequests = require('./db/dbControllers/fbRequests.js');


// fbRequests.getFacebookData();
module.exports = function (app, express) {
	app.get('/auth/facebook',
		// inside the scope array, we can include additional permissionns.
	  passport.authenticate('facebook', { scope: ['public_profile', 'user_friends', 'email', 'user_likes', 'user_photos', 'user_posts'] }));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/#/newsfeed'}));

  //Get request on login attempt
  app.get('/api/loggedin',
    function (req, res) {
      if (req.isAuthenticated()) {
        res.send(req.user);
      } else {
        res.redirect('/');
      }
    });

  //Get request on logout
  app.get('/api/logout',
    function (req,res) {
      req.logout();
      res.redirect('/#/')
    })

  //Get request to access certain user's profile
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

  //finds all users by a partial string and returns an array of them
  app.get('/users/partial/:partial', function(req, res){
    var partial = req.params.partial;
    mainController.findUsersByPartial(partial, function(error, response) {
      if (error) {
        console.log("there was an error getting the users by partial", error);
      } else {
        res.send(response);
      }
    })
  });  


  //Post request to complete buy transaction from certain user's profile
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

  app.get('/profile/score/month/:id', function (req, res) {
    var id = req.params.id;
    scoresUtil.getScoresFromDaysAway(id, 30, function (err, results) {
      if (err) {
        console.log ('error', err);
      } else {
        res.send(results);
      }
    })
  })

  app.get('/leaders', function(req, res) {
    mainController.getTopScores(2, function(err, results) {
      if (err) {
        console.log('error on leaders/top scores', err);
      } else {
        res.send(results); 
      }
    })
  })

  //Post request to add transaction to transaction history table
  app.post('/transaction/add', function(req, res) {
    var transactionObj = req.body.transactionObj;
    mainController.addTransaction(transactionObj, function(err, results) {
      if (err) {
        console.log("there was an error", err);
      } else {
        res.status(201).json(results);
      }
    })
  })
  
  //Get request to retrieve transactions associated with a certain user
  app.get('/transaction/get/:id', function(req, res) {
    var user_id = req.params.id;
    transactionUtil.getHistWithNames(user_id, function(err, results) {
      if (err) {
        console.log("there was an error", err);
      } else {
        res.send(results);
      }
    })
  })

  app.get('/transaction/check', function(req, res) {
    var target_id = req.param('target_id');
    var type = req.param('type');
    transactionUtil.checkTransaction(target_id, type, function(err, response) {
      if (err) {
        console.log(err, null);
      } else {
        console.log('response', response);
        res.json(response[0]); 
      }
    })
  })

  //Post request to make a transaction, buy or sell: will also update user and add to scores' history table
  app.post('/transaction/make', function(req, res) {
    var transactionObj = req.body.transactionObj;
    transactionUtil.makeTransaction(transactionObj)
    res.send(201); 
  })

  //Post request to add a transaction to a transaction queue (buy or sell, when matching requests are unavailable)
  app.get('/transaction/queue/:user_id', function(req, res){
    var user_id = req.params.user_id
    transactionQueue.findOpenUserTransactions(user_id, function(err, results) {
      if(err){
        console.log("Error in API routes looking for user transaction queue", err)
      } else {
        res.send(results)
      }
    })
  })

  app.post('/transaction/queue', function(req, res) {
    var transactionObj = req.body.transactionObj;
    transactionQueue.addTransactionToQueue(transactionObj, function(err, results) {
      if (err) {
        console.log(err, 'error!');
      } else {
        res.status(201).json(results);
      }
    })
  })

  app.post('/transaction/close', function(req, res) {
    var transactionObj = req.body.transactionObj;
    var shareValue = req.body.shareValue
    transactionUtil.closeTransactionRequest(transactionObj, shareValue); 
  })

  app.delete('/transaction/queue/delete/:transactionId', function(req,res){
    var transactionId = req.params.transactionId;
    transactionQueue.deleteOpenTransaction(transactionId, function(err, response){
      if(err){
        console.log("Error in api routes deleting transaction of id: " + transactionId)
      } else {
        res.send(204)
      }
    })    
  })

  //Get request to retrieve all current stocks for logged-in user
  app.get('/portfolio/:id', function(req, res) {
    var id = req.params.id;
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

  //Get request to update user's social score - links to facebook graph api requests
  app.get('/facebook/:id', function(req, res) {
    var id = req.params.id;
    fbRequests.getFacebookUserData(id);
    var string = "Successfully updated scores for all users in database!";
    res.send(string);
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





