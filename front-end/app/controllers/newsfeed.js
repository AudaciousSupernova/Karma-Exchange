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

  //get number of users
  //get number of transactions
  //get total karma
  //get richest users
  //get highest scores
  $scope.getTrending = function() {
    Newsfeed.getTrending()
      .then(function(results) {
        $scope.trending = results.data;
        console.log('results', results); 
      })
  };

  Auth.checkLoggedIn().then(function(loggedIn) {
    console.log(loggedIn,"what is logged in")
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