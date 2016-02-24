angular.module('app.newsfeed', [])

//<h2> Newsfeed Controller </h2>
.controller('NewsfeedController', function($scope, $rootScope, $location, Newsfeed, Auth, FB) {
  $scope.trending;
  $scope.totalUsers;
  $scope.totalKarma;
  $scope.totalTransactions;

  //<h3>$scope.getTrending</h3>

  //trending data will be the same data for every user
  //call the function and store results in $scope.trending
  $scope.getTrending = function() {
    Newsfeed.getTrending()
      .then(function(results) {
        $scope.trending = results.data;
      })
  };

  //Check whether the user is logged in
  Auth.checkLoggedIn().then(function(loggedIn) {
    if (loggedIn === false) {
      $location.path('/')
    } else {
      console.log("I made it in here");
    }
  })
});
