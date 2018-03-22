var request = require('supertest');
var app = require('../app');


// Pings the log out page GET function to make sure it redirects to the home page (302 response)
describe("LOG OUT", function () {
	it("Redirects to Home at log out", function(done) {
		request(app).get("/logout")
			.expect(302)
			.expect('location', /\/home/, done);
	});
});
