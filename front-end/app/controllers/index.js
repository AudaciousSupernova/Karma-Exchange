angular.module('app.index', [])

// <h3> Main Controller </h3>

.controller('IndexController', function($scope, Socket, $rootScope, $location, $http, Auth, User, TransactionHist) {
  $scope.searchResults;
  $scope.searchQuery = "";
  $scope.transactions = [];
  $scope.recentTransactions; 
  $scope.selectedProfile = true;
  $scope.selectedFortune = false;

  //getUserById finds a user in the database by passing a sql id
  $scope.getUserById = function(id) {
    User.getUser(id)
    .then(function(user) {
      $scope.loggedinUserInfo = user[0];
      //User is an array of one user
    })
  }

  //viewHome redirects the user to the newsfeed
  // $scope.viewHome = function () {
  //   $location.path('/newsfeed');
  // }

  //viewProfile redirects the user to his/her profile
  $scope.viewProfile = function () {
    $scope.selectedProfile = true;
    $scope.selectedFortune = false;
    $location.path('/profile/' + $rootScope.loggedinUserInfo.id);
  }

  //viewPortfolio redirects the user to his/her fortune page
  $scope.viewPortfolio = function () {
    $scope.selectedFortune = true;
    $scope.selectedProfile = false;
    $location.path('/portfolio/' + $rootScope.loggedinUserInfo.id);
  }

  //getLeaders grabs the two users with the highest scores.
  $scope.getLeaders = function () {
    User.getLeaderData().then(function(leaders) {
      $scope.userOne = leaders[0].name;
      $scope.userTwo = leaders[1].name;
    });
  }

  //getAllTransactions grabs all of last week's transactions.
  $scope.getAllTransactions = function() {
    TransactionHist.getAllTransactions()
    .then(function(results) {
      $scope.recentTransactions = results; 
    })
  }

  //logout sets the $rootScope's loggedinUserInfo to false and redirects the user to the root path
  $scope.logout = function () {
    return $http({
      method: 'GET',
      url: '/api/logout'
    }).then(function successCallback(response) {
      $rootScope.loggedinUserInfo = false;
      console.log("Successfully logged out.")
      $location.path('/');
      }, function errorCallback(response) {
        console.log("Something happened - log out failed.");
      });
  }

  //findUsersByPartial grabs user partials from the database based on the searchQuery
  $scope.findUsersByPartial = function(){
    if($scope.searchQuery.length){
      User.getUserByPartial($scope.searchQuery)
      .then(function(response){
        $scope.searchResults = response;
      })
    } else {
      $scope.searchResults = [];
    }
  }

  //resetSearch clears the searchQuery after a query has been made
  $scope.resetSearch = function(){
    $scope.searchQuery = ""
    $scope.searchResults = [];
  }

  //Check if the user is logged in
  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      $scope.getAllTransactions();
      //Socket listener for latest transactions
      Socket.on('transaction', function(transaction) {
        $scope.transactions.unshift(transaction.transaction.transaction);
        $scope.transactions.pop();
      })
    }
  })
});
