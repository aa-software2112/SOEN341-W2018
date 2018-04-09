var request = require('supertest');
var app = require('../app');


describe("LOGIN PAGE", function () {
	// Pings the login page GET function to make sure it responds properly (200 response)
	it("Login page is reachable and renders", function(done) {
		request(app).get("/login")
			.expect(200, done);
	});

	// Tests if the login page form posts its data on the server and login works (302 response)
	it("Valid User - Login page sends form data across server and to the cookie", function(done) {
		request(app).post("/login")
		.send({email: "test@test.ca", password: "Test12"})
		.expect(302, done);
	});

	// Tests if the login page form posts its data on the server and login does not work (302 response)
	it("Invalid User - Login page sends form data across server and to the cookie", function(done) {
		request(app).post("/login")
		.send({email: "doesnotexist@test.ca", password: "Test12"})
		.expect(200, done);
	});
});
