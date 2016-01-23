angular.module('app.newsfeed', [])

.controller('NewsfeedController', function($scope, $location, Newsfeed) {
  $scope.trending;

  $scope.getTrending = function() {
    Newsfeed.getTrending()
      .then(function(results) {
        $scope.trending = results.data;
      })
  };

  $scope.getTrending();
  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});