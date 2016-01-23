angular.module('app.profile', [])

.controller('ProfileController', function($scope, $location) {
  $scope.name = 'Neeraj Kohirkar';
  $scope.leaders;

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});