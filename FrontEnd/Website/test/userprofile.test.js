var request = require('supertest');
var app = require('../app');


// Pings the user profile page GET function to make sure it responds properly (302 redirect response)
describe("user profile", function () {
	it("GET response - User Profile page", function(done) {
		request(app).get("/user_profile")
			.expect(302, done);
	});
});
