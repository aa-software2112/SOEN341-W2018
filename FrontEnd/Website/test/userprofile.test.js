var request = require('supertest');
var app = require('../app');


// Pings the user profile page GET function to make sure it responds properly
describe("user profile", function () {
	it("GET response - User Profile page", function(done) {
		request(app).get("/user_profile/1")
			.expect(200, done);
	});
});
