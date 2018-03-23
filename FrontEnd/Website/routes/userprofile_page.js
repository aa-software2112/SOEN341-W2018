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

/** 
* ---------------------------------------------------------------------------
* The user shall be able to see his activity from the user profile page: 
*
* > The list of questions he asked as he clicks on the questions tab. Note: 
*	Also, the userprofile page is by default, on the questions tab.
* 	http://localhost:3000/user_profile?tab=questions
*
* > The list of answers he provided on the answers tab. 
*
* > Personal information: Username, first and last name, date of birth and country.
* > His activity: # of questions and answers 
*
* The user shall be able to see the user profile of another user. 
*
* ---------------------------------------------------------------------------
*/

/** 
* ---------------------------------------------------------------------------
* Queries to prevent duplicates.
* ---------------------------------------------------------------------------
*/

// Return an array of the user's questions
var queryUserQuestions = "SELECT question.question_title, question.question_id, question.question_body, " +
" (SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, " +
" (SELECT COUNT(*) FROM answer WHERE question_id=question.question_id AND answer.user_id=?) AS num_answers, datetime_asked " +
" FROM question " +
" WHERE question.user_id = ? " + 
" ORDER BY datetime_asked DESC;"

// Return an array of the user's answers. 
var queryUserAnswers = "	SELECT question.question_title AS question_title, question.question_id AS question_id, " +
" answer.answer_id, answer.answer_body, datetime_answered, " +
" (SELECT COUNT(*) FROM answer WHERE question_id=question.question_id AND answer.user_id=?) AS num_answers, datetime_answered " +
" FROM answer JOIN question ON question.question_id=answer.question_id " +
" WHERE answer.user_id = ? " +
" ORDER BY datetime_answered DESC;"

// Return an array of the user personal information. Index 0 will be use. 
var queryUser = "SELECT user.username, user.first_name, user.last_name, user.birth_date, user.country, user.gender " +
" FROM user WHERE user.user_id=?;"

var loginChecker = require('../public/scripts/login_check').loginChecker;


/** 
* ---------------------------------------------------------------------------
* Allows for two cases: 
* The user profile of the user who's currently log in using 
* > router.get('/', (req, res) => { ... }
* 
*  Or the user profile of another user using route
* > router.get('/:u_id', (req, res) => { ... }
*
* Both case shall allow access to one's user profile whether he's log in or not.
* ---------------------------------------------------------------------------
*/


