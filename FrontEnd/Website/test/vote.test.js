var request = require('supertest');
var app = require('../app');

// Checks the vote form to ensure that it properly POSTs the vote value to the server asnd DB
describe("VOTE", function () {
	it("Sends form data across server and into DB ", function(done) {
		request(app).post("/vote/answer-vote")
			.send({user_id: "893743", answer_id: "31", vote: "1"})
			.expect(302);
			done();
	});
});
