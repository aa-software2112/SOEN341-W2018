var request = require('supertest');
var app = require('../app');


// Pings the user profile page GET function to make sure it responds properly
describe("USER PROFILE", function () {
	it("User profile page is reachable and renders", function(done) {
		request(app).get("/user_profile/2")
			.expect(200, done);
	});
});
