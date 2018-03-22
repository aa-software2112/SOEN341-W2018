var request = require('supertest');
var app = require('../app');

describe("ASK PAGE", function () {
	// Pings the ask page GET function to make sure it responds properly (200 response)
	it("Ask page is reachable and renders", function(done) {
		request(app).get("/ask")
			.expect(200, done);
	});


	// Checks to ensure that the Ask form data is being sent across the server (302 response)
	it("Ask page sends form data across server to DB", function(done) {
		request(app).post("/ask/askform/1")
			.send({q_title: "TestTitle", q_body: "TestBody"})
			.expect(302, done);
	});
	
});
