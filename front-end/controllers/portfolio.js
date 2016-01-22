angular.module('app.portfolio', [])

.controller('PortfolioController', function($scope, $location) {
  $scope.test = "hello testing portfolio";

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});