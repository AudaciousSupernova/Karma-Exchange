angular.module('app.auth', [])

.controller('AuthController', function ($scope, $location, Auth) {
  $scope.test = "hello testing auth";


  // Auth.checkLoggedIn().then(function(loggedIn) {
  //   console.log(loggedIn,"what is logged in")
  //   if (loggedIn === false) {
  //     $location.path('/')
  //   } else {
  //     $location.path('/#/newsfeed')
  //   }
  // })
  

  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});