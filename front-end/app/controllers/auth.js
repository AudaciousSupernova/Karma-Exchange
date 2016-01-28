angular.module('app.auth', [])

.controller('AuthController', function($scope, $location) {
  $scope.test = "hello testing auth";

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});