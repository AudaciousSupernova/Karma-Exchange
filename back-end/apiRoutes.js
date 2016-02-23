//Required backend dependencies
var mobileLogin = require('./Auth/mobileLogin');
var passport = require('./Auth/passport.facebook');
var mainController = require('./db/dbControllers/mainController.js');
var scoresUtil = require('./utils/scoresUtil')
var transactionUtil = require('./utils/transactionUtil')
var transactionQueue = require('./db/dbControllers/transactionQueue');
var fbRequests = require('./db/dbControllers/fbRequests.js');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


module.exports = function (app, express) {
  app.get('/auth/facebook',
		// inside the scope array, we can include additional permissionns.
	  passport.authenticate('facebook', { scope: ['public_profile', 'user_friends', 'email', 'user_photos', 'user_posts'] }));

	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect: '/api/profileOnLogin'})
  )

  app.get('/api/profileOnLogin', function (req, res) {
    var id = req.user.id
    res.redirect('/#/profile/' + id)
  })


  app.get('/mobile/login/:token', function(req,res){
    console.log("logging in mobile user")
    var access_token = req.params.token
    fbRequests.getFacebookProfileFromAccessToken(access_token, function(err, fbUserObject){
      if(err){
        console.log("Error in API routes with mobile login", err)
      } else {
        mobileLogin.verifyOrAddMobileUser(fbUserObject, access_token, function(err, userObj){
          if(err){
            console.log("Error in API routes confirming user with mobile login", err)
          } else {
            var token = jwt.sign(userObj, 'supernova', {
              expiresIn: "1d"
            });
            console.log("token", token)
            res.send({token: token,
                      userObj: userObj})
          }
        })
      }
    })
  })

  app.get('/mobile/loggedin/:sessionToken', function (req, res){
    var token = req.params.sessionToken

    jwt.verify(token, 'supernova' , function(err, decoded) {
      if (err) {
        console.log("Error in mobile login, failed to authenticate token")
        res.send({loggedin: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        res.send({loggedin: true})
      }
    });
  })

  //Get request on login attempt
  app.get('/api/loggedin',
    function (req, res) {
      if (req.isAuthenticated()) {
        mainController.findUserById(req.user.id, function(err, user) {
          res.send(user);
        })
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
  app.get('/profile/:id', function (req, res) {
    var id = req.params.id;
    mainController.findUserById(id, function (error, response) {
      if (error) {
        console.log("there was an error", error);
      } else {
        res.send(response);
      }
    })
  });

  //finds all users by a partial string and returns an array of them
  app.get('/users/partial/:partial', function (req, res){
    var partial = req.params.partial;
    mainController.findUsersByPartial(partial, function (error, response) {
      if (error) {
        console.log("there was an error getting the users by partial", error);
      } else {
        res.send(response);
      }
    })
  });

  //Post request to complete buy transaction from certain user's profile
  app.post('/profile/buy', function (req, res) {
    var investment = req.body.investment;
    mainController.addStock(investment, function (err, results) {
      if (err) {
        console.log("could not add investment", err);
      } else {
        res.status(201).json(results);
      }
    })
  })

  //Get scores data from days away for a certain user
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

  //Get top users from the user database based on current score
  app.get('/leaders', function (req, res) {
    mainController.getTopUsers(2, function (err, results) {
      if (err) {
        console.log('error on leaders/top users', err);
      } else {
        console.log("These are my results", results);
        res.send(results);
      }
    })
  })

  //Post request to add transaction to transaction history table
  app.post('/transaction/add', function (req, res) {
    var transactionObj = req.body.transactionObj;
    mainController.addTransaction(transactionObj, function (err, results) {
      if (err) {
        console.log("there was an error", err);
      } else {
        res.status(201).json(results);
      }
    })
  })

  //Get request to retrieve transactions associated with a certain user
  app.get('/transaction/get/:id', function (req, res) {
    var user_id = req.params.id;
    transactionUtil.getHistWithNames(user_id, function (err, results) {
      if (err) {
        console.log("there was an error", err);
      } else {
        res.send(results);
      }
    })
  })

  //Check transaction
  app.get('/transaction/check', function (req, res) {
    var target_id = req.param('target_id');
    var type = req.param('type');
    transactionUtil.checkTransaction(target_id, type, function (err, response) {
      if (err) {
        console.log(err, null);
      } else {
        console.log('response', response);
        res.json(response);
      }
    })
  })

  //Post request to make a transaction, buy or sell: will also update user and add to scores' history table
  app.post('/transaction/make', function (req, res) {
    var transactionObj = req.body.transactionObj;
    transactionUtil.makeTransaction(transactionObj)
    res.send(201);
  })

  //Responds with an array contiaining all transactions
  app.get('/transaction/all/', function (req, res) {
    mainController.getAllTransactions(function (err, transactions) {
      if (err) {
        console.log("Was unable to get all transactions", err);
      } else {
        transactions.forEach(function(transaction, index) {
          mainController.findUserById(transaction.user_id, function(err, user) {
            transaction.user_name = user[0].name;
            mainController.findUserById(transaction.target_id, function(err, target) {
              transaction.target_name = target[0].name;
              if (index === transactions.length - 1) {
                res.send(transactions);
              }
            })
          })
        })
      }
    })
  })

  //Post request to add a transaction to a transaction queue (buy or sell, when matching requests are unavailable)
  app.get('/transaction/queue/:user_id', function (req, res){
    var user_id = req.params.user_id
    transactionQueue.findOpenUserTransactions(user_id, function(err, results) {
      if(err){
        console.log("Error in API routes looking for user transaction queue", err)
      } else {
        res.send(results)
      }
    })
  })

  //Gets the open transactions for a user and a target user
  app.get('/transaction/queueSells', function (req, res) {
    var target_id = req.param('target_id');
    var user_id = req.param('user_id');
    transactionQueue.findOpenUserTransactionForTarget(user_id, target_id, 'sell', function (err, results) {
      if(err){
        console.log("Error in API Routes looking for a sell transaction for a specific user and target", err);
      } else {
        res.send(results);
      }
    });
  })

  //Adds transaction to transaction queue
  app.post('/transaction/queue', function (req, res) {
    var transactionObj = req.body.transactionObj;
    transactionQueue.addTransactionToQueue(transactionObj, function (err, results) {
      if (err) {
        console.log(err, 'error!');
      } else {
        res.status(201).json(results);
      }
    })
  })

  //Closes a transaction
  app.post('/transaction/close', function (req, res) {
    var transactionObj = req.body.transactionObj;
    var shareValue = req.body.shareValue
    transactionUtil.closeTransactionRequest(transactionObj, shareValue);
    res.status(201)
  })

  //Removes a transaction fron the transaction queue
  app.delete('/transaction/queue/delete/:transactionId', function (req,res){
    var transactionId = req.params.transactionId;
    transactionQueue.deleteOpenTransaction(transactionId, function (err, response){
      if(err){
        console.log("Error in api routes deleting transaction of id: " + transactionId)
      } else {
        res.send(204)
      }
    })
  })

  //Get request to retrieve all current stocks for logged-in user
  app.get('/portfolio/:id', function (req, res) {
    var id = req.params.id;
    mainController.getStocks(id, function (err, results) {
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
  app.get('/facebook/:id', function (req, res) {
    var id = req.params.id;
    fbRequests.getFacebookUserData(id);
    var string = "Successfully updated scores for all users in database!";
    res.send(string);
  })

  app.get('/api/updateInvestmentScore/:id', function (req, res) {
    var id = req.params.id;
    console.log(id)
    scoresUtil.newSocialInvestmentScore(id);
    res.status(200);
  })
};





