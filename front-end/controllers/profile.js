angular.module('app.profile', [])

	//<h3>Profile Controller</h3>

.controller('ProfileController', function($scope, $location, User, Auth, Root, Scores, $mdDialog) {

  $scope.isUser = true;
  $scope.user;
  $scope.leaders;
  $scope.loggedinUserInfo = "invalid";
  $scope.profileId;
  $scope.currentScore;
  $scope.scores;

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

  $scope.getUserById = function(id) {

    User.getUser(id)
      .then(function(data) {
        $scope.user = data[0];
        if ($scope.user.profil2e_photo === null) {
          $scope.user.profile_photo = "http://www.caimontebelluna.it/CAI_NEW_WP/wp-content/uploads/2014/11/face-placeholder-male.jpg";
        }
        console.log("What does my user look like?", $scope.user);
        console.log("Well here we are", $scope.user);
        $scope.getScores();
        //if id matches logged-in id
          //then call getLeaders
        //else
          //display buy shares button
      })
  }

  $scope.getScores = function () {
    console.log("what does my user contain", $scope.user);
    Scores.getScores($scope.user.id)
      .then(function (results) {
        console.log('I AM HERE');
        console.log(results, "Scores from Score factory");
        $scope.scores = results;
        console.log($scope.scores, 'scores in the profile controller');
      })
  }

  $scope.getLeaders = function() {
    User.getLeaderData()
      .then(function(data) {
        $scope.leaders = data;
      })
  }

  $scope.clickBuy = function() {
    $mdDialog.show({
      templateUrl: '../views/buy.html',
      locals: {
        profile: $scope.user,
        loggedinUserInfo: $scope.loggedinUserInfo
      },
      controller: BuyModalController
    })
      .then(function(clickedItem) {
        console.log(clickedItem, "this was clicked");
      })
  }

  function BuyModalController($scope, $mdDialog, profile, loggedinUserInfo, TransactionHist, Portfolio) {

    $scope.profile = profile;
    $scope.score = 89;
    $scope.loggedinUserInfo = loggedinUserInfo;
    $scope.sharesToBuy;
    console.log("logged in info", $scope.loggedinUserInfo);
    console.log("profile user info", $scope.profile);

    $scope.confirm = function() {

      var transaction = {
        user_id: $scope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        type: "buy",
        numberShares: $scope.sharesToBuy,
        karma: 90
      }

      var investment = {
        user_id: $scope.loggedinUserInfo.id,
        target_id: $scope.profile.id,
        numberShares: $scope.sharesToBuy
      }

      console.log("transaction", transaction);
      console.log($scope.profile.karma, 'karma')
      if ($scope.loggedinUserInfo.karma < $scope.score*transaction.numberShares) {
        console.log("NOT ENOUGH MONEY")
        $mdDialog.hide();
      } else {
        $scope.loggedinUserInfo.karma = $scope.loggedinUserInfo.karma - ($scope.score - transaction.numberShares);
        TransactionHist.addTransaction(transaction)
          .then(function(results) {
            Portfolio.addInvestment(investment)
              .then(function(results) {
                $mdDialog.hide();
              })
          })
      }
    }

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
    }
  })





  // if (!Auth.isAuth()) {
  //   $location.path('/signin');
  // } else {
  //   $scope.getQuestion();
  // }
});
