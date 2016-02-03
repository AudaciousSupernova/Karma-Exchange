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
        console.log(clickedItem, "this was clicked");
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
// hist
// id: 1729
// karma: 4576
// numberShares: 44
// target_id: 64
// target_name: "Rosie Bergnaum"
// type: "sell"
// user_id: 1
  $scope.addProfit = function(investment){
    var shares = investment.numberShares
    var profit = 0;

    for(var i = 0; i < $scope.transactions.length; i++){
      var transaction = $scope.transactions[i];

      if(investment.target_id === transaction.target_id) {

        if(shares - transaction.numberShares > 0){
          console.log(transaction.numberShares, investment.currentScore, transaction.karma)
          var profit = transaction.numberShares * investment.currentScore - transaction.karma
          profit += profit        
          shares -= transaction.numberShares
          // <= 0 
        } else {
          var transactionScore = Math.round(transaction.karma / transaction.numberShares)
          var profit = shares * investment.currentScore - shares * transactionScore
          console.log("else profit", profit)
          investment.profit = profit;
        }
      }
    }
  }
// currentScore: 45
// data: Array[1]
// id: 3220
// name: "Clemens Rohan"
// numberShares: 64
// series: "Clemens Rohan"
// target_id: 85
// user_id: 1

  function SellModalController($scope, $mdDialog, investment, loggedinUserInfo, TransactionHist, Scores, User) {


    $scope.investment = investment;
    $scope.loggedinUserInfo = loggedinUserInfo
    $scope.sharesToSell;
    $scope.scores;
    $scope.targetCurrentScore;

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
      if ($scope.sharesToSell > $scope.investment.numberShares) {
        console.log("You are trying to sell more than you have!");
        $mdDialog.hide();
      } else {
        $scope.getUserById()

        //grab the target_id
        //get scores by target_id
          //all the scores
          //current score
          //current score * sharesTosell = karma to add
      }
    }

    $scope.exit = function() {
      $mdDialog.hide();
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

