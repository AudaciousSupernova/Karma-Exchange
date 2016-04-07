// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'app.profile',
  'app.buy', 
  'app.sell', 
  'app.portfolio',
  'app.auth',
  'app.services', 
  'app.index', 
  'app.transactionHist',
  'app.tab',
  'chart.js',
  'ngCordovaOauth',
  'LocalStorageModule'
  ])


.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


  .config(['ChartJsProvider', function (ChartJsProvider) {
    // Configure all charts
    ChartJsProvider.setOptions({
      colours: ['#FF5252', '#00ff00'],
      responsive: false
    });
    // Configure all line charts
    ChartJsProvider.setOptions('Line', {
      // datasetFill: false
      enableInteractivity : false
    });
  }])
  .config(function ( $stateProvider, $sceProvider, $urlRouterProvider) {

  $stateProvider
    .state('tab', {
      url: '',
      abstract: true,
      templateUrl: 'js/views/tabs.html',
      controller: 'TabController'
    })
    .state('login', {
      url: '/', 
      templateUrl: 'js/views/auth.html', 
      controller: 'AuthController',
      // authenticate: true
    })
    .state('tab.profile', {
      url: '/profile/:id',
      views: {
        'profile': {
          templateUrl: 'js/views/profile.html', 
          controller: 'ProfileController',
        }
      } 
      // authenticate: true
    })
    .state('tab.portfolio', {
      url: '/portfolio/:id',
      views:{
        'portfolio':{
          templateUrl: 'js/views/portfolio.html', 
          controller: 'PortfolioController',
        }
      } 
      // authenticate: true
    })
    // .state('buy', {
    //   url: '/buy', 
    //   templateUrl: 'js/views/buy.html', 
    //   controller: 'BuyController',
    //   // authenticate: true
    // })
    // .state('sell', {
    //   url: '/sell', 
    //   templateUrl: 'js/views/sell.html', 
    //   controller: 'SellController',
    //   // authenticate: true
    // })
    .state('privacy',{
      url: '/privacy',
      templateUrl: 'privacy.html',
      // authenticate: false
    })
    .state('termsOfService',{
      url: '/tos',
      templateUrl: 'termsOfService.html',
      // authenticate: false
    })
    .state('userSupport',{
      url: '/usersupport',
      templateUrl: 'userSupport.html',
      // authenticate: false
    })
    // .state('transactionHist',{
    //   url: '/transactionhist/:id',
    //   templateUrl: 'js/views/transactionHist.html',
    //   controller: 'TransactionHistController',
    //   // authenticate: false
    // })
  $urlRouterProvider.otherwise('/')
})