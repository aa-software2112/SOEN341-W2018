var request = require('supertest');
var app = require('../app');


// Pings the sign up page GET function to make sure it responds properly (200 response)
describe("sign up", function () {
	it("GET response - Sign Up page", function(done) {
		request(app).get("/sign_up")
			.expect(200, done);
	});
});
