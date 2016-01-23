angular.module('app.newsfeed', [])

.controller('NewsfeedController', function($scope, $location, Newsfeed) {
  $scope.trending = [
    {
      name: 'Spencer', 
      scores: [
        {
          name: 'Spencer', 
          score: 98, 
          date: 'January 1 2013'
        }, 
        {
          name: 'Spencer', 
          score: 99, 
          date: 'February 22, 2014'
        }, 
        {
          name: 'Spencer', 
          score: 22, 
          date: 'June 2, 2010'
        }
      ], 
      currentScore: 99
    }, 
    {
      name: 'Tessa', 
      scores: [
        {
          name: 'Tessa', 
          score: 98, 
          date: 'January 1 2013'
        }, 
        {
          name: 'Tessa', 
          score: 99, 
          date: 'February 22, 2014'
        }, 
        {
          name: 'Tessa', 
          score: 22, 
          date: 'June 2, 2010'
        }
      ], 
      currentScore: 99
    }
  ];

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