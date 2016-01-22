angular.module('app.newsfeed', [])

.controller('NewsfeedController', function($scope, $location) {
  $scope.test = "hello testing newsfeed";

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});