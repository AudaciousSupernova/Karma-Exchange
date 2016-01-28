angular.module('app.portfolio', [])

  //<h3> Portfolio Controller </h3>
.controller('PortfolioController', function($scope, $location, $mdDialog, Portfolio, Auth, Root) {
  $scope.investments; 
  //Save the user id, included in the location path
  $scope.currentUserInfo = "invalid";
  //call getInvestments, pass the userId on the function call

  $scope.getInvestments = function(id) {
    Portfolio.getInvestments(id)
      .then(function(results) {
        console.log("I have successfully received current user investments.")
        $scope.investments = results;
        console.log("and i'm finally here", $scope.investments);
      })
  }


  $scope.clickSell = function(investment) {
    $mdDialog.show({
      templateUrl: '../views/sell.html',
      locals: {
        investment: investment
      },
      controller: SellModalController
    })
      .then(function(clickedItem) {
        console.log(clickedItem, "this was clicked");
      })
  }

  function SellModalController($scope, $mdDialog, investment, TransactionHist) {

    $scope.investment = investment;
    $scope.sharesToSell;
    console.log("this is the investment", $scope.investment)
    console.log("this is shares to sell", $scope.sharesToSell);

    $scope.confirm = function() {
      if ($scope.sharesToSell > $scope.investment.numberShares) {
        console.log("You are trying to sell more than you have!");
        $mdDialog.hide();
      } else {
        var transaction = {
          user_id: $scope.investment.user_id, 
          target_id: $scope.investment.target_id, 
          type: "sell", 
          numberShares: $scope.sharesToSell, 
          karma: 90
        }
        console.log("transaction", transaction);
        TransactionHist.addTransaction(transaction)
          .then(function(results) {
            $mdDialog.hide();
          })        
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
      console.log("Is the id correct", $scope.loggedinUserInfo);
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

