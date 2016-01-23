angular.module('app.profile', [])

.controller('ProfileController', function($scope, $location, Profile) {
<<<<<<< HEAD
	//<h3>checks wheter this is the logged in user</h3>
	$scope.isUser = true;
  $scope.user;
  $scope.leaders;


  //This function should be called on load of the profile view

  /*

    When a user clicks on "Profile", pass the logged-in user's id to the new route: /profile/:id
    in this controller file, save the id as user id
    get UserData by passing the id

    If a user types in a name in the search bar, then before routing to /profile/:id, first get the id associated with the selected name. 

    This function will be called on the main controller to grab user information by name. 
    The response will include the user id. 

    Now route to /profile/:id, save the id as user id, and get UserData

    //only call getLeaders if user id matches logged-in user's id


  */

  $scope.getUserData = function() {

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