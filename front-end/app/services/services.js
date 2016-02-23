angular.module('app.services', [])

// Users factory handles all requests to add, retrieve, or modify users in the database
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

//Portfolio factory provides functions to get and add investsments for users and of users.
.factory('Portfolio', function($http, $location) {
  return {
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

//Provides a function to determine whether a user is loggedIn. If the user is logged in, the user's information
//will be stored in the global angular $rootScope to personalize each view.
.factory('Auth', function ($http, $location, $rootScope) {
  return {
    checkLoggedIn   : function () {
      return $http({
        method: 'GET',
        url: '/api/loggedin'
      })
      .then(function (user) {
        if (user.data[0].id) {
          $rootScope.loggedinUserInfo = user.data[0];
          return true;
        } else {
          console.log("error authenticating user");
          return false;
        }
      });
    }
  }
})

//The TransactionHist factory makes http calls that will get information on the transaction history of a user,
//add new transactions to the history, place transactions in the transaction queue, or check the contents of the
//transaction queue.
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

    //gets all of the open transactions for a specific user and a specific target, used in the sell controller to determine how many shares a user can actually sell
    getOpenUserSellTransactionsForTarget: function(user_id, target_id){
      return $http({
        method: 'GET',
        url: '/transaction/queueSells',
        params: {user_id: user_id, target_id: target_id}
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
//The scores factory will get the scores associated for a user, or provide the route to update the users
//social investment score.
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
        url: '/api/updateInvestmentScore/' + id
      })
    }
  }
})
//The FB factory makes an http call that makes calls to Facebook's  Graph API and updates the user's social score
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
//The socket factory defines the socket on and emit functions that listen and send socket events to the backend.
//Sockets are used in creating ticker.
.factory('Socket', function($rootScope) {

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
