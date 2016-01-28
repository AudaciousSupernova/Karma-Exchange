angular.module('app.buy', [])

.controller('BuyController', function($scope, $location) {
  $scope.test = "hello testing buy";

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});