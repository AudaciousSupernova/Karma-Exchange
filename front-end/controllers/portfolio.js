angular.module('app.portfolio', [])

.controller('PortfolioController', function($scope, $location, Portfolio) {
  $scope.investments = [
    {
      currentUser: 'Neeraj Kohirkar', 
      targetUser: 'Ranjit Rao', 
      scores: [
        {
          name: 'Ranjit Rao', 
          score: 85, 
          date: 'January 5 2014'
        }, 
        {
          name: 'Ranjit Rao', 
          score: 82, 
          date: 'February 1 2015'
        }, 
        {
          name: 'Ranjit Rao', 
          score: 33, 
          date: 'March 14 2012'
        }
      ], 
      shares: 15, 
      buyingPrice: 18, 
      profit: 145
    }, 
    {
      currentUser: 'Neeraj Kohirkar', 
      targetUser: 'Kyle Morehead', 
      scores: [
        {
          name: 'Kyle Morehead', 
          score: 851, 
          date: 'January 5 2014'
        }, 
        {
          name: 'Kyle Morehead', 
          score: 820, 
          date: 'February 1 2015'
        }, 
        {
          name: 'Kyle Morehead', 
          score: 3311, 
          date: 'March 14 2012'
        }
      ], 
      shares: 8, 
      buyingPrice: 1180, 
      profit: 5
    }
  ];

  $scope.getInvestments = function() {
    //grab user id
    Portfolio.getInvestments()
      .then(function(results) {
        console.log('I made it back!');
        $scope.investments = results.data;
      })
  }

  $scope.getInvestments();

  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});