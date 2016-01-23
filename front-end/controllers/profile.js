angular.module('app.profile', [])

.controller('ProfileController', function($scope, $location, Profile) {
	//<h3>checks wheter this is the logged in user</h3>
	$scope.isUser = true
  $scope.user;
  $scope.leaders;

  $scope.getUserData = function() {
    //grab user id
    //pass user id to service function
    Profile.getUser()
      .then(function(data) {
        $scope.user = data;
      })
  }

  $scope.getLeaders = function() {
    Profile.getLeaderData()
      .then(function(data) {
        $scope.leaders = data;
      })
  }

  $scope.getUserData();
  $scope.getLeaders();

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});