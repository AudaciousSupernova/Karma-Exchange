describe('Services', function() {
  beforeEach(module('app.services')); 

  afterEach(inject(function ($httpBackend) {
    $httpBackend.verifyNoOutstandingExpectation(false);
    $httpBackend.verifyNoOutstandingRequest();
  }));

  describe('User Factory', function() {
  	var $httpBackend, User; 

  	beforeEach(inject(function (_$httpBackend_, _User_) {
  		$httpBackend = _$httpBackend_;
  		User = _User_; 
  	}));

  	it('should exist', function() {
  	  expect(User).to.exist;
  	});

  	it('should have a method `getUser`', function() {
  		expect(User.getUser).to.be.a('function');
  	});

  	it('should have a method `getUserByPartial`', function() {
  		expect(User.getUserByPartial).to.be.a('function'); 
  	})

  	it('should get a user with `getUser`', function() {
  		var mockResponse = [{
  			name: "TomDickHarry",
  	    password: "oogabooga",
  	    email: "xyz@gmail.com",
  	    karma: 10,
  		  facebookKey: "1234",
  		  profile_photo: "blah",
  		  social: 5,
  		  social_subScores: "{friendScore:5,photoScore:5,feedScore:5}",
  		  social_investment_subScores: "{numShareHolder:0,sharesOnMarket:0,numTransactions:0}",
  		  last_week_expected_social_change: '0%',
  		  last_week_actual_social_change: '0%',
  		  next_week_expected_social_change: '0%',
  		  social_investment: 5,
  		  currentScore: 10,
  		  id: 2,
  		  access_token: "accesstoken"
		  }];

      $httpBackend.expect('GET', '/profile/2').respond(mockResponse);

      User.getUser(2).then(function(user) {
        console.log('user:', user); 
        expect(user[0].name).to.equal("TomDickHarry"); 
        expect(user[0].currentScore).to.equal(10); 
      });

      $httpBackend.flush(); 
  	});

  });

  describe('Portfolio Factory', function() {
    var $httpBackend, Portfolio; 

    beforeEach(inject(function (_$httpBackend_, _Portfolio_) {
      $httpBackend = _$httpBackend_;
      Portfolio = _Portfolio_; 
    }));

    it('should exist', function() {
      expect(Portfolio).to.exist;
    });

    it('should have a method `getInvestments`', function() {
      expect(Portfolio.getInvestments).to.be.a('function');
    });

    it('should have a method `addInvestment`', function() {
      expect(Portfolio.addInvestment).to.be.a('function'); 
    })

    it('should get a user investment with `getInvestments`', function() {
      var mockResponse = [{
        user_id: 4,
        target_id: 2,
        numberShares: 10
      }];

      $httpBackend.expect('GET', '/portfolio/4').respond(mockResponse);

      Portfolio.getInvestments(4).then(function(investment) {
        console.log('investment:', investment); 
        expect(investment[0].user_id).to.equal(4); 
      });

      $httpBackend.flush(); 
    });

  });

  describe('Auth Factory', function() {
    var $httpBackend, Auth; 

    beforeEach(inject(function (_$httpBackend_, _Auth_) {
      $httpBackend = _$httpBackend_;
      Auth = _Auth_; 
    }));

    it('should exist', function() {
      expect(Auth).to.exist;
    });

    it('should have a method `checkLoggedIn`', function() {
      expect(Auth.checkLoggedIn).to.be.a('function');
    });

    it('should check if a user is logged in with `checkLoggedIn`', function() {
      var mockResponse = [{
        name: "TomDickHarry",
        password: "oogabooga",
        email: "xyz@gmail.com",
        karma: 10,
        facebookKey: "1234",
        profile_photo: "blah",
        social: 5,
        social_subScores: "{friendScore:5,photoScore:5,feedScore:5}",
        social_investment_subScores: "{numShareHolder:0,sharesOnMarket:0,numTransactions:0}",
        last_week_expected_social_change: '0%',
        last_week_actual_social_change: '0%',
        next_week_expected_social_change: '0%',
        social_investment: 5,
        currentScore: 10,
        id: 2,
        access_token: "accesstoken"
      }];

      $httpBackend.expect('GET', '/api/loggedin').respond(mockResponse);

      Auth.checkLoggedIn().then(function(user) {
        console.log('user:', user); 
        expect(user).to.equal(true); 
      });

      $httpBackend.flush(); 
    });

  });

});

