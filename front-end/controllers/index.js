angular.module('app.index', [])

.controller('IndexController', function($scope, $rootScope, $location, Newsfeed, Root, Auth) {

  $scope.currentUserInfo = "invalid";
  $scope.viewHome = function() {
    $location.path('/newsfeed');
  }
  $scope.viewProfile = function() {
    $location.path('/profile/' + $scope.currentUserInfo.id);
  }

  $scope.viewPortfolio = function() {
    $location.path('/portfolio/' + $scope.currentUserInfo.id);
  }

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      Root.addUserInfo($rootScope.user);
      $scope.currentUserInfo = Root.currentUserInfo.data;
      console.log("check it out", $scope.currentUserInfo);
    }
  })







  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});
