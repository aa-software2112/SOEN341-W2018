var request = require('supertest');
var app = require('../app');


// Pings the login page GET function to make sure it responds properly (200 response)
describe("login", function () {
	it("GET response - Login page", function(done) {
		request(app).get("/login")
			.expect(200, done);
	});
});
