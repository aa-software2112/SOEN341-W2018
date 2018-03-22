var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');
var sortBy = require('sort-by');
var url = require('url');

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Homepage >>>>>>>>>>>>>>
* ============================================================================
* > homepage.ejs
* Listens for the question list request.
* Depending of the given tab.
* ============================================================================
*/


router.get(['/', '/home'], (req, res) => {
	
	if(!req.query.tab || req.query.tab === 'newest') { 
		
		var query_newest = "SELECT question.question_id, question.question_title, user.username AS asked_by, user.user_id, \
		(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, \
		(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
		datetime_asked \
		FROM question JOIN user ON question.user_id=user.user_id \
		ORDER BY datetime_asked DESC \
		LIMIT 10;";
		
		db.query(query_newest, function (err, result) {
			if (err) {
				res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			} else {
				
				var output;
				if (result.length == 0) 
				{
					output = {
						newest: {
							newest_question_list:
							(function() {
								var newestQuestionList = [];
								var num_of_questions = result.length;
								
								for (var i = 0; i < num_of_questions; i++) {
									
									var questions = {
										userName: ' ',
										questionTitle: ' ',
										numOfVotes: ' ',
										numOfAnswers: ' ',
										date_ans: ' '						
									}
									newestQuestionList.push(questions);
								}						
								return newestQuestionList
							})()
						}
					}
				} else {
					output = {
						
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
								var num_of_questions = result.length;
								
								for (var i = 0; i < num_of_questions; i++) {
																		
									var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
									var d = (new Date(result[i].datetime_asked  - timezoneOffset)).toISOString().split("T");
									d = d[0] + " - " + d[1].split("Z")[0].slice(0, -4);
									
									var questions = {
										questionID: result[i].question_id,
										userID: result[i].user_id,
										userName: result[i].asked_by,
										questionTitle: result[i].question_title,
										numOfVotes: result[i].num_votes,
										numOfAnswers: result[i].num_views,
										date_ans: d				
									}
									newestQuestionList.push(questions);
								}						
								return newestQuestionList
							})()
						}									
					}
				}
				res.render('homepage_newest.ejs', {homepage: output});
			};	
		});
		
	} else if (req.query.tab === 'popular') {
		var query_popular = "SELECT question.question_id, question.question_title, user.username AS asked_by, user.user_id, \
		(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, \
		(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
		datetime_asked \
		FROM question JOIN user ON question.user_id=user.user_id \
		ORDER BY num_votes DESC \
		LIMIT 10;";
		
		db.query(query_popular, function (err, result) {
			if (err) {
				res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			} else {
				var output; 
				
				if (result.length == 0)
				{
					output = {
						popular: {
							popular_question_list:
							(function() {
								var popularQuestionList = [];
								var num_of_questions = result.length;
								
								for (var i = 0; i < num_of_questions; i++) {
									var questions = {
										userName: ' ',
										questionTitle: ' ',
										numOfVotes: ' ',
										numOfAnswers: ' ',
										date_ans: ' '								
									}
									popularQuestionList.push(questions);
								}						
								return popularQuestionList
							})()
						},
					}
					
				} else {
					
					output = {
						/*
						* ---------------------------------------------------------------------------
						* > Object popular
						* username, question, # of votes, # of answers, # of views, date and time
						* ---------------------------------------------------------------------------
						*/
						
						popular: {
							popular_question_list:
							(function() {
								var popularQuestionList = [];
								var num_of_questions = result.length;
								
								for (var i = 0; i < num_of_questions; i++) {

									var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
									var d = (new Date(result[i].datetime_asked  - timezoneOffset)).toISOString().split("T");
									d = d[0] + " - " + d[1].split("Z")[0].slice(0, -4);
									
									var questions = {
										questionID: result[i].question_id,
										userID: result[i].user_id,
										userName: result[i].asked_by,
										questionTitle: result[i].question_title,
										numOfVotes: result[i].num_votes,
										numOfAnswers: result[i].num_views,
										date_ans: d							
									}
									popularQuestionList.push(questions);
								}						
								return popularQuestionList
							})()
						},
						
					}
				}
				res.render('homepage_popular.ejs', {homepage: output});
			};	
			
		});
	}
	
});

module.exports = router;

