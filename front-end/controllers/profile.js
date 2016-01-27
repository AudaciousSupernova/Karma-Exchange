angular.module('app.profile', [])

	//<h3>Profile Controller</h3>

.controller('ProfileController', function($scope, $location, User, Auth, Root) {

  $scope.isUser = true;
  $scope.user;
  $scope.leaders;
  $scope.currentUserInfo = "invalid";

  //Save the user id, included in the location path

  //Pass this userId to $scope.getUserData in order to get all data associated with user

  //if the userId matches the logged in user, then also call getLeaders 
  //if not, then display only the profile's general information 

  /*
    When a user clicks on "Profile", pass the logged-in user's id to the new route: /profile/:id
    in this controller file, save the id as user id
    get UserData by passing the id

    If a user types in a name in the search bar, then before routing to /profile/:id, first get the id associated with the selected name. 

    This function will be called on the main controller to grab user information by name. 
    The response will include the user id. 

    Now route to /profile/:id, save the id as user id, and get UserData

    only call getLeaders if user id matches logged-in user's id

*/

  $scope.getUserById = function(id) {

    User.getUser(id)
      .then(function(data) {
        $scope.user = data[0];
        console.log("Well here we are", $scope.user);
        //if id matches logged-in id
          //then call getLeaders
        //else
          //display buy shares button
      })
  }

  $scope.getLeaders = function() {
    User.getLeaderData()
      .then(function(data) {
        $scope.leaders = data;
      })
  }

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      $scope.currentUserInfo = Root.currentUserInfo
     $scope.getUserById($scope.currentUserInfo.id);
    }
  })



  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});