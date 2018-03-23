var request = require('supertest');
var app = require('../app');

describe("CONTACT PAGE", function () {

	// Pings the contact page GET function to make sure it responds properly (200 response)
	it("Contact page is reachable and renders", function(done) {
		request(app).get("/contact")
			.send({firstname: "testFirst", lastname: "testLast", country: "Canada", subject: "testMessage" })
			.expect(200, done);
	});

	
	// Checks to ensure that form data is being sent over the server (302 response)
	it("Contact page sends form data across server and sends email", function(done) {
		request(app).post("/contact")
			.send({firstname: "testFirst", lastname: "testLast", country: "Canada", subject: "testMessage" })
			.expect(302, done);
	});

});
