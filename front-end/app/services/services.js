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

    getUserByPartial: function(partial){
      return $http({
        method: 'GET',
        url: '/users/partial/' + partial,
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
        console.log(res.data, 'res.data');
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
        // console.log("what is user", user);
        console.log("what is the user", user);
        if (user.data[0].id) {
          $rootScope.loggedinUserInfo = user.data[0];
          console.log("what is my new $rootScope", $rootScope.loggedinUserInfo)
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
    // calls addTransaction, which adds transaction to TransactionHist - affecting transactionQueue, karma, stocks, share price.
    addTransaction: function(transactionObj) {
      return $http({
        method: 'POST',
        url: '/transaction/add',
        data: {transactionObj: transactionObj}
      })
    },
    //get all past transactions for given user_id
    getTransactions: function(user_id) {
      return $http({
        method: 'GET',
        url: '/transaction/get/' + user_id
      })
      .then(function(res) {
        return res.data;
      })
    },

    getAllTransactions: function() {
      return $http({
        method: 'GET',
        url: '/transaction/all/'
      })
      .then(function(res) {
        return res.data;
      })
    },
    //gets all of the open transactions for a specific user, used in the portfolio to help close those transactions
    getOpenUserTransactions: function(user_id){
      return $http({
        method: 'GET',
        url: '/transaction/queue/' + user_id
      })
      .then(function(res) {
        return res.data;
      })
    },
    // returns number of shares available for given target_id
    checkSharesAvail: function(target_id, type) {
      console.log('targetid', target_id, 'type', type);
      return $http({
        method: 'GET',
        url: '/transaction/check/',
        params: {target_id: target_id, type: type}
      })
      .then(function(res) {
        return res.data;
      })
    },

    // calls makeTransaction
    makeTransaction: function(transactionObj) {
      return $http({
        method: 'POST',
        url: '/transaction/make',
        data: {transactionObj: transactionObj}
      })
    },

    // calls addTransactionToQueue, which adds specified transaction to transaction queue
    addTransactionToQueue: function(transactionObj) {

      return $http({
        method: 'POST',
        url: '/transaction/queue',
        data: {transactionObj: transactionObj}
      })
    },

    // calls closeTransactionRequest, which closes specified transaction request
    closeTransactionRequest: function(transactionObj, shareValue) {
      return $http({
        method: 'POST',
        url: '/transaction/close',
        data: {transactionObj: transactionObj, shareValue: shareValue}
      })
    },

    //deletes an open transaction from the queue. Used in portfolio view to cancel a transaction
    deleteOpenTransaction: function(transactionId){
      return $http({
        method: 'DELETE',
        url: '/transaction/queue/delete/' + transactionId
      })
    }

  }
})

.factory('Scores', function ($http, $location) {
  return {
    getScores: function(id) {
      return $http({
        method: 'GET',
        url: '/profile/score/month/' + id
      })
      .then(function(res) {
        return res.data;
      })
    },

    updateSocialInvestment: function (id) {
      return $http({
        method: 'GET',
        url: 'api/updateInvestmentScore/' + id
      })
    }
  }
})

.factory('FB', function ($http, $location) {
  return {
    test: function(id) {
      return $http({
        method: 'GET',
        url: '/facebook/' + id
      })
      .then(function(res) {
        return res.data;
      })
    }
  }
})

.factory('Socket', function($rootScope) {

  // socket.on('test', function(results) {
  //   console.log("hello", results);
  // })
  return {

    on: function(eventName, callback) {
      window.socket.on(eventName, function() {

        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(window.socket, args);
        })
        // var args = arguments;
        // callback(socket, args);
      });
    },

    emit: function(eventName, data, callback) {
      window.socket.emit(eventName, data, function() {
        var args = arguments;
        $rootScope.$apply(function() {
          if (callback) {
            callback.apply(window.socket, args);
          }
        })
      });
    }

  }

});
