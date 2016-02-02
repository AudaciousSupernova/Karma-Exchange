angular.module('app.newsfeed', [])

//<h3> Newsfeed Controller </h3>
.controller('NewsfeedController', function($scope, $rootScope, $location, Newsfeed, Auth, FB) {
  $scope.trending;
  console.log("in the newsfeed controller", $rootScope.user)
  //trending data will be the same data for every user
  //call the function and store results in $scope.trending
  $scope.getTrending = function() {
    Newsfeed.getTrending()
      .then(function(results) {
        $scope.trending = results.data;
      })
  };

  Auth.checkLoggedIn().then(function(loggedIn) {
    console.log(loggedIn,"what is logged in")
    if (loggedIn === false) {
      $location.path('/')
    } else {
      $scope.getTrending();
      // $scope.fbTest();
    }
  })
  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});