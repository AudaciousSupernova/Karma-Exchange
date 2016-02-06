// describe('Routing', function() {
// 	var $state;
// 	beforeEach(module('app'));

// 	beforeEach(inject(function ($injector, $state) {
// 		$state = $injector.get('$state');
// 		console.log('$here i am!!!!!');
// 		console.log('$state', $state.url); 
// 	}));
	
//   it('Should have home route, template, and controller', function () {
// 	  expect(true).to.equal(true); 
// 	});

// });

// re-comment this back most likely! 
// describe('Routing', function() {

// 	var $rootScope, $state, $injector, myServiceMock, state = 'myState';

// 	beforeEach(function() {

// 		module('app', function($provide) {
//       $provide.value('myService', myServiceMock = {});
//     });

//     inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
//       $rootScope = _$rootScope_;
//       $state = _$state_;
//       $injector = _$injector_;
//       console.log('THIS IS $ROOTSCOPE:', $rootScope);
//       console.log('THIS IS $STATE:', $state);
//       console.log('THIS IS $INJECTOR:', $injector); 
//       // We need add the template entry into the templateCache if we ever
//       // specify a templateUrl
//       $templateCache.put('template.html', '');
//       console.log('THIS IS $TEMPLATECACHE:', $templateCache); 
//     })
//   });

// 	it('Should have home route, template, and controller', function () {
// 	  expect(true).to.equal(true); 
// 	});

// });
// end of re-comment section 

describe('Routing', function() {
  var homeState, newsfeedState, profileState, buyState, sellState, portfolioState, transactionHistState;

  beforeEach(module('app')); 

  beforeEach(inject(function ($state) {
    homeState = $state.get('home');
  }));

  it('Should have home route, template, and controller', function () {
    expect(homeState.name).to.be.defined; 
    expect(homeState.controller).to.equal('AuthController');
    expect(homeState.url).to.equal('/');
    expect(homeState.templateUrl).to.equal('app/views/auth.html');
  });

  beforeEach(inject(function ($state) {
    newsfeedState = $state.get('newsfeed');
  }));

  it('Should have newsfeed route, template, and controller', function () {
    expect(newsfeedState.name).to.be.defined; 
    expect(newsfeedState.controller).to.equal('NewsfeedController');
    expect(newsfeedState.url).to.equal('/newsfeed');
    expect(newsfeedState.templateUrl).to.equal('app/views/newsfeed.html');
  });

  beforeEach(inject(function ($state) {
    profileState = $state.get('profile');
  }));

  it('Should have profile route, template, and controller', function () {
    expect(profileState.name).to.be.defined; 
    expect(profileState.controller).to.equal('ProfileController');
    expect(profileState.url).to.equal('/profile/:id');
    expect(profileState.templateUrl).to.equal('app/views/profile.html'); 
  });

  beforeEach(inject(function ($state) {
    buyState = $state.get('buy');
  }));

  it('Should have buy route, template, and controller', function () {
    expect(buyState.name).to.be.defined; 
    expect(buyState.controller).to.equal('BuyController');
    expect(buyState.url).to.equal('/buy');
    expect(buyState.templateUrl).to.equal('app/views/buy.html'); 
  });

  beforeEach(inject(function ($state) {
    sellState = $state.get('sell');
  }));

  it('Should have sell route, template, and controller', function () {
    expect(sellState.name).to.be.defined; 
    expect(sellState.controller).to.equal('SellController');
    expect(sellState.url).to.equal('/sell');
    expect(sellState.templateUrl).to.equal('app/views/sell.html'); 
  });

  beforeEach(inject(function ($state) {
    portfolioState = $state.get('portfolio');
  }));

  it('Should have portfolio route, template, and controller', function () {
    expect(portfolioState.name).to.be.defined; 
    expect(portfolioState.controller).to.equal('PortfolioController');
    expect(portfolioState.url).to.equal('/portfolio/:id');
    expect(portfolioState.templateUrl).to.equal('app/views/portfolio.html'); 
  });

  beforeEach(inject(function ($state) {
    transactionHistState = $state.get('portfolio');
    console.log('transactionHistState', transactionHistState); 
  }));

  it('Should have transaction history route, template, and controller', function () {
    expect(transactionHistState.name).to.be.defined; 
    expect(transactionHistState.controller).to.equal('PortfolioController');
    expect(transactionHistState.url).to.equal('/portfolio/:id');
    expect(transactionHistState.templateUrl).to.equal('app/views/portfolio.html'); 
  });

}); 



// describe('myApp/myState', function() {

//   var $rootScope, $state, $injector, myServiceMock, state = 'myState';

//   beforeEach(function() {

//     module('myApp', function($provide) {
//       $provide.value('myService', myServiceMock = {});
//     });

//     inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
//       $rootScope = _$rootScope_;
//       $state = _$state_;
//       $injector = _$injector_;

//       // We need add the template entry into the templateCache if we ever
//       // specify a templateUrl
//       $templateCache.put('template.html', '');
//     })
//   });

//   it('should respond to URL', function() {
//     expect($state.href(state, { id: 1 })).toEqual('#/state/1');
//   });

//   it('should resolve data', function() {
//     myServiceMock.findAll = jasmine.createSpy('findAll').andReturn('findAll');

//     $state.go(state);
//     $rootScope.$digest();
//     expect($state.current.name).toBe(state);

//     // Call invoke to inject dependencies and run function
//     expect($injector.invoke($state.current.resolve.data)).toBe('findAll');
//   });
// });