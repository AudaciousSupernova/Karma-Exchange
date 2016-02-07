angular.module('app.profile', [])

	//<h3>Profile Controller</h3>

.controller('ProfileController', function($scope, $location, User, Auth, Root, Scores, $mdDialog, FB, $rootScope) {

  $scope.isUser = true;
  $scope.user;
  $scope.leaders;
  $scope.profileId;
  $scope.scores = [[],[]];
  $scope.labels = [];
  $scope.wednesday = false;
  //Save the user id, included in the location path

  //Pass this userId to $scope.getUserData in order to get all data associated with user

  //if the userId matches the logged in user, then also call getLeaders
  //if not, then display only the profile's general information

  /*
    When a user clicks on "Profile", pass the logged-in user's id to the new route: /profile/:id
    in this controller file, save the id as user id
    get UserData by passing the id

    If a user types in a name in the search bar, then before routing to /profile/:id, first get the id associated with the selected name.

    This function will be called on the main controller to grab user information by name.
    The response will include the user id.

    Now route to /profile/:id, save the id as user id, and get UserData

    only call getLeaders if user id matches logged-in user's id

*/

 $scope.getFacebookData = function() {
    FB.test($scope.user.id)
      .then(function(results) {
        console.log('results', results);
      })
  }

  $scope.getUserById = function(id) {

    User.getUser(id)
    .then(function(data) {
        $scope.user = data[0];
        if ($scope.user.profile_photo === null) {
          $scope.user.profile_photo = "http://www.caimontebelluna.it/CAI_NEW_WP/wp-content/uploads/2014/11/face-placeholder-male.jpg";
        }
        if ($scope.user.email === null) {
          $scope.user.email = "No Email Provided"
        }
        var date = new Date();
        if (date.getDay() === 2) {
          $scope.wednesday = true;
        } else if ($scope.user.id === $rootScope.loggedinUserInfo.id) {
          $scope.wednesday = true;
        }
        $scope.getScores();
    })
  }

  $scope.getScores = function () {
    $scope.series = ["Social Score", "Total Score"]
    Scores.getScores($scope.profileId)
    .then(function (results) {
      for(var i = 0; i < results.length; i++){
        var scoreObj = results[i];
        $scope.scores[0].push(scoreObj.social);
        $scope.scores[1].push(scoreObj.currentScore);
      }
      var daysBeforeUserJoined = $scope.labels.length - $scope.scores[0].length
      for(var i = 0; i < daysBeforeUserJoined; i++){
        $scope.scores[0].unshift(0)
        $scope.scores[1].unshift(0)
      }
      console.table($scope.scores)
    })
  }
  $scope.addLabels = function(daysInPast){
    for(; daysInPast >= 0; daysInPast--){
      if(daysInPast % 5 === 0){
        $scope.labels.push(daysInPast)
      } else {
        $scope.labels.push("")
      }
    }
  }

  $scope.getLeaders = function() {
    User.getLeaderData()
    .then(function(data) {
      $scope.leaders = data;
    })
  }

  $scope.clickBuy = function() {
    $mdDialog.show({
      templateUrl: '../app/views/buy.html',
      locals: {
        profile: $scope.user
      },
      controller: BuyModalController
    })
      .then(function(clickedItem) {
      })
  }

  //Click on report function that takes user to the report modal
  //Add in ng-show logic for the report button on the profile view
    //if your on someone elses profile and one week has not gone by
      //hide button
    //otherwise if your on your profile
      //show button
    //otherwise if one week has gone by
      //show button
  $scope.clickReport = function() {
    $mdDialog.show({
      templateUrl: '../app/views/report.html',
      locals: {
        user: $scope.user
      },
      controller: ReportModalController
    })
      .then(function(clickedItem) {
      })
  }

  function BuyModalController($location, $scope, $mdDialog, profile, TransactionHist, Portfolio, Socket) {

    $scope.profile = profile;
    $scope.score = $rootScope.loggedinUserInfo.currentScore;
    console.log("$scope.score", $scope.score);
    $scope.sharesToBuy;
    $scope.availableShares;
    $scope.revealOptions = false;

    $scope.confirm = function() {

      var transaction = {
        user_id: $rootScope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: $scope.availableShares > $scope.sharesToBuy ? $scope.sharesToBuy : $scope.availableShares
      }

      var investment = {
        user_id: $rootScope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        numberShares: $scope.sharesToBuy
      }

      if ($rootScope.loggedinUserInfo.karma < $scope.score* $scope.sharesToBuy) {
        console.log("NOT ENOUGH MONEY")
        // $location.path('/profile/' + $scope.loggedinUserInfo.id);
        $mdDialog.hide();

      } else {

        if($scope.sharesToBuy > $scope.availableShares){
          $scope.revealOptions = true;

        } else {
          transaction.karma = $rootScope.loggedinUserInfo.karma - ($scope.score * transaction.numberShares);
          $rootScope.loggedinUserInfo.karma = $rootScope.loggedinUserInfo.karma - ($scope.score * transaction.numberShares);

          TransactionHist.makeTransaction(transaction)
            .then(function() {
              Socket.emit('transaction', {
                transaction: transaction
              });
              $mdDialog.hide();
            })

            //other option: 
            //on make transaction, return the transaction and all matching open transactions that were just closed
            //then i can do the socket emit on the frontend on all of these


        }
      }
    }

    $scope.wait = function() {

      var transaction = {
        user_id: $rootScope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: $scope.availableShares > $scope.sharesToBuy ? $scope.sharesToBuy : $scope.availableShares
      }

      TransactionHist.makeTransaction(transaction).then(function()  {
        Socket.emit()
        transaction.numberShares = $scope.sharesToBuy - transaction.numberShares;
        TransactionHist.addTransactionToQueue(transaction);
      })
      $mdDialog.hide();
    }

    $scope.buyDirect = function() {
      var transaction = {
        user_id: $rootScope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: $scope.availableShares
      }
      var newScore = Math.round($scope.profile.currentScore * 1.1);

      if ($scope.availableShares) {
        TransactionHist.makeTransaction(transaction).then(function() {
          transaction.numberShares = $scope.sharesToBuy - $scope.availableShares;
          TransactionHist.closeTransactionRequest(transaction, newScore);
        })

      } else {
        transaction.numberShares = $scope.sharesToBuy;
        TransactionHist.closeTransactionRequest(transaction, newScore);
      }
      transaction.karma = $scope.profile.currentScore * $scope.availableShares + newScore * ($scope.sharesToBuy - $scope.availableShares)
      $rootScope.loggedinUserInfo.karma -= $scope.profile.currentScore * $scope.availableShares + newScore * ($scope.sharesToBuy - $scope.availableShares);
      Socket.emit('transaction', {
        transaction: transaction
      });
      $mdDialog.hide();
    }

    $scope.checkSharesAvail = function() {
      TransactionHist.checkSharesAvail($scope.profile.id, 'sell').then(function(response){
        $scope.availableShares = response;
      });
    }

    $scope.exit = function() {
      $mdDialog.hide();
    }
  }

  //<h3> ReportModalController Function </h3>
  //This will include the logic to display all profile report details. These include:
    //Current Score
    //Social Score
    //Expected Social Score Trend
    //Current Social Score Trend
    //Future Expected Social Score Trend
    //# of Shareholders
    //# of shares on market
    //Supply and demand ratio
    //Close button, on click should exit

  function ReportModalController($scope, $mdDialog, user) {
    $scope.user = user;
    console.log($scope.user);
    $scope.exit = function() {
      $mdDialog.hide();
    }
  }


  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      console.log("Auth works on the profile page");
      var currentPath = $location.path();
      currentPath = currentPath.split("");
      $scope.profileId = currentPath.splice(9).join("");
      $scope.getUserById($scope.profileId);
      // console.log("what is the rootscope user", $rootScope.user);
      // console.log("what is the rootscope id", $rootScope.user.data.id);
      // $scope.getUserById($rootScope.user.data.id, 'loggedinUser');
      $scope.addLabels(30);
    }
  })
});
