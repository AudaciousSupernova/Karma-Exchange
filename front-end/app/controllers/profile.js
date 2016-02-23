angular.module('app.profile', [])

//<h3>Profile Controller</h3>

.controller('ProfileController', function($scope, $location, User, Auth, Scores, $mdDialog, FB, $rootScope) {

  $scope.user;
  $scope.leaders;
  $scope.profileId;
  $scope.scores = [[],[]];
  $scope.labels = [];
  $scope.wednesday = false;
  $scope.isUser = false;
  $scope.isPositive = false;
  $scope.changeDisplay;
  $scope.reportUser = [];

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

        if ($scope.user.last_week_actual_social_change !== "0%") {
          $scope.changeDisplay = Number($scope.user.last_week_actual_social_change).toFixed(2);
        } else if ($scope.user.last_week_actual_social_change === "0%") {
          $scope.changeDisplay = 0;
        }
        if ($scope.changeDisplay >= 0) {
          $scope.changeDisplay = "+ " + $scope.changeDisplay.toString();
          $scope.isPositive = true;
          console.log("is it positive", $scope.isPositive)
        } else if ($scope.changeDisplay < 0) {
          $scope.changeDisplay = $scope.changeDisplay.toString();
        }
        var date = new Date();
        console.log("ID's",$scope.user.id,$rootScope.loggedinUserInfo.id)
        if (date.getDay() === 3) {
          $scope.wednesday = true;
        } else if ($scope.user.id === $rootScope.loggedinUserInfo.id) {
          $scope.isUser = true;
        }
        $scope.getScores();
        $scope.reportUser.push("Current score is: " + $scope.user.currentScore);
        $scope.reportUser.push("Social score is: " + $scope.user.social);
        $scope.reportUser.push("Expected social change was: " + $scope.user.last_week_expected_social_change);
        $scope.reportUser.push("Actual social change was: " + $scope.user.last_week_actual_social_change);
        $scope.reportUser.push("Next week expected social change is: " + $scope.user.next_week_expected_social_change);
        console.log("here is the report user", $scope.reportUser, typeof $scope.reportUser);
      })
  }
  //<h3> Profile Graph Functions </h3>
  // getScores grabs all scores associated with the profile id
  $scope.getScores = function () {
    $scope.series = ["Total Score", "Social Score"];

    Scores.getScores($scope.profileId)
    .then(function (results) {
      for(var i = 0; i < results.length; i++){
        var scoreObj = results[i];
        // if the actual user OR if it's wednesday (day to reveal social scores), show both total/current score AND social score
        if ($scope.isUser === true || $scope.wednesday) {
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
        user: $scope.user,
        reportUser: $scope.reportUser
      },
      controller: ReportModalController
    })
      .then(function(clickedItem) {
      })
  }

  //<h3> Buy Modal Controller </h3>
  function BuyModalController($scope, $mdDialog, profile, TransactionHist, Portfolio, Socket, Scores) {

    $scope.profile = profile;
    $scope.score = $rootScope.loggedinUserInfo.currentScore;
    $scope.sharesToBuy = 0;
    $scope.buyingOneShare = $scope.sharesToBuy <= 1;
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
      if ($rootScope.loggedinUserInfo.karma < $scope.profile.currentScore * $scope.sharesToBuy) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        //Presented with wait and buyDirect options if user attempts to buy more shares than are currently available for buy
        //in the transaction queue
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
      //Prevents users from buying more karma than they can afford
      if ($rootScope.loggedinUserInfo.karma < $scope.profile.currentScore * ($scope.sharesToBuy - transaction.numberShares)) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        //Buys the available shares and places the remaining shares in the transaction queue
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
      //Prevents users from buying more karma than they can afford
      if ($rootScope.loggedinUserInfo.karma < $scope.profile.currentScore * $scope.availableShares + newScore*($scope.sharesToBuy - $scope.availableShares)) {
        $scope.errorMessage = true;
      } else {
        $scope.errorMessage = false;
        if ($scope.availableShares) {
          //buys available shares
          TransactionHist.makeTransaction(transaction).then(function() {
            //makes sure the transaction is actually finished before updating the transaction and closing the request
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
    //Returns the number of shares available (sell requests) that the user can buy.
    $scope.checkSharesAvail = function() {
      TransactionHist.checkSharesAvail($scope.profile.id, 'sell').then(function(response){
        $scope.availableShares = response[0];
        $scope.availableSharesInfo = response[1][0];
      });
    }

    //Exit closes the Buy modal
    $scope.exit = function() {
      $mdDialog.hide();
    }
  }

  //<h3> ReportModalController Function </h3>
  function ReportModalController($scope, $mdDialog, user, reportUser) {
    $scope.user = user;
    $scope.reportUser = reportUser;

    //Exit closes the Report modal
    $scope.exit = function() {
      $mdDialog.hide();
    }
  }
  var currentPath = $location.path();
  currentPath = currentPath.split("");
  $scope.profileId = currentPath.splice(9).join("");
  $scope.getUserById($scope.profileId);
  $scope.addLabels(30);
});