router.get(['/','/:u_id'],
(req, res) => {
	
	// Checks whether the queries should use the user_id of a user who's currently log in, or to visit 
	// the profile of another user. 
	var userIdTest = req.params.u_id;
	var userIdCheck = ' ';
	
	if (!isNaN(userIdTest)) {
		userIdCheck = userIdTest; // user_id from URL
	} else {
		userIdCheck = req.session.user_id; // user_id from cookie	
	};
	
	// Return the user's personal information. 
	db.query (queryUser, [userIdCheck], function (err, resultUserInfo) {
		var output = ' ';
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
		} else {
			
			/** 
			* ---------------------------------------------------------------------------
			* The req.query method contains the URL query parameters (after the ? in the URL).
			* Checks which tab the user chose, as the data will be output to user_profile_questions.ejs
			* 	or user_profile_answers.ejs depending on the tab.
			* 
			* The user should be able to see all the questions he asked as he clicks on the questions tab
			* http://localhost:3000/user_profile?tab=questions
			*
			* or from another user.
			* http://localhost:3000/:id/user_profile?tab=questions
			* ---------------------------------------------------------------------------
			*/
			
			// Redirects the user to the questions tab. While only the query for the list of questions is required, 
			// the user should also see the number of answers he provided, hence the use of the query for the list
			// of answers. 
			if (!req.query.tab || req.query.tab === 'questions') { 
				
				db.query(queryUserQuestions, [userIdCheck, userIdCheck],function (err, resultQuestion) {
					if (err) {
						res.status(500).json({"status_code": 500,"status_message": "internal server error"});
					} else {
						
						db.query(queryUserAnswers, [userIdCheck, userIdCheck],function (err, resultAnswer) {
							if (err) {
								res.status(500).json({"status_code": 500,"status_message": "internal server error"});
							} else {
								// Prevents the app from crashing if the user's activity is blank. Return an empty object
								if (resultQuestion.length == 0 && resultAnswer.length == 0) {
									
									output = {
										
										user_profile_info: {
											userName: resultUserInfo[0].username,
											user_firstName: resultUserInfo[0].first_name,
											user_lastName: resultUserInfo[0].last_name,
											user_birthDate: resultUserInfo[0].birth_date,
											user_country: resultUserInfo[0].country,
											user_gender: resultUserInfo[0].gender								
										},
										
										user_activity: {
											numberOfQuestions: resultQuestion.length,
											numberOfAnswers: resultAnswer.length
										},
										
										user_questions: {
											user_question_list:
											(function() {
												var userQuestionList = [];
												var numOfQuestions =  resultQuestion.length;
												
												for (var i = 0; i < numOfQuestions; i++) {
													
													var questions = {
														questionID: ' ',
														questionTitle: ' ',
														questionBody: ' ',
														numOfVotes: ' ',
														numOfAnswers: ' ',
														date_ans: ' '				
													}
													
													userQuestionList.push(questions);
												}			
												
												return userQuestionList
											})()
										}			
									}
									// Else the user's activity information is stored in the object output, in order to be
									// rendered to the .ejs file.
								} else {
									
									output = {
										user_profile_info: {
											userName: resultUserInfo[0].username,
											user_firstName: resultUserInfo[0].first_name,
											user_lastName: resultUserInfo[0].last_name,
											user_birthDate: dateFormat(resultUserInfo[0].birth_date, "fullDate"),
											user_country: resultUserInfo[0].country,
											user_gender: resultUserInfo[0].gender								
										},
										user_activity: {
											numberOfQuestions: resultQuestion.length,
											numberOfAnswers: resultAnswer.length
										},
										
										user_questions: {
											user_question_list:
											(function() {
												var userQuestionList = [];
												var numOfQuestions = resultQuestion.length;
												
												for (var i = 0; i < numOfQuestions; i++) {
													
													var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
													var d = (new Date(resultQuestion[i].datetime_asked  - timezoneOffset)).toISOString().split("T");
													d = d[0] + " - " + d[1].split("Z")[0].slice(0, -4);
													
													var questions = {
														questionID: resultQuestion[i].question_id,
														questionTitle: resultQuestion[i].question_title,
														questionBody: resultQuestion[i].question_body,
														numOfVotes: resultQuestion[i].num_votes,
														numOfAnswers: resultQuestion[i].num_views,
														date_ans: d				
													}
													
													userQuestionList.push(questions);
												}			
												
												return userQuestionList
											})()
										}									
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
				* ---------------------------------------------------------------------------
				*/
			} else if (req.query.tab === 'answers') {
				
				db.query(queryUserAnswers, [userIdCheck, userIdCheck], function (err, resultQuestion) {
					if (err) {
						res.status(500).json({"status_code": 500,"status_message": "internal server error"});
					} else {
						
						db.query(queryUserQuestions, [userIdCheck, userIdCheck],function (err, resultAnswer) {
							if (err) {
								res.status(500).json({"status_code": 500,"status_message": "internal server error"});
							} else {
								
								if (resultQuestion.length == 0 && resultAnswer.length == 0) 
								{
									output = {
										user_profile_info: {
											userName: resultUserInfo[0].username,
											user_firstName: resultUserInfo[0].first_name,
											user_lastName: resultUserInfo[0].last_name,
											user_birthDate: resultUserInfo[0].birth_date,
											user_country: resultUserInfo[0].country,
											user_gender: resultUserInfo[0].gender								
										},
										
										user_activity: {
											numberOfQuestions: resultQuestion.length,
											numberOfAnswers: resultAnswer.length
										},
										
										user_answers: {
											user_answer_list:
											(function() {
												var userAnswerList = [];
												var numOfAnswers = resultQuestion.length;
												
												for (var i = 0; i < numOfAnswers; i++) {
													
													var answers = {
														questionID: ' ',
														questionTitle: ' ',
														answerID: ' ',
														answerBody: ' ',			
														numOfAnswers: ' ',
														date_ans: ' '							
													}
													userAnswerList.push(answers);
												}			
												
												return userAnswerList
											})()
										}	
									}
								} else {
									
									output = {
										user_profile_info: {
											userName: resultUserInfo[0].username,
											user_firstName: resultUserInfo[0].first_name,
											user_lastName: resultUserInfo[0].last_name,
											user_birthDate: dateFormat(resultUserInfo[0].birth_date, "fullDate"),
											user_country: resultUserInfo[0].country,
											user_gender: resultUserInfo[0].gender								
										},
										user_activity: {
											numberOfQuestions: resultAnswer.length,
											numberOfAnswers: resultQuestion.length
										},
										
										user_answers: {
											user_answer_list:
											(function() {
												var userAnswerList = [];
												var numOfAnswers = resultQuestion.length;
												
												for (var i = 0; i < numOfAnswers; i++) {
													
													var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
													var d = (new Date(resultQuestion[i].datetime_answered  - timezoneOffset)).toISOString().split("T");
													d = d[0] + " - " + d[1].split("Z")[0].slice(0, -4);
													
													var answers = {
														questionID: resultQuestion[i].question_id,
														questionTitle: resultQuestion[i].question_title,
														answerID: resultQuestion[i].answer_id,
														answerBody: resultQuestion[i].answer_body,			
														numOfAnswers: resultQuestion[i].num_answers,
														date_ans: d							
													}
													
													userAnswerList.push(answers);
												}			
												
												return userAnswerList
											})()
										}									
									}
								}
								
								res.render('user_profile_answers.ejs', {userprofile: output});
							};
						});
					};	
				});
			}
		};
		
	});
});

module.exports = router;