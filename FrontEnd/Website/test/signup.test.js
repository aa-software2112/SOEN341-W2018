var request = require('supertest');
var app = require('../app');


// Pings the sign up page GET function to make sure it responds properly
describe("SIGN UP", function () {
	it("Sign up page is reachable and renders", function(done) {
		request(app).get("/sign_up")
			.expect(200, done);
	});

		// Checks to ensure that form data is being sent over the server
	it("Sign up page sends form data across server and to the DB", function(done) {
		request(app).post("/sign_up")
			.send({fName: "First", lName: "last", uName: "Tester", email: "testing@test.ca", password: "Test12", country: "Canada", 
			year: "1905", month: "10", day: "12", gender: "M" })
			.expect(200, done);
	});
	

});
