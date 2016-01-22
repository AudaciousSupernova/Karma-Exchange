angular.module('app.profile', [])

.controller('ProfileController', function($scope, $location) {
  $scope.test = "hello testing";

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});