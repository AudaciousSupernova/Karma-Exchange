angular.module('app.newsfeed', [])

//<h3> Newsfeed Controller </h3>
.controller('NewsfeedController', function($scope, $rootScope, $location, Newsfeed, Auth, FB) {
  $scope.trending;
  $scope.totalUsers;
  $scope.totalKarma;
  $scope.totalTransactions;

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
    if (loggedIn === false) {
      $location.path('/')
    } else {
      console.log("I made it in here");
    }
  })


  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});
