var request = require('supertest');
var app = require('../app');


// Pings the sign up page GET function to make sure it responds properly
describe("sign up", function () {
	it("GET response - Sign Up page", function(done) {
		request(app).get("/sign_up")
			.expect(200, done);
	});




		// Checks to ensure that form data is being sent over the server
	it("POST data - Sign Up page", function(done) {
		request(app).post("/sign_up")
			.send({fName: "First", lName: "last", uName: "Tester", email: "testing@test.ca", password: "Test12", country: "Canada", 
			year: "1905", month: "10", day: "12", gender: "M" })
			.expect(200, done);
	});
	

});
