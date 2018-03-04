var request = require('supertest');
var app = require('../app');


// Pings the contact page GET function to make sure it responds properly (200 response)
describe("contact", function () {
	it("GET response - Contact page", function(done) {
		request(app).get("/contact")
			.expect(200, done);
	});
});
