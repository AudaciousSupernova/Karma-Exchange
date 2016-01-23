angular.module('app.profile', [])

.controller('ProfileController', function($scope, $location, Profile) {
  $scope.testing;
  $scope.leaderTesting;
  $scope.user = {
    name: 'Neeraj Kohirkar', 
    scores: [
      {
        name: 'Neeraj Kohirkar', 
        score: 98, 
        date: 'January 1 2013'
      }, 
      {
        name: 'Neeraj Kohirkar', 
        score: 99, 
        date: 'February 22, 2014'
      }, 
      {
        name: 'Neeraj Kohirkar', 
        score: 22, 
        date: 'June 2, 2010'
      }
    ], 
    currentScore: 99
  };

  $scope.leaders = [
    {
      name: 'Kyle Morehead', 
      score: 95
    }, 
    {
      name: 'Ranjit Rao', 
      score: 99
    }, 
    {
      name: 'Karthik Vempathy', 
      score: 99
    }
  ];

  $scope.getUserData = function() {
    //grab user id
    //pass user id to service function
    Profile.getUser()
      .then(function(data) {
        $scope.testing = data;
      })
  }

  $scope.getLeaders = function() {
    Profile.getLeaderData()
      .then(function(data) {
        $scope.leaderTesting = data;
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