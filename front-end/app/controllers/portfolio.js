angular.module('app.portfolio', [])

  //<h3> Portfolio Controller </h3>
.controller('PortfolioController', function($scope, $location, $mdDialog, Portfolio, Auth, Root) {
  $scope.investments;
  $scope.clickedInvestment;
  $scope.loggedinUserInfo;
  //Save the user id, included in the location path
  $scope.currentUserInfo = "invalid";
  //call getInvestments, pass the userId on the function call

  $scope.getInvestments = function(id) {
    Portfolio.getInvestments(id)
      .then(function(results) {
        // console.log("I have successfully received current user investments.")
        $scope.investments = results;
        console.log("and i'm finally here", $scope.investments);
      })
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

  function SellModalController($scope, $mdDialog, investment, loggedinUserInfo, TransactionHist, Scores) {


    $scope.investment = investment;
    $scope.loggedinUserInfo = loggedinUserInfo
    $scope.sharesToSell;
    $scope.scores;
    $scope.targetCurrentScore;
    console.log("this is the investment", $scope.investment)
    // console.log("this is shares to sell", $scope.sharesToSell);

  $scope.getScores = function () {
    // console.log("what does my user contain", $scope.investment.target_id);
    Scores.getScores($scope.investment.target_id)
      .then(function (results) {
        // console.log('I AM HERE');
        // console.log(results, "Scores from Score factory");
        if (results.length === 0) {
          $scope.scores = [];
        } else {
          $scope.scores = results;
          // console.log("what exactly is scope.scores?", $scope.scores);
          $scope.targetCurrentScore = $scope.scores[0].social.total;
          // console.log("do we have it here?", $scope.targetCurrentScore)
          var transaction = {
            user_id: $scope.investment.user_id,
            target_id: $scope.investment.target_id,
            type: "sell",
            numberShares: $scope.sharesToSell,
            karma: $scope.sharesToSell * $scope.targetCurrentScore//reference logged in user's karma
          }

        // console.log("WHAT IS MY CURRENT SCORE", $scope.targetCurrentScore);
        // console.log($scope.scores, 'scores in the sell controller');
          // console.log("is the current score being saved", $scope.targetCurrentScore)
          $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma + $scope.sharesToSell * $scope.targetCurrentScore;
          TransactionHist.addTransaction(transaction)
            .then(function(results) {
              investment.numberShares = investment.numberShares - $scope.sharesToSell;
              $mdDialog.hide();

            })
        }

      })
  }

    $scope.confirm = function() {
      if ($scope.sharesToSell > $scope.investment.numberShares) {
        console.log("You are trying to sell more than you have!");
        $mdDialog.hide();
      } else {
        $scope.getScores()

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

    Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      $scope.loggedinUserInfo = Root.currentUserInfo.data;
      // console.log("Is the id correct", $scope.loggedinUserInfo);
      $scope.getInvestments($scope.loggedinUserInfo.id);

    }
  })




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

