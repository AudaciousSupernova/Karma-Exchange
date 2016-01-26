angular.module('app.services', [])

// Questions factory handles all requests to add, retrieve, or modify questions in the database

.factory('User', function($http, $location) {
  return {
    // add a question from ask
    getUser: function() {

      return $http({
        method: 'GET',
        url: '/profile',
      })
      .then(function(res) {
        console.log(res.data)
        return res.data;
      })
    }, 

    getLeaderData: function() {

      return $http({
        method: 'GET',
        url: '/leaders',
      })
      .then(function(res) {
        console.log(res.data)
        return res.data;
      })
    }
  }
})

.factory('Portfolio', function($http, $location) {
  return {
    // add a question from ask
    getInvestments: function() {

      return $http({
        method: 'GET',
        url: '/portfolio',
      })
      .then(function(res) {
        console.log(res.data)
        return res.data;
      })
    }
  }
})

.factory('Newsfeed', function($http, $location) {
  return {
    // add a question from ask
    getTrending: function() {

      return $http({
        method: 'GET',
        url: '/trending',
      })
      .then(function(res) {
        console.log(res.data)
        return res.data;
      })
    }
  }
})

.factory('Auth', function ($http, $location, $rootScope) {
  return {
    checkLoggedIn: function () {
      return $http.get('/api/loggedin').then(function (user) {
        if (user.data.id) {
          console.log('recognizes user', user)
          $rootScope.user = user;
          return true;
        } else {
          console.log("error authenticating user");
          return false;
        }
      });
    }
  }
})