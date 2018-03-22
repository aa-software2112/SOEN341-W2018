var request = require('supertest');
var app = require('../app');


// Pings the about page GET function to make sure it responds properly (200 response)
describe("ABOUT PAGE", function () {
	it("About page is reachable and renders", function(done) {
		request(app).get("/about")
			.expect(200, done);
	});
});
