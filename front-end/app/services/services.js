angular.module('app.services', [])

//<h2>User factory</h2>
.factory('User', function($http, $location) {
  return {

    //<h3>getUser</h3>
    getUser: function(id) {
      return $http({
        method: 'GET',
        url: '/profile/' + id,
      })
      .then(function(res) {
        return res.data;
      })
    },

    //<h3>getUserByPartial</h3>
    getUserByPartial: function(partial){
      return $http({
        method: 'GET',
        url: '/users/partial/' + partial,
      })
      .then(function(res) {
        return res.data;
      })
    },

    //<h3>getLeaderData</h3>
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

//<h2>Portfolio factory</h2>
.factory('Portfolio', function($http, $location) {
  return {

    //<h3>getInvestments</h3>
    getInvestments: function(id) {
      return $http({
        method: 'GET',
        url: '/portfolio/' + id,
      })
      .then(function(res) {
        return res.data;
      })
    },

    //<h3>addInvestments</h3>
    addInvestment: function(investment) {
      return $http({
        method: 'POST',
        url: '/profile/buy',
        data: {investment: investment}
      })
    }
  }
})

//<h2>Auth Factory</h2>

.factory('Auth', function ($http, $location, $rootScope) {
  return {
    //<h3>checkedLoggedIn</h3>

    //Function to determine whether a user is loggedIn. If the user is logged in, the user's information
    //will be stored in the global angular $rootScope to personalize each view.
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

//<h2>Transaction History Factory</h2>

//TransactionHist factory makes http calls that will get information on the transaction history of a user,
//add new transactions to the history, place transactions in the transaction queue, or check the contents of the
//transaction queue.
.factory('TransactionHist', function ($http, $location) {
  return {

    //<h3>addTransaction</h3>

    //Calls addTransaction, which adds transaction to TransactionHist - affecting transactionQueue, karma, stocks, share price.
    addTransaction: function(transactionObj) {
      return $http({
        method: 'POST',
        url: '/transaction/add',
        data: {transactionObj: transactionObj}
      })
    },

    //<h3>getTransactions</h3>

    //Get all past transactions for given user_id
    getTransactions: function(user_id) {
      return $http({
        method: 'GET',
        url: '/transaction/get/' + user_id
      })
      .then(function(res) {
        return res.data;
      })
    },

    //<h3>getAllTransactions</h3>

    getAllTransactions: function() {
      return $http({
        method: 'GET',
        url: '/transaction/all/'
      })
      .then(function(res) {
        return res.data;
      })
    },

    //<h3>getOpenUserTransactions</h3>

    //Gets all of the open transactions for a specific user, used in the portfolio to help close those transactions
    getOpenUserTransactions: function(user_id){
      return $http({
        method: 'GET',
        url: '/transaction/queue/' + user_id
      })
      .then(function(res) {
        return res.data;
      })
    },

    //<h3>getOpenUserSellTransactionsForTarget</h3>

    //Gets all of the open transactions for a specific user and a specific target, used in the sell controller to determine how many shares a user can actually sell
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

    //<h3>checkSharesAvail</h3>

    //Returns number of shares available for given target_id
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

    //<h3>makeTransaction</h3>

    //Calls makeTransaction
    makeTransaction: function(transactionObj) {
      return $http({
        method: 'POST',
        url: '/transaction/make',
        data: {transactionObj: transactionObj}
      })
    },

    //<h3>addTransactionToQueue</h3>

    //Calls addTransactionToQueue, which adds specified transaction to transaction queue
    addTransactionToQueue: function(transactionObj) {

      return $http({
        method: 'POST',
        url: '/transaction/queue',
        data: {transactionObj: transactionObj}
      })
    },

    //<h3>closeTransactionRequest</h3>

    //Calls closeTransactionRequest, which closes specified transaction request
    closeTransactionRequest: function(transactionObj, shareValue) {
      return $http({
        method: 'POST',
        url: '/transaction/close',
        data: {transactionObj: transactionObj, shareValue: shareValue}
      })
    },

    //<h3>deleteOpenTransaction</h3>

    //Deletes an open transaction from the queue. Used in portfolio view to cancel a transaction
    deleteOpenTransaction: function(transactionId){
      return $http({
        method: 'DELETE',
        url: '/transaction/queue/delete/' + transactionId
      })
    }

  }
})

//<h2>Scores Factory</h2>

//The scores factory will get the scores associated for a user, or provide the route to update the users
//social investment score.
.factory('Scores', function ($http, $location) {
  return {

    //<h3>getScores</h3>

    //HTTP request to API route to get score data for a user
    getScores: function(id) {
      return $http({
        method: 'GET',
        url: '/profile/score/month/' + id
      })
      .then(function(res) {
        return res.data;
      })
    },

    //<h3>updateSocialInvestment</h3>

    //HTTP request to API route to update the social investment score
    updateSocialInvestment: function (id) {
      return $http({
        method: 'GET',
        url: '/api/updateInvestmentScore/' + id
      })
    }
  }
})

//<h2>Facebook Factory</h2>

//The FB factory makes an HTTP call that makes calls to Facebook's Graph API and updates the user's social score
.factory('FB', function ($http, $location) {
  return {

    //<h3>Test (Facebook Score)

    //HTTP request to API Route to make Facebook Graph API call
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

//<h2>Socket Factory</h2>

//The socket factory defines the socket on and emit functions that listen and send socket events to the backend.
//Sockets are used in creating ticker.
.factory('Socket', function($rootScope) {

  return {

    //<h3>On</h3>

    // Socket listener
    on: function(eventName, callback) {
      window.socket.on(eventName, function() {

        var args = arguments;
        $rootScope.$apply(function() {
          callback.apply(window.socket, args);
        })
      });
    },

    //<h3>Emit</h3>

    // Socket emitter
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
