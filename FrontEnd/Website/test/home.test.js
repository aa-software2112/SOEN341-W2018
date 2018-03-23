var request = require('supertest');
var app = require('../app');


// Pings the home page GET function to make sure it responds properly (200 response)
describe("HOME", function () {
	it("Home page is reachable and renders", function(done) {
		request(app).get("/")
			.expect(200, done);
	});
});
