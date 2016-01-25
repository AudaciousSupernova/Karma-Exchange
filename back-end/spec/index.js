var chai = require('chai');
var expect = chai.expect; 
var sinon = require('sinon'): 
// var oAuth = require('../Auth/passport.facebook.js');
var db = require('../db/index.js'); 

describe("REST-API routes", function() {

	before(function() {
		// stub will bypass oAuth middleware
		var ensureAuthenticatedSpy = sinon.stub(oAuth, 'ensureAuth');
	})
})

