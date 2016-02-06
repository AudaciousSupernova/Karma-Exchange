angular.module('app.index', [])


.controller('IndexController', function($scope, Socket, $rootScope, $location, $http, Newsfeed, Root, Auth, User, TransactionHist) {

  $scope.currentUserInfo = false;
  $scope.searchResults;
  $scope.searchQuery = "";
  var test = "Hello Neeraj Kohirkar";
  $scope.transactions = [];


  Socket.emit('test', {test: test});

  $scope.getUserById = function(id) {

    User.getUser(id)
    .then(function(data) {
      console.log("what is my data", data);
      //Data is an array of one user
      //Grab the user
        //set this entire user to Root.currentUserInfo
    })
  }

  $scope.viewHome = function () {
    $location.path('/newsfeed');
  }
  $scope.viewProfile = function () {
    $location.path('/profile/' + $scope.currentUserInfo.id);
  }

  $scope.viewPortfolio = function () {
    $location.path('/portfolio/' + $scope.currentUserInfo.id);
  }

  $scope.getLeaders = function () {
    User.getLeaderData().then(function(result) {
      $scope.userOne = result[0].name;
      $scope.userTwo = result[1].name;
    });
  }

  $scope.getAllTransactions = function() {
    TransactionHist.getAllTransactions()
    .then(function(results) {
      console.log("I successfully got all transactions", results);
      $scope.transactions = results.reverse();
      console.log("what are my transacitons", $scope.transactions);
    })
  }

  $scope.logout = function () {
    return $http({
      method: 'GET',
      url: '/api/logout'
    }).then(function successCallback(response) {
      $scope.currentUserInfo = false;
      console.log('loggedOut')
      $location.path('/');
      }, function errorCallback(response) {
        console.log('something happened. you aren\'t logged out!')
      });
  }

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

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      Root.addUserInfo($rootScope.user);
      $scope.currentUserInfo = Root.currentUserInfo.data;
      console.log("check it out", $scope.currentUserInfo);

      Socket.on('test', function(data) {
        console.log("here are my results", data);
      })

      Socket.on('transaction', function(data) {
        console.log('here is my data', data);
        console.log("here it is", data.transaction.transaction);
        $scope.transactions.unshift(data.transaction.transaction);
        console.log("These are my transactions after socket event", $scope.transactions);
      })

      $scope.getAllTransactions();
    }
  })



  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});
