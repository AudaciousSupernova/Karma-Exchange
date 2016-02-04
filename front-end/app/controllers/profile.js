angular.module('app.profile', [])

	//<h3>Profile Controller</h3>

.controller('ProfileController', function($scope, $location, User, Auth, Root, Scores, $mdDialog, FB) {

  $scope.isUser = true;
  $scope.user;
  $scope.leaders;
  $scope.loggedinUserInfo = "invalid";
  $scope.profileId;
  $scope.loggedinUserInfo.currentScore = "No score currently";
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
      // console.log("What does my user look like?", $scope.user);
      // console.log("Well here we are", $scope.user);
      // $scope.getScores();
      //if id matches logged-in id
        //then call getLeaders
      //else
        //display buy shares button
      var date = new Date();
      if (date.getDay() === 2) {
        $scope.wednesday = true;
      } else if ($scope.user.id === $scope.loggedinUserInfo.id) {
        $scope.wednesday = true;
      }
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
        profile: $scope.user,
        loggedinUserInfo: $scope.loggedinUserInfo
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

  function BuyModalController($scope, $mdDialog, profile, loggedinUserInfo, TransactionHist, Portfolio) {

    $scope.profile = profile;
    $scope.score = loggedinUserInfo.currentScore;
    console.log("$scope.score", $scope.score);
    $scope.loggedinUserInfo = loggedinUserInfo;
    console.log("logged in user karma", $scope.loggedinUserInfo.karma);
    $scope.sharesToBuy;
    $scope.availableShares;
    $scope.revealOptions = false;

    $scope.confirm = function() {

      var transaction = {
        user_id: $scope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: 
        $scope.availableShares > $scope.sharesToBuy ? $scope.sharesToBuy : $scope.availableShares
      }

      var investment = {
        user_id: $scope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        numberShares: $scope.sharesToBuy
      }

      if ($scope.loggedinUserInfo.karma < $scope.score* $scope.sharesToBuy) {
        console.log("NOT ENOUGH MONEY")
        $mdDialog.hide();
      } else {

        if($scope.sharesToBuy > $scope.availableShares){
          $scope.revealOptions = true;

        } else {

          $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma - ($scope.score * transaction.numberShares);
          TransactionHist.makeTransaction(transaction)
            .then(function() {
              $mdDialog.hide();
            })         
        }
      }
    }

    $scope.wait = function() {

      var transaction = {
        user_id: $scope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: 
        $scope.availableShares > $scope.sharesToBuy ? $scope.sharesToBuy : $scope.availableShares
      }

      TransactionHist.makeTransaction(transaction).then(function()  {
        transaction.numberShares = $scope.sharesToBuy - transaction.numberShares; 
        TransactionHist.addTransactionToQueue(transaction);
      })      
      $mdDialog.hide();
    }

    $scope.buyDirect = function() { 
      var transaction = {
        user_id: $scope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: 
        $scope.availableShares
      }
      var newScore = Math.round($scope.profile.currentScore * 1.1); 

      if ($scope.availableShares) {
        TransactionHist.makeTransaction(transaction).then(function() {
          transaction.numberShares = $scope.sharesToBuy - transaction.numberShares; 
          TransactionHist.closeTransactionRequest(transaction, newScore); 
        })

      } else {
        transaction.numberShares = $scope.sharesToBuy; 
        TransactionHist.closeTransactionRequest(transaction, newScore);
      }
      $scope.loggedinUserInfo.karma -= $scope.profile.currentScore * $scope.availableShares + newScore * ($scope.sharesToBuy - $scope.availableShares);

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
      $scope.loggedinUserInfo = Root.currentUserInfo.data;

      var currentPath = $location.path();
      currentPath = currentPath.split("");
      $scope.profileId = currentPath.splice(9).join("");
      $scope.getUserById($scope.profileId);
      $scope.addLabels(30);
      $scope.getScores();
    }
  })
});
