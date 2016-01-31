angular.module('app.services', [])

// Questions factory handles all requests to add, retrieve, or modify questions in the database

.factory('User', function($http, $location) {
  return {
    // add a question from ask
    getUser: function(id) {
      return $http({
        method: 'GET',
        url: '/profile/' + id,
      })
      .then(function(res) {
        return res.data;
      })
    },

    getLeaderData: function() {

      return $http({
        method: 'GET',
        url: '/leaders',
      })
      .then(function(res) {
        return res.data;
      })
    }
  }
})

.factory('Portfolio', function($http, $location) {
  return {
    // add a question from ask
    getInvestments: function(id) {
      return $http({
        method: 'GET',
        url: '/portfolio/' + id,
      })
      .then(function(res) {
        return res.data;
      })
    },

    addInvestment: function(investment) {
      return $http({
        method: 'POST',
        url: '/profile/buy',
        data: {investment: investment}
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
        return res.data;
      })
    }
  }
})

.factory('Auth', function ($http, $location, $rootScope) {
  return {
    checkLoggedIn: function () {
      return $http({
        method: 'GET',
        url: '/api/loggedin'
      })
      .then(function (user) {
        if (user.data.id) {
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

.factory('Root', function ($http, $location, $rootScope) {
  return {
    addUserInfo: function(info) {
      this.currentUserInfo = info;
    }
  }
})


.factory('TransactionHist', function ($http, $location) {
  return {
    // calls makeTransaction, which adds transaction to TransactionHist - affecting transactionQueue, karma, stocks, share price.  
    addTransaction: function(transactionObj) {
      return $http({
        method: 'POST',
        url: '/transaction/sell',
        data: {transactionObj: transactionObj}
      })
    },
    // returns number of shares available for given target_id
    checkSharesAvail: function(target_id, type) {
      console.log('are we in checkSharesAvail');
      return $http({
        method: 'GET',
        url: '/transaction/check',
        data: {target_id: target_id, type: type}
      })
      .then(function(res) {
        console.log("response in transaction check", res.data)
        return res.data;
      })
    }
  }
})

.factory('Scores', function ($http, $location) {
  return {
    getScores: function(id) {
      console.log("here is the id", id)
      return $http({
        method: 'GET',
        url: '/profile/score/' + id
      })
      .then(function(res) {
        return res.data;
      })
    }
  }
})
