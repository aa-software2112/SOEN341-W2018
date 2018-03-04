var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Vote page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
* ============================================================================
*/


// This handles votes for answers ONLY
// see post below for question handler

/*This script is meant to find if user has already scored (voted) the answer + if not, post score to database, table score_answer. 
if voted -> console log  1 or -1. (1 means like, -1 means dislike).
If not voted -> console log  NULL & takes input from button to allow user to vote.
*/

router.post("/answer-vote", function(req, res) {
	
	var user_id = req.body.user_id;
	var answer_id = req.body.answer_id;
	
	// mysql.format https://stackoverflow.com/questions/35256272/using-variables-in-a-node-js-mysql-node-query
	var sql = "SELECT score FROM score_answer WHERE user_id = ? AND answer_id = ?";
	// Query check if user already exists
	
	db.query(sql, [user_id, answer_id], function(err, result)
	{
		if (err)
		{
			console.log("select score query failed " + err);
			return;
		}
		result = result[0]; // Get passed the array
		
		// already voted
		if (result.score == 1 || result.score == -1)
		{
			console.log("already voted this answer with a score of " + result.score);
			return;
		}
	
		// The email and username don't exist, signup succeeded
		else
		{
			
			//Array to fill in sql query below
			var newScoreAnswer = {
				
				score : Number(req.body.vote), //score is taken from button input ex: click button like gives 1, click button dislike gives -1
				user_id : Number(req.body.user_id), //taken from user session
				answer_id : Number(req.body.answer_id), //taken answer to which the button is found
				datetime_scored_answer : date.format(new Date(), 'YYYY-MM-DD h:m:s'),
			};
				
			// Add score to database, table score_answer
			db.query("insert into score_answer set ? ", newScoreAnswer, function(err,result){
				if(err){
					console.log("insert score query failed " + err);
				}
				else
				{
					console.log("User succesfully voted!")
					res.send(String(score));
				}
			});
		}
		
		
	});
	
});




// This handles votes for questions ONLY

/*This script is meant to find if user has already scored (voted) the question + if not, post score to database, table score_question. 
if voted -> console log  1 or -1. (1 means like, -1 means dislike).
If not voted -> console log  NULL & takes input from button to allow user to vote.
*/
router.post("/question-vote", function(req, res) {
	
	var user_id = req.body.user_id;
	var question_id = req.body.question_id;
	
	// mysql.format https://stackoverflow.com/questions/35256272/using-variables-in-a-node-js-mysql-node-query
	var sql = "SELECT score FROM score_question WHERE user_id = ? AND question_id = ?";
	// Query check if user already exists
	
	db.query(sql, [user_id, answer_id], function(err, result)
	{
		if (err)
		{
			console.log("select score query failed " + err);
			return;
		}
		result = result[0]; // Get passed the array
		
		// already voted
		if (result.score == 1 || result.score == -1)
		{
			console.log("already voted this question with a score of " + result.score);
			return;
		}
	
		// The email and username don't exist, signup succeeded
		else
		{
			
			//Array to fill in sql query below
			var newScoreQuestion = {
				
				score : Number(req.body.vote), //score is taken from button input ex: click button like gives 1, click button dislike gives -1
				user_id : Number(req.body.user_id), //taken from user session
				question_id : Number(req.body.question_id), //taken question to which the button is found
				datetime_scored_question : date.format(new Date(), 'YYYY-MM-DD h:m:s'),
			};
				
			// Add score to database, table score_question
			db.query("insert into score_question set ? ", newScoreQuestion, function(err,result){
				if(err){
					console.log("insert score query failed " + err);
				}
				else
				{
					console.log("User succesfully voted!")
					res.send(String(score));
				}
			});
		}
		
		
	});
	
});



//Anthony's template for above two vote answer-vote & question-vote

// This handles votes for answers ONLY
// see post below for question handler

/*
router.post("/answer-vote", function(req, res) {
	
	console.log("Answer vote!" + util.inspect(req.body));
	
	// Variables necessary for query
	var score = Number(req.body.vote); //score is taken from button input ex: click button like gives 1, click button dislike gives -1
	var user_id = Number(req.body.user_id); //taken from user session
	var answer_id = Number(req.body.answer_id); //taken answer to which the button is found
	var datetime_scored_answer = date.format(new Date(), 'YYYY-MM-DD h:m:s'); 

	// Use this to fill in sql query (may have to reorder/remove contents of array to suit query placeholder order)
	var sql_placeholder_arr = [score, user_id, answer_id, datetime_scored_answer];
	console.log("ARR " + sql_placeholder_arr);
	db.query("insert into score_answer set ? ", sql_placeholder_arr, function(err,result){
		if(err){
			console.log(err);
		//	res.render("\", {msg: ""});
		}
		else
		{
			// This is where the new answer score value is sent (as a string)
			// Replace String(vote_value) with total score!
			console.log("User succesfully voted!");
			res.send(String(vote_value));
		}
	});
	
});


// This handles votes for questions ONLY
router.post("/question-vote", function(req, res) {
	
	console.log("Question vote!" + util.inspect(req.body));
	
	// Variables necessary for query
	var user_id = Number(req.body.user_id);
	var question_id = Number(req.body.question_id);
	var vote_value = Number(req.body.vote); // Can take the value of 1 or -1 (up or down vote)
	
	// Use this to fill in sql query (may have to reorder/remove contents of array to suit query placeholder order)
	var sql_placeholder_arr = [user_id, question_id, vote_value];
	
	console.log("ARR " + sql_placeholder_arr);
		
	// This is where the new question score value is sent (as a string)
	// Replace String(vote_value) with total score!
	res.send(String(vote_value));	
	
	
});

*/
module.exports = router;