angular.module('app.portfolio', [])

.controller('PortfolioController', function($scope, $location, Portfolio) {
  $scope.investments; 

  $scope.getInvestments = function() {
    //grab user id
    Portfolio.getInvestments()
      .then(function(results) {
        console.log('I made it back!');
        $scope.investments = results.data;
      })
  }

  $scope.getInvestments();

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});