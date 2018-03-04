var request = require('supertest');
var app = require('../app');


// Pings the user profile page GET function to make sure it responds properly (200 response)
describe("user profile", function () {
	it("GET response - User Profile page", function(done) {
		request(app).get("/userprofile_page")
			.expect(200, done);
	});
});
