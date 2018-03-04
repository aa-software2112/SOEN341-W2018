var request = require('supertest');
var app = require('../app');

describe("about", function () {
	it("can reach the about page", function(done) {
		request(app).get("/about")
			.expect(200, done);
	});
});
