angular.module('app.transactionHist', [])

//<h2>TransactionHist Controller</h2>

.controller('TransactionHistController', function($scope, $location, TransactionHist, Auth, Root) {
  $scope.transactions = []

  //<h3>$scope.getTransactions</h3>

  //Gets all the transactions a user has made.
  $scope.getTransactions = function() {
    TransactionHist.getTransactions($scope.loggedinUserInfo.id)
    .then(function(results) {
      console.log(results);
      $scope.transactions = results;
    });
  }

  //Check if the user is logged in
  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      $scope.loggedinUserInfo = Root.currentUserInfo.data;
      var currentPath = $location.path();
      currentPath = currentPath.split("");
      $scope.profileId = currentPath.splice(17).join("");
      $scope.getTransactions();
    }
  })
});
