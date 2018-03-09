var request = require('supertest');
var app = require('../app');

describe("Ask Page", function () {
	// Pings the ask page GET function to make sure it responds properly (200 response)
	it("GET response - Ask page", function(done) {
		request(app).get("/ask")
			.expect(200, done);
	});

	// Checks to ensure that the Ask form data is being sent across the server (302 response)
	it("POST data - Ask page (Expected Fail)", function(done) {
		request(app).post("/ask/askform/2")
			.send({q_title: "TestTitle", q_body: "TestBody"})
			.expect(302, done);
	});
});
