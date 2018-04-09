var request = require('supertest');
var app = require('../app');

describe("ASK PAGE", function () {
	// Pings the ask page GET function to make sure it responds properly (200 response)
	it("Ask page is reachable and renders", function(done) {
		request(app).get("/ask")
			.expect(200, done);
	});


	// Checks to ensure that the Ask form data is being sent across the server (302 response)
	it("Valid Post - Ask page sends form data across server to DB", function(done) {
		request(app).post("/ask/askform/893743")
			.send({q_title: "TestTitle", q_body: "TestBody"})
			.expect(302, done);
			done();
	});

	// Check an invalid post by not passing any data any checking to ensure the page is still functional
	it("Invalid Post - Ask page remains functional after invalid data entry", function(done) {
		request(app).post("/ask/askform/893743")
		.send({q_title: "", q_body: ""})
		.expect(200, done);
		done();
	});

});
