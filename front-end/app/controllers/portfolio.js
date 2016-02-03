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
      $scope.getInvestments($scope.loggedinUserInfo.id);
      $scope.getTransactionHist();
      $scope.addLabels(30)
    }
  })

  $scope.getInvestments = function(id) {
    Portfolio.getInvestments(id)
    .then(function(results) {
      $scope.investments = results;
    })
  }

  $scope.getScores = function(target_id, obj){
    obj.data = [[]]
    obj.series = obj.name
    Scores.getScores(target_id)
    .then(function(scoresHist){
      for(var i = 0; i < scoresHist.length; i++){
        obj.data[0].push(scoresHist[i].currentScore)
      }
      obj.currentScore = obj.data[0][obj.data[0].length - 1]
    })
  }


  $scope.addLabels = function(daysInPast){
    for(; daysInPast >= 0; daysInPast--){
      if(daysInPast % 5 === 0){
        $scope.labels.push(daysInPast)
      } else {
        $scope.labels.push("")
      }
    }
  }


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

  
  $scope.getTransactionHist = function() {
    TransactionHist.getTransactions($scope.loggedinUserInfo.id)
    .then(function(results) {
      $scope.transactions = results.reverse();
    })
  } 

  $scope.buildHistString = function(transaction){
    var type = transaction.type === "buy"? ' bought ' : ' sold ';
    var deltaKarma = transaction.type === "buy"? ' sharing ' : ' earning ';
    transaction.string = "You" + type + transaction.numberShares + " shares of " + transaction.target_name + deltaKarma + Math.abs(transaction.karma) + " karma."

  }

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

