angular.module('app.index', [])


.controller('IndexController', function($scope, Socket, $rootScope, $location, $http, Newsfeed, Root, Auth, User, TransactionHist) {
  $scope.searchResults;
  $scope.searchQuery = "";
  var test = "Hello Neeraj Kohirkar";
  $scope.transactions = [];


  Socket.emit('test', {test: test});

  $scope.getUserById = function(id) {

    User.getUser(id)
    .then(function(user) {
      $scope.loggedinUserInfo = user[0];
      //Data is an array of one user
      //Grab the user
        //set this entire user to Root.currentUserInfo
    })
  }

  $scope.viewHome = function () {
    $location.path('/newsfeed');
  }
  $scope.viewProfile = function () {
    console.log("what is the rootScope", $rootScope)
    $location.path('/profile/' + $rootScope.loggedinUserInfo.id);
  }

  $scope.viewPortfolio = function () {
    $location.path('/portfolio/' + $rootScope.loggedinUserInfo.id);
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
      $scope.transactions = results;
      console.log("what are my transactions", $scope.transactions);
    })
  }

  $scope.logout = function () {
    return $http({
      method: 'GET',
      url: '/api/logout'
    }).then(function successCallback(response) {
      $rootScope.loggedinUserInfo = false;
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

  $scope.resetSearch = function(){
    $scope.searchQuery = ""
    $scope.searchResults = [];
  }

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      
      // $scope.getUserById($rootScope.user.data.id)

      // Socket.on('test', function(data) {
      //   console.log("here are my results", data);
      // })

      // Socket.on('transaction', function(data) {
      //   console.log('here is my data', data);
      //   console.log("here it is", data.transaction.transaction);
      //   $scope.transactions.unshift(data.transaction.transaction);
      //   if (data.transaction.transaction.user_id === $scope.loggedinUserInfo.id) {
      //     $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma - data.transaction.transaction.karma;
      //     console.log("These are my transactions after socket event", $scope.transactions);
      //   }
      // })

      // Socket.on('sell', function(data) {
      //   console.log("on the sell click here is the transaction", data.transaction.transaction);
      //   $scope.transactions.unshift(data.transaction.transaction);
      //   if (data.transaction.transaction.user_id === $scope.loggedinUserInfo.id) {
      //     $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma + data.transaction.transaction.karma;
      //   }
      // })

      // Socket.on('transactionQueue', function(data) {
      //   console.log("here is the transaction queue activity", data);
      // })

      $scope.getAllTransactions();

      Socket.on('transaction', function(transaction) {
        console.log("AM I IN HERE", transaction.transaction);
        $scope.transactions.unshift(transaction.transaction.transaction);
      })
    }
  })



  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});
