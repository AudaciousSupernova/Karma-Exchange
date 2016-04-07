angular.module('app.portfolio', ["chart.js"])

  //<h3> Portfolio Controller </h3>
.controller('PortfolioController', function($scope, $location, Portfolio, Auth, Root, $rootScope, $ionicModal, Scores, TransactionHist, User) {

  $scope.currentUserInfo = $rootScope.user;

  Root.stateChangeListener(function(){
    var currentPath = $location.path();
    currentPath = currentPath.split("/");
    if(currentPath[1] === "portfolio" && currentPath[2] !== $scope.currentUserInfo.id){
    $location.path("/portfolio/" + $scope.currentUserInfo.id)
    }
  })

  $scope.investments;
  //Save the user id, included in the location path
  //call getInvestments, pass the userId on the function call
  $scope.labels = [];
  $scope.transactions = []
  $scope.openTransactions = [];
  $scope.currentInvestmentsView = true;
  $scope.openTransactionsView = false;
  $scope.transactionHistoryView = false;

  //sell modal variables
  $scope.investment;
  $scope.requestedShares;
  $scope.requestedSharesInfo;
  $scope.scores;
  $scope.targetCurrentScore;
  $scope.numSharesInTransactionQueueByUser;
  $scope.sellModal = {};
  $scope.sellModal.revealOptions = false;
  $scope.sellModal.errorMessage = false;

  //getUserById grabs the logged in user's portfolio information
  $scope.getUserById = function(id) {
    User.getUser(id)
    .then(function(user) {
      $scope.loggedinUserInfo = user[0];
    })
  }

//gets all current investments for the user
//properties on an investment object
// currentScore: 45
// data: Array[1]
// id: 3220
// name: "Clemens Rohan"
// numberShares: 64
// series: "Clemens Rohan"
// target_id: 85
// user_id: 1
  $scope.getInvestments = function(id) {
    Portfolio.getInvestments(id)
    .then(function(results) {
      $scope.investments = results;
    })
  }

//<h3>Investment graph functions</h3>
//uses the investment objects to calculate the score history of the investment so that the graph can be representative
  $scope.getScores = function(target_id, obj){
    obj.data = [[]]
    obj.series = obj.name
    Scores.getScores(target_id)
    .then(function(scoresHist){
      for(var i = 0; i < scoresHist.length; i++){
        obj.data[0].push(scoresHist[i].currentScore)
      }
      var daysBeforeUserJoined = $scope.labels.length - obj.data[0].length
      for(var i = 0; i < daysBeforeUserJoined; i++){
        obj.data[0].unshift(0)
      }
      // obj.currentScore = obj.data[0][obj.data[0].length - 1]
      User.getUser(target_id)
        .then(function(user) {
          obj.currentScore = user[0].currentScore;
          $scope.addProfit(obj)
        })
    })
  }

//gets the transaction history for the current user
//sample properties on a transaction object
// id: 1729
// karma: 4576
// numberShares: 44
// target_id: 64
// target_name: "Rosie Bergnaum"
// type: "sell"
// user_id: 1
  $scope.getTransactionHist = function() {
    TransactionHist.getTransactions($rootScope.user.id)
    .then(function(results) {
      $scope.transactions = results.reverse();
      $scope.getInvestments($rootScope.user.id);
    })
  }

//gets all open user transactions for the logged in user.
//sample properties on an open transaction
  $scope.getOpenUserTransactions = function(){
    var user_id = $rootScope.user.id
    //using a hash table to keep track of the openTransaction index of the user in question because of the asynch call below
    var hashedTransactions = {};
    TransactionHist.getOpenUserTransactions(user_id)
    .then(function(openTransactions){
      for(var i = 0; i < openTransactions.length; i++){
        var target_id = openTransactions[i].target_id
        if(hashedTransactions[target_id]){
          hashedTransactions[target_id].push(openTransactions[i])
        } else {
          hashedTransactions[target_id] = [openTransactions[i]]
        }
        User.getUser(openTransactions[i].target_id)
        .then(function (userInfo) {
          userInfo = userInfo[0]
          var openTransactionForTarget = hashedTransactions[userInfo.id]
          for(var subI = 0; subI < openTransactionForTarget.length; subI++){
            var openTransaction = openTransactionForTarget[subI]
            openTransaction.target_name = userInfo.name
            openTransaction.currentScore = userInfo.currentScore
          }
        })
      }
      $scope.openTransactions = openTransactions;
    })
  }
//generates lables for the graph. Initially to 30 days in the past however that can be modified in the future
  $scope.addLabels = function(daysInPast){
    for(; daysInPast >= 0; daysInPast--){
      if(daysInPast % 5 === 0){
        $scope.labels.push(daysInPast)
      } else {
        $scope.labels.push("")
      }
    }
  }

//Cancels an open transaction, removing it from the queue
  $scope.clickCancel = function(transactionId, index){
    TransactionHist.deleteOpenTransaction(transactionId).then(function(response){
      if(response.status === 204){
        $scope.openTransactions.splice(index,1)
      }
    })
  }

//turns a transaction into a human friendly string
  $scope.buildHistString = function(transaction){
    var type = transaction.type === "buy"? ' bought ' : ' sold ';
    var deltaKarma = transaction.type === "buy"? ' sharing ' : ' earning ';
    transaction.string = "You" + type + transaction.numberShares + " shares of " + transaction.target_name + deltaKarma + Math.abs(transaction.karma) + " karma."
  }
//searches through the investment history to get the profit for each set of shares this should probably eventually be moved to the back end unless we always want to grab the entire transaction history for a user. It could be added by making a controller that searched through transaction hist by user_id and target_id to help refine the search then using that to add a profit to the object whenever a user makes a get request for their current stocks.

  $scope.addProfit = function(investment){
    var shares = investment.numberShares
    var profit = 0;

    for(var i = 0; i < $scope.transactions.length; i++){
      var transaction = $scope.transactions[i];

      if(investment.target_id === transaction.target_id) {

        if(shares - transaction.numberShares > 0){
          profit += (transaction.numberShares * investment.currentScore - transaction.karma)
          shares -= transaction.numberShares
          investment.profit = profit;
          // <= 0
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

  //toggleViews switches to different views within the portfolio view
  $scope.toggleViews = function(viewToShow){
    if(viewToShow === "transactionHistory"){
      $scope.transactionHistoryView = true;
      $scope.currentInvestmentsView = false;
      $scope.openTransactionsView = false;
    } else if (viewToShow === "currentInvestments"){
      $scope.currentInvestmentsView = true;
      $scope.transactionHistoryView = false;
      $scope.openTransactionsView = false;
    } else {
      $scope.openTransactionsView = true;
      $scope.currentInvestmentsView = false;
      $scope.transactionHistoryView = false;
    }
  }

  $scope.toggleOpenTransactions = function(){
    $scope.getOpenUserTransactions()
    $scope.toggleViews('openTransactions')
  }

 $ionicModal.fromTemplateUrl('/js/views/sell.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(sellModal) {
    $scope.sellModal = sellModal;
  });
  $scope.openSellModal = function() {
    $scope.sellModal.show();
  };
  $scope.closeSellModal = function() {
    $scope.sellModal.hide();
    $scope.sellModal.revealOptions = false;
  };
  //Cleanup the sellModal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.sellModal.remove();
  });
  // Execute action on hide sellModal
  $scope.$on('sellModal.hidden', function() {
    // Execute action
  });
  // Execute action on remove sellModal
  $scope.$on('sellModal.removed', function() {
    // Execute action
  });

//clickSell opens the Sell Modal
  $scope.clickSell = function(investment) {
    $scope.investment = investment;
    $scope.openSellModal();
    $scope.checkSharesReq()
  }

    $scope.getUsersOpenSellTransactionsForTarget = function () {
      $scope.numSharesInTransactionQueueByUser = 0;
      TransactionHist.getOpenUserSellTransactionsForTarget($scope.investment.user_id, $scope.investment.target_id)
        .then(function (response) {
          for (var i = 0; i < response.length; i++) {
            $scope.numSharesInTransactionQueueByUser += response[i].numberShares;
          }
        })
    }

   //Confirm checks to see if logged in user can sell x number of shares
    $scope.confirm = function() {
      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.sellModal.sharesToSell,
        // // what even is this karma?
        // karma: $scope.sellModal.sharesToSell * $scope.investment.currentScore
      }

      if ($scope.sellModal.sharesToSell > $scope.investment.numberShares - $scope.numSharesInTransactionQueueByUser) {
        $scope.sellModal.errorMessage = true;
      } else {
        $scope.sellModal.errorMessage = false;
        if ($scope.sellModal.sharesToSell > $scope.requestedShares) {
          $scope.sellModal.revealOptions = true;
          console.log("There are not enough matching buy requests to match your request to sell.")
        } else {
          TransactionHist.makeTransaction(transaction)
            .then(function () {
              $scope.closeSellModal();
              $location.path('/portfolio/'+$rootScope.user.id);
            })
          if ($scope.requestedSharesInfo && $scope.requestedSharesInfo.user_id !== $rootScope.user.id.toString()){
            $rootScope.user.karma = $rootScope.user.karma + ($scope.investment.currentScore * $scope.sellModal.sharesToSell);
            $scope.investment.numberShares -= $scope.sellModal.sharesToSell;
          }
        }
      }
    }

    //Wait will add the sell transaction to the transaction queue
    $scope.wait = function () {
      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.requestedShares,
        //reference logged in user's karma
      };
      if ($scope.sellModal.sharesToSell > $scope.investment.numberShares - $scope.numSharesInTransactionQueueByUser) {
        $scope.sellModal.errorMessage = true;
      } else {
        $scope.sellModal.errorMessage = false;
        TransactionHist.makeTransaction(transaction).then(function() {
          transaction.numberShares = $scope.sellModal.sharesToSell - $scope.requestedShares;
          TransactionHist.addTransactionToQueue(transaction);
        });
        Scores.updateSocialInvestment($scope.investment.target_id);
        if ($scope.requestedSharesInfo && $scope.requestedSharesInfo.user_id !== $rootScope.user.id.toString()) {
          $rootScope.user.karma += $scope.investment.currentScore * ($scope.requestedShares)
          $scope.investment.numberShares -= $scope.requestedShares;
        }
      }
      $scope.closeSellModal();
      $location.path('/portfolio/' + $rootScope.user.id)
    }


    //sellDirect will sell shares directly to the Karma Exchange.
    $scope.sellDirect = function () {
      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.requestedShares,
      }
      var newScore = $scope.investment.currentScore * 0.9;
      if ($scope.sellModal.sharesToSell > $scope.investment.numberShares - $scope.numSharesInTransactionQueueByUser) {
        $scope.sellModal.errorMessage = true;
      } else {
        $scope.sellModal.errorMessage = false;
        if ($scope.requestedShares) {
          TransactionHist.makeTransaction(transaction).then(function() {
            transaction.numberShares = $scope.sellModal.sharesToSell - $scope.requestedShares;
            TransactionHist.closeTransactionRequest(transaction, newScore);
          })
          // Scores.updateSocialInvestment($scope.investment.id);
        } else {
          transaction.numberShares = $scope.sellModal.sharesToSell;
          TransactionHist.closeTransactionRequest(transaction, newScore);
        }
        // transaction.karma = $scope.investment.currentScore * $scope.requestedShares + newScore * ($scope.sellModal.sharesToSell - $scope.requestedShares);
        Scores.updateSocialInvestment($scope.investment.target_id);
        if ($scope.requestedSharesInfo && $scope.requestedSharesInfo.user_id !== $rootScope.user.id.toString()) {
          $scope.investment.numberShares -=$scope.sellModal.sharesToSell;
          $rootScope.user.karma += Math.round($scope.investment.currentScore * $scope.requestedShares + newScore * ($scope.sellModal.sharesToSell - $scope.requestedShares));
        } else {
          $scope.investment.numberShares -= $scope.sellModal.sharesToSell - $scope.requestedShares;
          $rootScope.user.karma += Math.round(newScore * ($scope.sellModal.sharesToSell - $scope.requestedShares))
        }

        $scope.closeSellModal();
        $location.path('/portfolio/' + $rootScope.user.id);
      }
    }

    $scope.checkSharesReq = function() {
      TransactionHist.checkSharesAvail($scope.investment.target_id, 'buy').then(function(response){
        $scope.requestedShares = response[0];
        $scope.requestedSharesInfo = response[1][0];
      });
    }
  
  $scope.getTransactionHist();
  $scope.addLabels(30)
})
