angular.module('app.transactionHist', [])

.controller('TransactionHistController', function($scope, $location, TransactionHist, Auth, Root) {
  $scope.test = "hello testing buy";

  $scope.transactions = []
  
  $scope.getTransactions = function() {
    TransactionHist.getTransactions($scope.loggedinUserInfo.id)
    .then(function(results) {
      console.log(results);
      $scope.transactions = results;
    })
  } 

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