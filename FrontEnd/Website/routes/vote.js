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
router.post("/answer-vote", function(req, res) {
	
	console.log("Answer vote!" + util.inspect(req.body));
	
	// Variables necessary for query
	var user_id = Number(req.body.user_id);
	var answer_id = Number(req.body.answer_id);
	var vote_value = Number(req.body.vote); // Can take the value of 1 or -1 (up or down vote)
	
	// Use this to fill in sql query (may have to reorder/remove contents of array to suit query placeholder order)
	var sql_placeholder_arr = [user_id, answer_id, vote_value];
	
	console.log("ARR " + sql_placeholder_arr);
		
	// This is where the new answer score value is sent (as a string)
	// Replace String(vote_value) with total score!
	res.send(String(vote_value));	
	
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


module.exports = router;