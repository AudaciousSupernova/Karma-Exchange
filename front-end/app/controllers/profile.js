angular.module('app.profile', [])

//<h3>Profile Controller</h3>

.controller('ProfileController', function($scope, $location, User, Auth, Root, Scores, $mdDialog, FB, $rootScope) {

  $scope.user;
  $scope.leaders;
  $scope.profileId;
  $scope.scores = [[],[]];
  $scope.labels = [];
  $scope.wednesday = false;
  $scope.isUser = false; 

  //Button press calls this function that retrieves the profile user's latest Facebook score.
  $scope.getFacebookData = function() {
    FB.test($scope.user.id)
      .then(function(results) {
        console.log(results);
      })
  }

  //This function grabs user information of the current profile id
  $scope.getUserById = function(id) {
    User.getUser(id)
      .then(function(user) {
        $scope.user = user[0];
        if ($scope.user.profile_photo === null) {
          $scope.user.profile_photo = "http://www.caimontebelluna.it/CAI_NEW_WP/wp-content/uploads/2014/11/face-placeholder-male.jpg";
        }
        if ($scope.user.email === null) {
          $scope.user.email = "No Email Provided";
        }
        var date = new Date();
        console.log("ID's",$scope.user.id,$rootScope.loggedinUserInfo.id)
        if (date.getDay() === 3) {
          $scope.wednesday = true;
        } else if ($scope.user.id === $rootScope.loggedinUserInfo.id) {
          $scope.isUser = true;
        }
        $scope.getScores();
      })
  }

  // getScores grabs all scores associated with the profile id
  $scope.getScores = function () {
    $scope.series = ["Total Score", "Social Score"];
    
    Scores.getScores($scope.profileId)
    .then(function (results) {
      for(var i = 0; i < results.length; i++){
        var scoreObj = results[i];
        // if the actual user, show both total/current score AND social score
        if ($scope.isUser === true) {
          $scope.scores[0].push(scoreObj.currentScore);
          $scope.scores[1].push(scoreObj.social);
          // else just show total/current score
        } else {
          $scope.scores[0].push(scoreObj.currentScore);
        }
      }
      var daysBeforeUserJoined = $scope.labels.length - $scope.scores[0].length
      for(var i = 0; i < daysBeforeUserJoined; i++){
        $scope.scores[0].unshift(0);
        $scope.scores[1].unshift(0);
      }
    })
  }

  //addLabels adds labels for the angular chart associated with profile id
  $scope.addLabels = function(daysInPast){
    for(; daysInPast >= 0; daysInPast--){
      if(daysInPast % 5 === 0){
        $scope.labels.push(daysInPast)
      } else {
        $scope.labels.push("")
      }
    }
  }

  //clickBuy opens up the Buy Modal
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

  //clickReport opens up the Report Modal
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

  //Controller for the Buy Modal
  function BuyModalController($scope, $mdDialog, profile, TransactionHist, Portfolio, Socket, Scores) {

    $scope.profile = profile;
    $scope.score = $rootScope.loggedinUserInfo.currentScore;
    $scope.sharesToBuy;
    $scope.availableShares;
    $scope.availableSharesInfo;
    $scope.revealOptions = false;
    $scope.errorMessage = false;

    //On confirm click, this function evaluates the transaction validity
    //If the transaction is invalid, user will be notified
    $scope.confirm = function() {
      var transaction = {
        user_id: $rootScope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: $scope.availableShares > $scope.sharesToBuy ? $scope.sharesToBuy : $scope.availableShares
      }

      // var investment = {
      //   user_id: $rootScope.loggedinUserInfo.id,
      //   target_id: $scope.profile.id,
      //   numberShares: $scope.sharesToBuy
      // }
      if ($rootScope.loggedinUserInfo.karma < $scope.profile.currentScore * $scope.sharesToBuy) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        if($scope.sharesToBuy > $scope.availableShares){
          $scope.revealOptions = true;
        } else {
          TransactionHist.makeTransaction(transaction)
            .then(function() {
              //On a successfull transaction, socket emit event to send recent transactions
              Socket.emit('transaction', {
                transaction: transaction
              });
              if ($scope.availableSharesInfo && $scope.availableSharesInfo.user_id !== $rootScope.loggedinUserInfo.id.toString()) {
                $rootScope.loggedinUserInfo.karma = $rootScope.loggedinUserInfo.karma - ($scope.score * transaction.numberShares);
              }
              $mdDialog.hide();
            })
        }
      }
    }

    //This function adds a transaction to the transaction queue
    $scope.wait = function() {
      var transaction = {
        user_id: $rootScope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: $scope.availableShares
      }
      if ($rootScope.loggedinUserInfo.karma < $scope.profile.currentScore * ($scope.sharesToBuy - transaction.numberShares)) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        TransactionHist.makeTransaction(transaction).then(function()  {
          transaction.numberShares = $scope.sharesToBuy - $scope.availableShares;
          TransactionHist.addTransactionToQueue(transaction);
        })
        Scores.updateSocialInvestment($scope.profile.id);
        if ($scope.availableSharesInfo && $scope.availableSharesInfo.user_id !== $rootScope.loggedinUserInfo.id.toString()) {
          $rootScope.loggedinUserInfo.karma -= $scope.profile.currentScore*($scope.availableShares);
        }
        $mdDialog.hide();
      }
    }

    //This function directly makes a transaction with increased cost
    $scope.buyDirect = function() {
      var transaction = {
        user_id: $rootScope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: $scope.availableShares
      }

      var newScore = $scope.profile.currentScore * 1.1;
      if ($rootScope.loggedinUserInfo.karma < $scope.profile.currentScore * $scope.availableShares + newScore*($scope.sharesToBuy - $scope.availableShares)) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        if ($scope.availableShares) {
          TransactionHist.makeTransaction(transaction).then(function() {
            setTimeout(function() {
              transaction.numberShares = $scope.sharesToBuy - $scope.availableShares;
              TransactionHist.closeTransactionRequest(transaction, newScore);
            }, 100)
          })
        } else {
          transaction.numberShares = $scope.sharesToBuy;
          TransactionHist.closeTransactionRequest(transaction, newScore);
        }
        //If the user you are buying from is you, you only lose the money that will go to the server.
        if ($scope.availableSharesInfo && $scope.availableSharesInfo.user_id === $rootScope.loggedinUserInfo.id.toString()) {
          $rootScope.loggedinUserInfo.karma -= Math.round(newScore * ($scope.sharesToBuy - $scope.availableShares));
        } else {
          $rootScope.loggedinUserInfo.karma -= Math.round($scope.profile.currentScore * $scope.availableShares + newScore * ($scope.sharesToBuy - $scope.availableShares));
        }

        Scores.updateSocialInvestment($scope.profile.id);
        //Socket emit event to update recent transactions

        Socket.emit('transaction', {
          transaction: transaction
        });
        $mdDialog.hide();
      }
    }

    $scope.checkSharesAvail = function() {
      TransactionHist.checkSharesAvail($scope.profile.id, 'sell').then(function(response){
        $scope.availableShares = response[0];
        $scope.availableSharesInfo = response[1][0];
        console.log($scope.availableSharesInfo, 'availableSharesInfo')
      });
    }

    //Exit closes the Buy modal
    //is this really necessary?
    $scope.exit = function() {
      $mdDialog.hide();
    }
  }

  //<h3> ReportModalController Function </h3>
  function ReportModalController($scope, $mdDialog, user) {
    $scope.user = user;
    //Exit closes the Report modal
    $scope.exit = function() {
      $mdDialog.hide();
    }
  }

  Auth.checkLoggedIn().then(function(boolean) {
    if (boolean === false) {
      $location.path('/')
    } else {
      //Grabs the profile id from the path and grabs the corresponding profile information
      var currentPath = $location.path();
      currentPath = currentPath.split("");
      $scope.profileId = currentPath.splice(9).join("");
      $scope.getUserById($scope.profileId);
      $scope.addLabels(30);
    }
  })
});
