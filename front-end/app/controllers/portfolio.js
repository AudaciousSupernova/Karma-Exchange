angular.module('app.portfolio', ["chart.js"])

  //<h2> Portfolio Controller </h2>
.controller('PortfolioController', function($scope, $location, $mdDialog, Portfolio, Auth, $rootScope, Scores, TransactionHist, User) {
  $scope.investments;
  $scope.clickedInvestment;
  $scope.currentUserInfo = "invalid";
  $scope.labels = [];
  $scope.transactions = []
  $scope.openTransactions = [];
  $scope.currentInvestmentsView = true;
  $scope.openTransactionsView = false;
  $scope.transactionHistoryView = false;
  $scope.query = {
    order: 'name',
    limit: 1,
    page: 1
  };

  //<h3>$scope.getUserById</h3>

  //Grabs the logged in user's portfolio information
  $scope.getUserById = function(id) {
    User.getUser(id)
    .then(function(user) {
      $scope.loggedinUserInfo = user[0];
    })
  }

  //<h3>setupCalls</h3>

  //Gets transaction history and loads the graph with labels on page load
  var setupCalls = function(){
    $scope.getTransactionHist();
    $scope.addLabels(30)
  }

  //<h3>$scope.getInvestments</h3>

  //Grabs all the current investment of the logged in user
  //properties on an investment object are currentScore, data, id, name, numberShares, series, target_id, user_id
  $scope.getInvestments = function(id) {
    Portfolio.getInvestments(id)
    .then(function(investments) {
      $scope.investments = investments;
    })
  }

  //<h3>Investment graph functions</h3>

  //<h3>$scope.getScores</h3>

  //Uses the investment objects to calculate the score history of the investment so that the graph can be representative
  $scope.getScores = function(target_id, obj) {
    obj.data = [[]];
    obj.series = obj.name;
    Scores.getScores(target_id)
    .then(function(scoresHist) {
      for(var i = 0; i < scoresHist.length; i++) {
        obj.data[0].push(scoresHist[i].currentScore);
      }
      var daysBeforeUserJoined = $scope.labels.length - obj.data[0].length;
      for(var i = 0; i < daysBeforeUserJoined; i++) {
        obj.data[0].unshift(0);
      }
      User.getUser(target_id)
        .then(function(user) {
          obj.currentScore = user[0].currentScore;
          $scope.addProfit(obj);
        });
    });
  }

  //<h3>$scope.getTransactionHist</h3>

  //Gets all transactions for the logged in user
  //sample properties on a transaction object are id, karma, numberShares, target_id, target_name, type, user_id
  $scope.getTransactionHist = function() {
    TransactionHist.getTransactions($rootScope.loggedinUserInfo.id)
    .then(function(results) {
      $scope.transactions = results.reverse();
      $scope.getInvestments($rootScope.loggedinUserInfo.id);
    })
  }

  //<h3>$scope.getOpenUserTransactions</h3>

  //Gets all pending transactions for the logged in user
  $scope.getOpenUserTransactions = function() {
    var user_id = $rootScope.loggedinUserInfo.id
    //Using a hash table to keep track of the openTransaction index of the user in question because of the asynch call below
    var hashedTransactions = {};
    TransactionHist.getOpenUserTransactions(user_id)
    .then(function(openTransactions) {
      for(var i = 0; i < openTransactions.length; i++) {
        var target_id = openTransactions[i].target_id;
        if(hashedTransactions[target_id]) {
          hashedTransactions[target_id].push(openTransactions[i]);
        } else {
          hashedTransactions[target_id] = [openTransactions[i]];
        }
        User.getUser(openTransactions[i].target_id)
        .then(function (userInfo) {
          userInfo = userInfo[0];
          var openTransactionForTarget = hashedTransactions[userInfo.id];
          for(var subI = 0; subI < openTransactionForTarget.length; subI++) {
            var openTransaction = openTransactionForTarget[subI];
            openTransaction.target_name = userInfo.name;
            openTransaction.currentScore = userInfo.currentScore;
          }
        });
      }
      $scope.openTransactions = openTransactions;
    });
  }

  //<h3>$scope.addLabels</h3>

  //Generates labels for the graph. Initially to 30 days in the past however that can be modified in the future
  $scope.addLabels = function(daysInPast) {
    for(; daysInPast >= 0; daysInPast--) {
      if(daysInPast % 5 === 0) {
        $scope.labels.push(daysInPast);
      } else {
        $scope.labels.push("");
      }
    }
  }

  //<h3>$scope.clickSell</h3>

  //Opens the Sell Modal
  $scope.clickSell = function(investment) {
    $scope.clickedInvestment = investment.id;
    $mdDialog.show({
      templateUrl: 'app/views/sell.html',
      locals: {
        investment: investment
      },
      controller: SellModalController
    })
      .then(function(clickedItem) {
      })
  }

  //<h3>$scope.clickCancel</h3>

  //Cancels an open transaction, removing it from the queue
  $scope.clickCancel = function(transactionId, index) {
    TransactionHist.deleteOpenTransaction(transactionId).then(function(response) {
      if(response.status === 204) {
        $scope.openTransactions.splice(index,1);
      }
    });
  }

  //<h3>$scope.buildHistString</h3>

  //Turns a transaction into a human friendly string
  $scope.buildHistString = function(transaction) {
    var type = transaction.type === "buy"? ' bought ' : ' sold ';
    var deltaKarma = transaction.type === "buy"? ' sharing ' : ' earning ';
    transaction.string = "You" + type + transaction.numberShares + " shares of " + transaction.target_name + deltaKarma + Math.abs(transaction.karma) + " karma.";
  }

  //<h3>$scope.addProfit</h3>

  //Searches through the investment history to get the profit for each set of shares
  $scope.addProfit = function(investment) {
    var shares = investment.numberShares;
    var profit = 0;

    for(var i = 0; i < $scope.transactions.length; i++) {
      var transaction = $scope.transactions[i];

      if(investment.target_id === transaction.target_id) {

        if(shares - transaction.numberShares > 0) {
          profit += (transaction.numberShares * investment.currentScore - transaction.karma)
          shares -= transaction.numberShares
          investment.profit = profit;
        } else {
          var transactionScore = Math.abs(Math.round(transaction.karma / transaction.numberShares))
          profit += (shares * investment.currentScore - shares * transactionScore)
          shares = 0
          investment.profit = profit;
          break;
        }
      }
    }
  }

  //<h3>$scope.toggleViews</h3>

  //Switches to different views within the portfolio view
  $scope.toggleViews = function(viewToShow) {
    if(viewToShow === "transactionHistory") {
      $scope.transactionHistoryView = true;
      $scope.currentInvestmentsView = false;
      $scope.openTransactionsView = false;
    } else if (viewToShow === "currentInvestments") {
      $scope.currentInvestmentsView = true;
      $scope.transactionHistoryView = false;
      $scope.openTransactionsView = false;
    } else {
      $scope.openTransactionsView = true;
      $scope.currentInvestmentsView = false;
      $scope.transactionHistoryView = false;
    }
  }

  //<h3>$scope.toggleOpenTransactions</h3>

  //Gets the users open transactions and switches the view to the openTransactions view
  $scope.toggleOpenTransactions = function() {
    $scope.getOpenUserTransactions();
    $scope.toggleViews('openTransactions');
  }

  setupCalls();

  //<h3>Sell Modal Controller</h3>

  //The Sell Modal Controller, which handles all possible sell actions
  function SellModalController($scope, $mdDialog, $location, investment, TransactionHist, Socket, Scores, User, $rootScope) {
    $scope.investment = investment;
    $scope.requestedShares;
    $scope.requestedSharesInfo;
    $scope.sharesToSell=0;
    $scope.scores;
    $scope.targetCurrentScore;
    $scope.numSharesInTransactionQueueByUser;
    $scope.revealOptions = false;
    $scope.errorMessage = false;

    //<h3>$scope.getUsersOpenSellTransactionsForTarget</h3>

    //Gets the open sell requests of a target by a certain user
    $scope.getUsersOpenSellTransactionsForTarget = function () {
      $scope.numSharesInTransactionQueueByUser = 0;
      TransactionHist.getOpenUserSellTransactionsForTarget($scope.investment.user_id, $scope.investment.target_id)
        .then(function (response) {
          for (var i = 0; i < response.length; i++) {
            $scope.numSharesInTransactionQueueByUser += response[i].numberShares;
          }
        })
    }

    //<h3>$scope.confirm</h3>

    //Confirm checks to see if logged in user can sell x number of shares
    $scope.confirm = function() {
      //Transaction object that is representative of the action the user is taking.
      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.sharesToSell,
      }
      //User cannot sell more shares than they has or more shares than the amount of their shares not in the transaction queue
      if ($scope.sharesToSell > $scope.investment.numberShares - $scope.numSharesInTransactionQueueByUser) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        if ($scope.sharesToSell > $scope.requestedShares) {
          $scope.revealOptions = true;
          console.log("There are not enough matching buy requests to match your request to sell.")
        } else {
          TransactionHist.makeTransaction(transaction)
            .then(function () {
              $mdDialog.hide();
              $location.path('/portfolio/'+$rootScope.loggedinUserInfo.id);
            })
          if ($scope.requestedSharesInfo && $scope.requestedSharesInfo.user_id !== $rootScope.loggedinUserInfo.id.toString()) {
            $rootScope.loggedinUserInfo.karma = $rootScope.loggedinUserInfo.karma + ($scope.investment.currentScore * $scope.sharesToSell);
            $scope.investment.numberShares -= $scope.sharesToSell;
          }
          console.log("You successfully sold shares.");
        }
      }
    }

    //<h3>$scope.exit</h3>

    //Exit exits out of the Sell modal. This is used for the ng-click event to exit the modal controller.
    $scope.exit = function () {
      $mdDialog.hide();
    }

    //<h3>$scope.wait</h3>

    //Wait will sell shares equivalent to amount currently available and place the rest of the shares in
    //the transaction queue as a sell request.
    $scope.wait = function () {
      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.requestedShares,
      };
      //User cannot sell more shares than they has or more shares than the amount of their shares not in the transaction queue
      if ($scope.sharesToSell > $scope.investment.numberShares - $scope.numSharesInTransactionQueueByUser) {
        $scope.errorMessage = true;
      } else {
        //Sells number of shares equal to the amount requested and places the rest in the transaction queue
        $scope.errorMessage = false;
        TransactionHist.makeTransaction(transaction).then(function() {
          transaction.numberShares = $scope.sharesToSell - $scope.requestedShares;
          TransactionHist.addTransactionToQueue(transaction);
        });
        Scores.updateSocialInvestment($scope.investment.target_id);
        //Logic to handle whether a user is selling shares to himself. This prevents any changing of the users scores
        if ($scope.requestedSharesInfo && $scope.requestedSharesInfo.user_id !== $rootScope.loggedinUserInfo.id.toString()) {
          $rootScope.loggedinUserInfo.karma += $scope.investment.currentScore * ($scope.requestedShares)
          $scope.investment.numberShares -= $scope.requestedShares;
        }
      }
      $mdDialog.hide();
      $location.path('/portfolio/' + $rootScope.loggedinUserInfo.id)
    }

    //<h3>$scope.sellDirect</h3>

    //sellDirect will sell shares directly to Karma Exchange at 90% market value.
    $scope.sellDirect = function () {
      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.requestedShares,
      }
      var newScore = $scope.investment.currentScore * 0.9;
      //User cannot sell more shares than they has or more shares than the amount of their shares not in the transaction queue
      if ($scope.sharesToSell > $scope.investment.numberShares - $scope.numSharesInTransactionQueueByUser) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        if ($scope.requestedShares) {
          //If there are requested shares in the transaction queue, make a transaction of just the requested shares.
          TransactionHist.makeTransaction(transaction).then(function() {
            transaction.numberShares = $scope.sharesToSell - $scope.requestedShares;
            //Update the transaction to include only the shares that will be bought directly and provide a newScore at which to buy the shares.
            TransactionHist.closeTransactionRequest(transaction, newScore);
          })
        } else {
          transaction.numberShares = $scope.sharesToSell;
          TransactionHist.closeTransactionRequest(transaction, newScore);
        }
        Scores.updateSocialInvestment($scope.investment.target_id);
        //Updates the karma and the number of shares the user owns on the front-end.
        if ($scope.requestedSharesInfo && $scope.requestedSharesInfo.user_id !== $rootScope.loggedinUserInfo.id.toString()) {
          $scope.investment.numberShares -=$scope.sharesToSell;
          $rootScope.loggedinUserInfo.karma += Math.round($scope.investment.currentScore * $scope.requestedShares + newScore * ($scope.sharesToSell - $scope.requestedShares));
        } else {
          $scope.investment.numberShares -= $scope.sharesToSell - $scope.requestedShares;
          $rootScope.loggedinUserInfo.karma += Math.round(newScore * ($scope.sharesToSell - $scope.requestedShares));
        }
        $mdDialog.hide();
        $location.path('/portfolio/' + $rootScope.loggedinUserInfo.id);
      }
    }

    //<h3>$scope.checkSharesReq</h3>

    //Checks the transaction queue for the amount of shares a user has placed there of a particular user. It also returns a
    //user object for the user selling the shares.
    $scope.checkSharesReq = function() {
      TransactionHist.checkSharesAvail($scope.investment.target_id, 'buy').then(function(response){
        $scope.requestedShares = response[0];
        $scope.requestedSharesInfo = response[1][0];
      });
    }
  }
})
