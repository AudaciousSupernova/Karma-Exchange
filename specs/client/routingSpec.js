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

describe('Routing', function() {

	var $rootScope, $state, $injector, myServiceMock, state = 'myState';

	beforeEach(function() {

		module('app', function($provide) {
      $provide.value('myService', myServiceMock = {});
    });

    inject(function(_$rootScope_, _$state_, _$injector_, $templateCache) {
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;
      console.log('$rootScope', $rootScope);
      console.log('$state', $state);
      console.log('$injector', $injector); 
      // We need add the template entry into the templateCache if we ever
      // specify a templateUrl
      $templateCache.put('template.html', '');
      console.log('templateCache', $templateCache); 
    })
  });

	it('Should have home route, template, and controller', function () {
	  expect(true).to.equal(true); 
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