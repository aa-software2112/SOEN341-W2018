var request = require('supertest');
var app = require('../app');

// Checks the vote form to ensure that it properly POSTs the vote value to the server asnd DB
describe("VOTE", function () {

	// Checks to make sure that the vote functionality works for the question answers
	it("Answer Vote - Sends form data across server and into DB ", function(done) {
		request(app).post("/vote/answer-vote")
			.send({user_id: "1", answer_id: "1", vote : "1"})
			.expect(200, done);
  });

	// Checks to make sure that the vote functionality works on the questions
	it("Question Vote - Sends form data across server and into DB ", function(done) {
		request(app).post("/vote/question-vote")
			.send({user_id: "1", question_id: "1", vote : "1"})
			.expect(200, done);
	});

});
