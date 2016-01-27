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
        $scope.investments = results.data;
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

  function SellModalController($scope, $mdDialog, investment) {

    $scope.investment = investment;

    $scope.hide = function() {
      $mdDialog.hide()
    }
  }

    Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      $scope.currentUserInfo = Root.currentUserInfo;
      $scope.getInvestments($scope.currentUserInfo.id); 
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

