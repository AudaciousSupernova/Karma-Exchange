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
  }));

  it('Should have transaction history route, template, and controller', function () {
    expect(transactionHistState.name).to.be.defined; 
    expect(transactionHistState.controller).to.equal('PortfolioController');
    expect(transactionHistState.url).to.equal('/portfolio/:id');
    expect(transactionHistState.templateUrl).to.equal('app/views/portfolio.html'); 
  });
  
}); 