angular.module('app.auth', [])

.controller('AuthController', function ($scope, $location, Auth, $rootScope) {

  // Auth.checkLoggedIn().then(function(boolean) {
  //   if (boolean === false) {
  //     $location.path('/')
  //   } else {
  //     $location.path('/profile/' + $rootScope.loggedinUserInfo.id)
  //   }
  // })
});