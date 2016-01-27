describe('Routing', function() {
	var $route;
	beforeEach(module('app'));

	beforeEach(inject(function ($injector) {
		$route = $injector.get('$route');
		console.log('$route home');
	}));
	
});