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

//<h3> app.js file that lists all the dependencies for this app along with all the states with corresponding views/controllers </h3>
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
  
.config(function ($routeProvider, $stateProvider, $sceProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/', 
      templateUrl: 'app/views/auth.html', 
      controller: 'AuthController',
      authenticate: true
    })
    .state('profile', {
      url: '/profile/:id', 
      templateUrl: 'app/views/profile.html', 
      controller: 'ProfileController',
      authenticate: true
    })
    .state('buy', {
      templateUrl: 'app/views/buy.html', 
      controller: 'BuyController',
    })
    .state('sell', {
      templateUrl: 'app/views/sell.html', 
      controller: 'SellController',
    })
    .state('portfolio', {
      url: '/portfolio/:id', 
      templateUrl: 'app/views/portfolio.html', 
      controller: 'PortfolioController',
      authenticate: true
    })
    .state('privacy',{
      url: '/privacy',
      templateUrl: 'privacy.html',
      authenticate: false
    })
    .state('termsOfService',{
      url: '/tos',
      templateUrl: 'termsOfService.html',
      authenticate: false
    })
    .state('userSupport',{
      url: '/usersupport',
      templateUrl: 'userSupport.html',
      authenticate: false
    })
    .state('transactionHist',{
      url: '/transactionhist/:id',
      templateUrl: 'app/views/transactionHist.html',
      controller: 'TransactionHistController',
      authenticate: false
    })
  $urlRouterProvider.otherwise('/')
})

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