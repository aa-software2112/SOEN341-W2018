/** <<<<<<<<<<<<<<< User profile page >>>>>>>>>>>>>>
* ============================================================================
* The user should have the ability to access his profile, which contains the 
* information he provided during registration, as well as the list of questions 
* he asked and the answers he provided.
* ============================================================================
*/

var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var url = require('url');
var dateFormat = require('dateformat');


// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/*
* ---------------------------------------------------------------------------
* The user should be able to see the list of questions he asked as he clicks on the 
* answers tab. Also, the userprofile page is by default, on the questions tab.
* http://localhost:3000/user_profile?tab=questions
*
* -> The req.query method contains the URL query parameters (after the ? in the URL).
* -> TO DO: The user_id should not be hard coded.
* ---------------------------------------------------------------------------
*/
var loginChecker = require('../public/scripts/login_check').loginChecker;

// Redirects user to home IF they are not logged in
// and attempt to access the user_profile link manually via URL.
router.get('/', loginChecker('/home'), 
	(req, res) => {
	
	if(!req.query.tab || req.query.tab === 'questions') { 
		
		var output = ' ';
		
		var query_user_questions = "SELECT question.question_title, question.question_id, question.question_body,\
		(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, \
		(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
		(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id AND answer.user_id=24776) AS num_answers, datetime_asked \
		FROM question \
		WHERE question.user_id=24776 \
		ORDER BY datetime_asked DESC;"
		
		db.query(query_user_questions, function (err, result) {
			if (err) {
				res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			} else {
				var query_user = "SELECT user.username, user.first_name, user.last_name, user.birth_date, user.country \
				FROM user  \
				WHERE user.user_id=24776;"
				
				db.query(query_user, function (err, result1) {
					if (err) {
						res.status(500).json({"status_code": 500,"status_message": "internal server error"});
					} else {
						
						output = {
							/*
							* ---------------------------------------------------------------------------
							* The output object contains two objects:
							* -> user_profile_info: Return the first element of the array.
							*	>> username, first name, last name, birth date, and country
							* -> user_questions: Return an array of questions asked by the user.
							*	>> question id, question title, question body, # of votes and answers (?), 
							*	   and asked date
							*
							* The list of questions is ordered by the newest ones.
							* ---------------------------------------------------------------------------
							*/
							user_profile_info: {
								userName: result1[0].username,
								user_firstName: result1[0].first_name,
								user_lastName: result1[0].last_name,
								user_birthDate: dateFormat(result1[0].birth_date, "fullDate"),
								user_country: result1[0].country								
							},
							
							user_questions: {
								user_question_list:
								(function() {
									var userQuestionList = [];
									var num_of_questions = 10;
									
									for (var i = 0; i < num_of_questions; i++) {
										var questions = {
											questionID: result[i].question_id,
											questionTitle: result[i].question_title,
											questionBody: result[i].question_body,
											numOfVotes: result[i].num_votes,
											numOfAnswers: result[i].num_views,
											date_ans: dateFormat(result[i].datetime_asked)				
										}
										userQuestionList.push(questions);
									}			
									
									return userQuestionList
								})()
							}									
						}
						res.render('user_profile_questions.ejs', {userprofile: output});
					};
				});
			};	
		});
		
		/*
		* ---------------------------------------------------------------------------
		* The user should be able to see his answers as he clicks on the answers tab.
		* http://localhost:3000/user_profile?tab=answers
		*
		* -> The req.query method contains the URL query parameters (after the ? in the URL).
		* ---------------------------------------------------------------------------
		*/
	} else if (req.query.tab === 'answers') {
		
		var output = ' ';
		
		var query_user_answers = "	SELECT DISTINCT question.question_title AS question_title, question.question_id AS question_id, \
		answer.answer_id, answer.answer_body, datetime_answered, \
		(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
		(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id AND answer.user_id=24776) AS num_answers, datetime_answered \
		FROM answer JOIN question ON question.question_id=answer.question_id \
		WHERE answer.user_id=24776 \
		ORDER BY datetime_answered DESC;"
		
		db.query(query_user_answers, function (err, result) {
			if (err) {
				res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			} else {
				var query_user = "SELECT user.username, user.first_name, user.last_name, user.birth_date, user.country \
				FROM user  \
				WHERE user.user_id=24776;"
				console.log(result)
				
				db.query(query_user, function (err, result1) {
					if (err) {
						res.status(500).json({"status_code": 500,"status_message": "internal server error"});
					} else {
						output = {
							/*
							* ---------------------------------------------------------------------------
							* The output object contains two objects:
							* -> user_profile_info: Return the first element of the array.
							*	>> username, first name, last name, birth date, and country
							* -> user_answers: Return an array of answers provided by the user. Since the 
							* 	 answers alone won't be much useful, the question to the answers is provided too
							*	>> question id, question title, answer body, # of votes and answers (?), 
							*	   and asked date
							* ---------------------------------------------------------------------------
							*/
							user_profile_info: {
								userName: result1[0].username,
								user_firstName: result1[0].first_name,
								user_lastName: result1[0].last_name,
								user_birthDate: dateFormat(result1[0].birth_date, "fullDate"),
								user_country: result1[0].country								
							},
							
							user_answers: {
								user_answer_list:
								(function() {
									var userAnswerList = [];
									var num_of_answers = 4;
									
									for (var i = 0; i < num_of_answers; i++) {
										var answers = {
											questionID: result[i].question_id,
											questionTitle: result[i].question_title,
											answerID: result[i].answer_id,
											answerBody: result[i].answer_body,			
											numOfAnswers: result[i].num_answers,
											date_ans: dateFormat(result[i].datetime_answered)								
										}
										userAnswerList.push(answers);
									}			
									
									return userAnswerList
								})()
							}									
						}
						res.render('user_profile_answers.ejs', {userprofile: output});
					};
				});
			};	
		});
	}
});

module.exports = router;