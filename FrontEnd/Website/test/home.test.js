var request = require('supertest');
var app = require('../app');


// Pings the home page GET function to make sure it responds properly (200 response)
describe("home", function () {
	it("GET response - Home page", function(done) {
		request(app).get("/")
			.expect(200, done);
	});
});
