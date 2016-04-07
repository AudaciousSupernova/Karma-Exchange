angular.module('app.tab', [])

.controller('TabController', function ($scope, $rootScope,$location, Auth) {
  $scope.url_id = $rootScope.user.id

  $rootScope.$on('$stateChangeStart', function(){
    Auth.checkLoggedIn().then(function(boolean) {
      if (boolean === false) {
        $location.path('/')
      }
    })
  })  

  $scope.logout = function(){
    $rootScope.token = null;
    $location.path('/')
  }
})