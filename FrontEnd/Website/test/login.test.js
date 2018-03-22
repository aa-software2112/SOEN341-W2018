var request = require('supertest');
var app = require('../app');


describe("Login Page", function () {
	// Pings the login page GET function to make sure it responds properly (200 response)
	it("GET response - Login page", function(done) {
		request(app).get("/login")
			.expect(200, done);
	});

	// Tests if the login page form posts its data on the server (302 response)
	it("Post data - Login page", function(done) {
		request(app).post("/login")
		.send({email: "test@test.ca", password: "Test12"})
		.expect(302, done);
	});
});
