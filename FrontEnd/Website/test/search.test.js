var request = require('supertest');
var app = require('../app');


// Pings the search page GET function to make sure it responds properly (200 response)
describe("search", function () {
	it("GET response - Search page", function(done) {
		request(app).get("/search")
			.expect(200, done);
	});
});
