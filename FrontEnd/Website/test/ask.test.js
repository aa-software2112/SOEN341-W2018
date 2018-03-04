var request = require('supertest');
var app = require('../app');


// Pings the ask page GET function to make sure it responds properly (200 response)
describe("ask", function () {
	it("GET response - Ask page", function(done) {
		request(app).get("/ask_page")
			.expect(200, done);
	});
});
