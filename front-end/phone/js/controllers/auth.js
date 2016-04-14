
angular.module('app.auth', [])

.controller('AuthController', function ($scope, $cordovaOauth, $location, $window, $rootScope, $state, Auth, Url) {

  window.addEventListener("message", function(data){
    console.log("got a message", data)
  })

  $scope.fbLogin = function(){

    // var token = "CAAK6H5Q1fAgBABM3dDCpFyOWKo4b0GQZAgNd1ZCackBzwbVyevaZACnkSPauWD5g3SWDmbnmx4FXFReXz44qRvXTzSUrKNROhxVGkEceNw97RZAZCAVB2DryserDFrjPZCrZCn25ZA1hvklQqxTAdrEZAWyDclV1SteDHdnDwiZCRZCZAM48oOZBWOgYrJem7UxaGRExfZB2HbEltYbgZDZD"

    // Auth.login(token).then(function(authResponse){
    //   $rootScope.token = authResponse.data.token
    //   $rootScope.user = authResponse.data.userObj
    //   $location.path('/profile/' + $rootScope.user.id)
    // })

    var callbackURL = "http://localhost/callback"
    $cordovaOauth.facebook('767594746706952', ['public_profile', 'user_friends', 'email', 'user_photos', 'user_posts']).then(function(result){
        Auth.login(result.access_token).then(function(authResponse){
          console.log(authResponse)
          $rootScope.token = authResponse.data.token
          $rootScope.user = authResponse.data.userObj
          $location.path('/profile/' + $rootScope.user.id)    
        })
      }, function(error) {
    console.log(error);
    });

  }
});

// "access_token":"CAAK6H5Q1fAgBABM3dDCpFyOWKo4b0GQZAgNd1ZCackBzwbVyevaZACnkSPauWD5g3SWDmbnmx4FXFReXz44qRvXTzSUrKNROhxVGkEceNw97RZAZCAVB2DryserDFrjPZCrZCn25ZA1hvklQqxTAdrEZAWyDclV1SteDHdnDwiZCRZCZAM48oOZBWOgYrJem7UxaGRExfZB2HbEltYbgZDZD"
// ['public_profile', 'user_friends', 'email', 'user_photos', 'user_posts']

// clientID: '767594746706952',
// clientSecret: 'd917065bc815ddf8ab8779c9f0b3c664',