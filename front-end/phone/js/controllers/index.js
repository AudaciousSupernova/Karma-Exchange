angular.module('app.index', [])

.controller('IndexController', function($scope, $rootScope, $location, $http, Newsfeed, Root, Auth, User) {

  $scope.currentUserInfo = false;
  $scope.searchResults;
  $scope.search = {};
  $scope.search.input = false;

  $scope.viewProfile = function () {
    $location.path('/profile/' + $scope.currentUserInfo.id);
  }

  $scope.cancelSearch = function(){
    $scope.search.input = false;
    $scope.searchResults = undefined;
    $scope.search.searchQuery = "";
  }

  $scope.navigateTo = function(user){
    $location.path("/profile/" + user.id)
    $scope.cancelSearch();
  }

  $scope.viewPortfolio = function () {
    $location.path('/portfolio/' + $scope.currentUserInfo.id);
  }

  $scope.getLeaders = function () {
    User.getLeaderData().then(function(result) {
      $scope.userOne = result[0].name;
      $scope.userTwo = result[1].name; 
    });
  }

  $scope.findUsersByPartial = function(){
    if($scope.search.searchQuery.length){
      User.getUserByPartial($scope.search.searchQuery)
      .then(function(response){
        $scope.searchResults = response;
      })    
    } else {
      $scope.searchResults = [];
    }
  }

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      Root.addUserInfo($rootScope.user);
      $scope.currentUserInfo = Root.currentUserInfo.data;
    }
  })



  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});
