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
});