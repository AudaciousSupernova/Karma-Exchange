angular.module('app', [
  'app.profile',
  'app.newsfeed', 
  'app.buy', 
  'app.sell', 
  'app.portfolio',
  'app.auth',
  'ngRoute', 
  'ui.router', 
  'app.services'
  ])

.config(function ($routeProvider, $stateProvider, $sceProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/', 
      templateUrl: 'views/auth.html', 
      controller: 'AuthController'
    })
    .state('newsfeed', {
      url: '/newsfeed', 
      templateUrl: 'views/newsfeed.html', 
      controller: 'NewsfeedController'
    })
    .state('profile', {
      url: '/profile', 
      templateUrl: 'views/profile.html', 
      controller: 'ProfileController'
    })
    .state('buy', {
      url: '/buy', 
      templateUrl: 'views/buy.html', 
      controller: 'BuyController'
    })
    .state('sell', {
      url: '/sell', 
      templateUrl: 'views/sell.html', 
      controller: 'SellController'
    })
    .state('portfolio', {
      url: '/portfolio', 
      templateUrl: 'views/portfolio.html', 
      controller: 'PortfolioController'
    })
    .state('privacy',{
      url: '/privacy',
      templateUrl: 'privacy.html'
    })
    .state('termsOfService',{
      url: '/tos',
      templateUrl: 'termsOfService.html'
    })
    .state('userSupport',{
      url: '/usersupport',
      templateUrl: 'userSupport.html'
    })
  $urlRouterProvider.otherwise('/')
});