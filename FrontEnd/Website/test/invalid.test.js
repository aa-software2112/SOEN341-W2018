var request = require('supertest');
var app = require('../app');


// Pings the invalid page GET function to make sure it responds properly (200 response)
describe("invalid", function () {
	it("GET response - Invalid page", function(done) {
		request(app).get("/badURL")
			.expect(200, done);
	});
});
