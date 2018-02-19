var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');
var sortBy = require('sort-by');

// Database connection
const mysql = require('mysql');
var db = require('../database/database');


router.get(['/', '/home'], (req, res) => {
	
	
	var sql = "SELECT question.question_title, user.username AS asked_by, answer.answer_body AS answers, \
	(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, \
	(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
	datetime_asked \
	FROM question JOIN user ON question.user_id=user.user_id JOIN answer ON question.user_id=answer.user_id \
	WHERE (answer.question_id is NOT NULL) OR (answer.question_id IS NULL) \
	ORDER BY datetime_asked DESC \
	LIMIT 10;";
	
	var query_popular = "SELECT question.question_title, user.username AS asked_by, answer.answer_body AS answers, \
	(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, \
	(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
	datetime_asked \
	FROM question JOIN user ON question.user_id=user.user_id JOIN answer ON question.user_id=answer.user_id \
	ORDER BY num_votes DESC \
	LIMIT 10;"
	
	db.query(sql, function (err, result) {
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
		} else {
			
			console.log(result);
			
		const output = {
				/*
				* ---------------------------------------------------------------------------
				* > Object newest
				* username, question, # of votes, # of answers, # of views, date and time
				* ---------------------------------------------------------------------------
				*/
				
				newest: {
					newest_question_list:
					(function() {
						var newestQuestionList = [];
						var num_of_questions = 10;
						
						for (var i = 0; i < num_of_questions; i++) {
							var questions = {
								userName: result[i].asked_by,
								question: result[i].question_title,
								numOfVotes: result[i].num_votes,
								numOfAnswers: result[i].num_views,
								date_ans: result[i].datetime_asked							
							}
							newestQuestionList.push(questions);
						}						
						return newestQuestionList
					})()
				},
				
				/** 
				* ---------------------------------------------------------------------------
				* > Object newest
				* ---------------------------------------------------------------------------
				*/
				popular: {
					popular_question_list:
					(function() {
						popularQuestionList = [];
						var num_of_questions = 10;
						for (var i = 0; i < num_of_questions; i++)
						popularQuestionList.push(
							{
								userName: (function() {
									var text = "";
									var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
									
									for (var i = 0; i < 5; i++)
									text += possible.charAt(Math.floor(Math.random() * possible.length));
									
									return text;
								})(),
								question: (function() {
									var text = "";
									var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
									
									for (var i = 0; i < 200; i++)
									text += possible.charAt(Math.floor(Math.random() * possible.length));
									
									return text;
								})(),
								numOfVotes: Math.floor(Math.random() * 100), 
								numOfAnswers: Math.floor(Math.random() * 100),
								numOfViews: Math.floor(Math.random() * 100),
								date_ans: date.format(new Date(), 'DD/MM/YYYY'),
								time_ans: date.format(new Date(), 'h:m A').toUpperCase()
							}
						);
						popularQuestionList.sort(sortBy('-numOfVotes'));
						return popularQuestionList
					})()
				}
				
			}
			res.render('homepage.ejs', {homepage: output});
		};	
		// Populate the homepage.ejs file with the output object.
	});
});

module.exports = router;