angular.module('app.portfolio', ["chart.js"])

  //<h3> Portfolio Controller </h3>
.controller('PortfolioController', function($scope, $location, $mdDialog, Portfolio, Auth, Root, Scores, TransactionHist) {
  $scope.investments;
  $scope.clickedInvestment;
  $scope.loggedinUserInfo;
  //Save the user id, included in the location path
  $scope.currentUserInfo = "invalid";
  //call getInvestments, pass the userId on the function call
  $scope.labels = [];
  $scope.transactions = []

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
// $$hashKey: "object:37"
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
      console.log("here i am", $scope.investments); 
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
          var transactionScore = Math.round(transaction.karma / transaction.numberShares)
          profit += (shares * investment.currentScore - shares * transactionScore)
          shares = 0
          investment.profit = profit;
          break;
        }
      }
    }
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
        console.log('investment', investment); 
        console.log("You are trying to sell more than you have!");
        $mdDialog.hide();

      } else {

        if ($scope.sharesToSell > $scope.requestedShares) {
          console.log($scope.sharesToSell,'sharesToSell')
          console.log($scope.requestedShares,'requestedShares');
          $scope.revealOptions = true;
          console.log("THERE ARE NOT ENOUGH SHARES REQUESTED ON THE MARKET")

        } else {

          $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma + ($scope.investment.currentScore * $scope.sharesToSell);
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
        numberShares: $scope.sharesToSell,
        //reference logged in user's karma
        karma: $scope.sharesToSell * $scope.investment.currentScore
      };

      TransactionHist.makeTransaction(transaction).then(function() {
        transaction.numberShares = $scope.sharesToSell - transaction.numberShares;
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
//   .controller("LineCtrl", ['$scope', '$timeout', function ($scope, $timeout) {

//   $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
//   $scope.series = ['Series A', 'Series B'];
//   $scope.data = [
//     [65, 59, 80, 81, 56, 55, 40],
//     [28, 48, 40, 19, 86, 27, 90]
//   ];
//   $scope.onClick = function (points, evt) {
//     console.log(points, evt);
//   };

//   // Simulate async data update
//   $timeout(function () {
//     $scope.data = [
//       [28, 48, 40, 19, 86, 27, 90],
//       [65, 59, 80, 81, 56, 55, 40]
//     ];
//   }, 3000);
// }]);




  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
})

// function DialogController($scope, $mdDialog) {
//   $scope.hide = function() {
//     $mdDialog.hide();
//   };
//   $scope.cancel = function() {
//     $mdDialog.cancel();
//   };
//   $scope.answer = function(answer) {
//     $mdDialog.hide(answer);
//   };
// }

