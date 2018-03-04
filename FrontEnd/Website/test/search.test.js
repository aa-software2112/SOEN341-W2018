var request = require('supertest');
var app = require('../app');


// Pings the search page GET function to make sure it responds properly (200 response)
// Test expected to fail at the moment since it can only be reached once a search is initiated
describe("search", function () {
	it("GET response - Search page (Expected Fail)", function(done) {
		request(app).get("/search")
			.expect(200, done);
	});
});
