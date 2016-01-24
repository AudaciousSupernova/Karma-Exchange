angular.module('app.index', [])

.controller('IndexController', function($scope, $location, Newsfeed) {
  $scope.testing = 'hello testing';

  $scope.test = function() {
    console.log("I am definitely getting access to this page!");
  };

  $scope.test();

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});