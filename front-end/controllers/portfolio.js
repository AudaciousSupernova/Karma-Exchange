angular.module('app.portfolio', [])

.controller('PortfolioController', function($scope, $location, $mdDialog, Portfolio) {
  $scope.investments; 

  $scope.something = "Hello Testing!";

  $scope.getInvestments = function() {
    //grab user id
    Portfolio.getInvestments()
      .then(function(results) {
        console.log('I made it back!');
        $scope.investments = results.data;
      })
  }

  $scope.getInvestments();

  $scope.test = function(name, shares, buyingPrice, profit) {
    $mdDialog.show({
      templateUrl: '../views/sell.html',
      locals: {
        name: name, 
        shares: shares, 
        buyingPrice: buyingPrice, 
        profit: profit
      },
      controller: NewController
    })
      .then(function(clickedItem) {
        console.log(clickedItem, "this was clicked");
      })
  }

  function NewController($scope, $mdDialog, name, shares, buyingPrice, profit) {

    $scope.investment = {
      name: name, 
      shares: shares, 
      buyingPrice: buyingPrice, 
      profit: profit
    };

    $scope.hide = function() {
      $mdDialog.hide()
    }
  }


  

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

