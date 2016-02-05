angular.module('app.portfolio', ["chart.js"])

  //<h3> Portfolio Controller </h3>
.controller('PortfolioController', function($scope, $location, $mdDialog, Portfolio, Auth, Root, Scores, TransactionHist, User) {
  $scope.investments;
  $scope.clickedInvestment;
  $scope.loggedinUserInfo;
  //Save the user id, included in the location path
  $scope.currentUserInfo = "invalid";
  //call getInvestments, pass the userId on the function call
  $scope.labels = [];
  $scope.transactions = []
  $scope.openTransactions = [];
  $scope.currentInvestmentsView = true;
  $scope.openTransactionsView = false;
  $scope.transactionHistoryView = false;

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      $scope.loggedinUserInfo = Root.currentUserInfo.data;
      // console.log("Is the id correct", $scope.loggedinUserInfo);
      $scope.getTransactionHist(function(){
        $scope.getInvestments($scope.loggedinUserInfo.id);
      });
      $scope.addLabels(30)
    }
  })


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
      obj.currentScore = obj.data[0][obj.data[0].length - 1]
      $scope.addProfit(obj)
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
  $scope.getTransactionHist = function(callback) {
    TransactionHist.getTransactions($scope.loggedinUserInfo.id)
    .then(function(results) {
      $scope.transactions = results.reverse();
      callback()
    })
  }
//gets all open user transactions for the logged in user.
//sample properties on an open transaction
  $scope.getOpenUserTransactions = function(){
    var user_id = $scope.loggedinUserInfo.id
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

//controls opening the sell menue to sell current stocks
  $scope.clickSell = function(investment) {
    $scope.clickedInvestment = investment.id;
    $mdDialog.show({
      templateUrl: '../app/views/sell.html',
      locals: {
        investment: investment,
        loggedinUserInfo: $scope.loggedinUserInfo
      },
      controller: SellModalController
    })
      .then(function(clickedItem) {
        // console.log(clickedItem, "this was clicked");
      })
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

  function SellModalController($scope, $mdDialog, investment, loggedinUserInfo, TransactionHist, Scores, User) {


    $scope.investment = investment;
    $scope.requestedShares;
    $scope.loggedinUserInfo = loggedinUserInfo
    $scope.sharesToSell;
    $scope.scores;
    $scope.targetCurrentScore;
    $scope.revealOptions=false;

  $scope.getUserById = function () {
    User.getUser($scope.investment.target_id)
      .then(function (results) {

        var transaction = {
          user_id: $scope.investment.user_id,
          target_id: $scope.investment.target_id,
          type: "sell",
          numberShares: $scope.sharesToSell,
          karma: $scope.sharesToSell * results[0].currentScore//reference logged in user's karma
        }

        $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma + $scope.sharesToSell * results[0].currentScore;
        TransactionHist.addTransaction(transaction)
          .then(function(results) {
            investment.numberShares = investment.numberShares - $scope.sharesToSell;
            $mdDialog.hide();

          })
      })
  }

    $scope.confirm = function() {

      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.sharesToSell,
        karma: $scope.sharesToSell * $scope.investment.currentScore//reference logged in user's karma
      }

      if ($scope.sharesToSell > $scope.investment.numberShares) {
        console.log("You are trying to sell more than you have!");
        $mdDialog.hide();

      } else {

        if ($scope.sharesToSell > $scope.requestedShares) {
          $scope.revealOptions = true;
          console.log("THERE ARE NOT ENOUGH SHARES REQUESTED ON THE MARKET")

        } else {

          $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma + ($scope.investment.currentScore * $scope.sharesToSell);
          console.log("what is shares to sell", $scope.sharesToSell);
          $scope.investment.numberShares -= $scope.sharesToSell;
          TransactionHist.makeTransaction(transaction)
            .then(function () {
              $mdDialog.hide();
            })
          console.log("YOU SOLD SHARES")
        }
      }
    }

    $scope.exit = function () {
      $mdDialog.hide();
    }

    $scope.wait = function () {

      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.requestedShares,
        //reference logged in user's karma
        karma: $scope.sharesToSell * $scope.investment.currentScore
      };

      TransactionHist.makeTransaction(transaction).then(function() {
        transaction.numberShares = $scope.sharesToSell - transaction.numberShares;
        delete transaction.karma;
        TransactionHist.addTransactionToQueue(transaction);
      });
      $mdDialog.hide();
    }

    $scope.sellDirect = function () {
      var transaction = {
        user_id: $scope.investment.user_id,
        target_id: $scope.investment.target_id,
        type: "sell",
        numberShares: $scope.requestedShares,
        karma: $scope.sharesToSell * $scope.investment.currentScore//reference logged in user's karma
      }
      console.log($scope.investment.currentScore);
      var newScore = Math.round($scope.investment.currentScore * 0.9);

      if ($scope.requestedShares) {
        TransactionHist.makeTransaction(transaction).then(function() {
          transaction.numberShares = $scope.sharesToSell - $scope.requestedShares; 
          TransactionHist.closeTransactionRequest(transaction, newScore);
        })

      } else {
        transaction.numberShares = $scope.sharesToSell;
        TransactionHist.closeTransactionRequest(transaction, newScore); 
      }
      $scope.karma += $scope.investment.currentScore * $scope.requestedShares + newScore * ($scope.sharesToSell - $scope.requestedShares);

      $mdDialog.hide(); 
    }


    $scope.checkSharesReq = function() {
      TransactionHist.checkSharesAvail($scope.investment.target_id, 'buy').then(function(response){
        console.log(response);
        $scope.requestedShares = response;
      });
    }
  }

})
