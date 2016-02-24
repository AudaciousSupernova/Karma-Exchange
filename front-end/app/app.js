//<h3>Dependencies</h3>


angular.module('app', [
  'app.profile',
  'app.portfolio',
  'app.auth',
  'ngRoute',
  'ui.router',
  'app.services',
  'app.index',
  'app.transactionHist',
  'ngMaterial',
  'chart.js',
  'md.data.table'
  ])

//<h3>Angular Charts Config</h3>

//Set the color and line style for the charts
.config(['ChartJsProvider', function (ChartJsProvider) {
  // Configure all charts
  ChartJsProvider.setOptions({
    colours: ['#FF5252', '#00ff00'],
    // responsive: false
  });
  // Configure all line charts
  ChartJsProvider.setOptions('Line', {
    // datasetFill: false
  });
}])

//<h3>State Provider</h3>

//Provides a state at each url, and designates an Angular controller for each view
.config(function ($routeProvider, $stateProvider, $sceProvider, $urlRouterProvider) {

  $stateProvider
    //Home
    .state('home', {
      url: '/',
      templateUrl: 'app/views/auth.html',
      controller: 'AuthController',
      authenticate: true
    })
    //Profile
    .state('profile', {
      url: '/profile/:id',
      templateUrl: 'app/views/profile.html',
      controller: 'ProfileController',
      authenticate: true
    })
    //Buy
    .state('buy', {
      templateUrl: 'app/views/buy.html',
      controller: 'BuyController',
    })
    //Sell
    .state('sell', {
      templateUrl: 'app/views/sell.html',
      controller: 'SellController',
    })
    //Portfolio
    .state('portfolio', {
      url: '/portfolio/:id',
      templateUrl: 'app/views/portfolio.html',
      controller: 'PortfolioController',
      authenticate: true
    })
    //Privacy
    .state('privacy',{
      url: '/privacy',
      templateUrl: 'privacy.html',
      authenticate: false
    })
    //Terms of Service
    .state('termsOfService',{
      url: '/tos',
      templateUrl: 'termsOfService.html',
      authenticate: false
    })
    //User Support
    .state('userSupport',{
      url: '/usersupport',
      templateUrl: 'userSupport.html',
      authenticate: false
    })
    //Transaction History
    .state('transactionHist',{
      url: '/transactionhist/:id',
      templateUrl: 'app/views/transactionHist.html',
      controller: 'TransactionHistController',
      authenticate: false
    })
  $urlRouterProvider.otherwise('/')
})

//<h3>Authentication Check</h3>

//Runs an authentication check to make sure user is logged in
.run(function ($rootScope, $state, Auth) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    Auth.checkLoggedIn().then(function(loggedIn){
      if (toState.authenticate && !loggedIn) {
        // User isn’t authenticated
        $state.transitionTo("home");
        event.preventDefault();
      }

    })
  });
})
