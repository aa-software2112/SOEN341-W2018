var request = require('supertest');
var app = require('../app');


// Pings the sign up page GET function to make sure it responds properly
describe("SIGN UP", function () {
	it("Sign up page is reachable and renders", function(done) {
		request(app).get("/sign_up")
			.expect(200, done);
	});

		// Checks to ensure that form data is being sent over the server and sign up passes
	it("Valid Data - Sign up page sends form data across server and to the DB", function(done) {
		request(app).post("/sign_up")
			.send({fName: "First", lName: "last", uName: "Tester", email: "testing@test.ca", password: "Test12", country: "Canada",
			year: "1905", month: "10", day: "12", gender: "M" })
			.expect(200, done);
	});

	// Attempts sign up with the recently created values (which should be rejected)
	it("Existing User - Page remains functional after a failed sign up due to an existing user in DB", function(done) {
		request(app).post("/sign_up")
			.send({fName: "First", lName: "last", uName: "Tester", email: "test@test.ca", password: "Test12", country: "Canada",
			year: "1905", month: "10", day: "12", gender: "M" })
			.expect(200, done);
	});

	// Attempts to sign up with an empty form
	it("Invalid Data (empty form) - Page remains functional after a failed sign up due to empty form", function(done) {
		request(app).post("/sign_up")
			.send({fName: "", lName: "", uName: "", email: "", password: "", country: "",
			year: "", month: "", day: "", gender: "" })
			.expect(200, done);
	});

	// Attempts to sign up with invalid data (short password, bad email)
	it("Invalid Data - Page remains functional after a failed sign up due to invalid password and email", function(done) {
		request(app).post("/sign_up")
			.send({fName: "First", lName: "Last", uName: "Tester", email: "bademail", password: "badp", country: "Canada",
			year: "1900", month: "11", day: "21", gender: "F" })
			.expect(200, done);
	});


});
