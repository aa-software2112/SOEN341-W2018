var request = require('supertest');
var app = require('../app');


// Pings the search page GET function to make sure it responds properly (200 response)
describe("search", function () {
	it("Search page functionality", function(done) {
		request(app).get("/search/search_on/?search=test")
			.expect(200, done);
	});
});

