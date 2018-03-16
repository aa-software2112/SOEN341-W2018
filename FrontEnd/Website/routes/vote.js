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

// This handles favorite choices
router.post("/favorite", function(req, res) {
	
	console.log("Favorite!");
	console.log(req.body);
	
	
	
	// Send "+" if the favorite save was valid,
	// Send "-" if the favorite save was invalid
	res.send("+");
	
});


// This handles votes for answers ONLY
// see post below for question handler

/*This has post has 3 queries
* 1st query finds the total score for a the answer id to which you scored or voted
* 2nd query finds if you previously did score-vote this answer, if you did, returns the total score of the answer found in query 1 else goes to query 3.
* 3rd query inserts the new score-vote to the score_answer table, update the total score variable and res.send the new total score for the answer_id.
*/
router.post("/answer-vote", function(req, res) {
	
	console.log(req.body);
	
	var user_id = req.body.user_id;
	var answer_id = req.body.answer_id;

	//Query takes the sum of the total positive score, and total negative score for the answer_id from the score_answer table.
	var sql_totalScore = "SELECT SUM(CASE WHEN score= '1' THEN 1 ELSE 0 END) AS positiveScore, Sum(CASE WHEN score = '-1' THEN 1 ELSE 0 END) AS negativeScore FROM score_answer WHERE answer_id = ?";
	
	db.query(sql_totalScore, [answer_id], function(err, result_q1)
	{
		if (err)
		{
			console.log("Select Sum query failed " + err);
			return;
		}
		
		console.log("Query 1 " + util.inspect(result_q1));
		
		//The totalScore of the answer_id is the substraction between the positive score and the negative score.
		var totalScore = 0;
		
		if (result_q1[0].positiveScore != null)
			totalScore += result_q1[0].positiveScore;
		
		if (result_q1[0].negativeScore != null)
			totalScore -= result_q1[0].negativeScore;
		
		// This Query checks if user has already voted previously
		var sql_scoreExist = "SELECT score FROM score_answer WHERE user_id = ? AND answer_id = ?";
		
		db.query(sql_scoreExist, [user_id, answer_id], function(err, result_q2)
		{
			if (err)
			{
				console.log("select score query failed " + err);
				return;
			}
			
			console.log("Query 2 " + util.inspect(result_q2));
			
			var score = Number(req.body.vote);

			// if already voted
			if (result_q2.length > 0 )
			{
				result_q2 = result_q2[0];
				/*
				if (result_q2.score == 1 || result_q2.score == -1)
				{
					console.log("already voted this answer, sending "  + totalScore);
					res.send(String(totalScore)); //since alread voted, sends total vote for answer_id 
				}
				*/
				
				if (result_q2.score == 1 && score ==1 || result_q2.score == -1 && score == -1)
				{
					console.log("already voted this answer, sending "  + totalScore);
					res.send(String(totalScore)); //since alread voted, sends total vote for answer_id 
				}

				else if (result_q2.score == 1 && score ==-1 || result_q2.score == -1 && score == 1)
				{

				//Values to fill in sql query below
					var score = req.body.vote; //score is taken from button input ex: click button like gives 1, click button dislike gives -1
					var user_id = Number(req.body.user_id); //taken from user session
					var datetime_scored_answer = date.format(new Date(), 'YYYY-MM-DD h:m:s');
				
					
				newTotalScore= totalScore + 2*Number(score); //the new totalScore is found by adding (+2 or -2) from the new score voted to the previous total score to cancel out his previous vote.

				/*Hardcoded query can use to test in database
				UPDATE score_answer SET score = '1', datetime_scored_answer = '2018-02-09 23:59:59' WHERE user_id = 7;
				*/

				// This Query inserts the new score (or vote) into the database and res.send the new total score
				var sql_insertNewScore = "UPDATE score_answer SET score = ?, datetime_scored_answer = ? WHERE user_id = ?";

				// Add score to database, table score_answer
				db.query(sql_insertNewScore, [score, datetime_scored_answer, user_id], function(err,result){
					if(err){
						console.log("update score query failed " + err);
						return;
					}
					else
					{
						console.log("User succesfully update vote!");
						console.log(result);
						res.send(String(newTotalScore)); // sends the new total vote for answer_id 
					}
				});

				}
			}
			else
			{
				//Array to fill in sql query below
				var newScoreAnswer = {
					
					score : req.body.vote, //score is taken from button input ex: click button like gives 1, click button dislike gives -1
					user_id : Number(req.body.user_id), //taken from user session
					answer_id : Number(req.body.answer_id), //taken answer to which the button is found
					datetime_scored_answer : date.format(new Date(), 'YYYY-MM-DD h:m:s'),
				};
					
				newTotalScore= totalScore + Number(newScoreAnswer.score); //the new totalScore is found by adding (+1 or -1) from the new score voted to the previous total score

				// This Query inserts the new score (or vote) into the database and res.send the new total score
				var sql_insertNewScore = "INSERT INTO score_answer SET ?";

				// Add score to database, table score_answer
				db.query(sql_insertNewScore, newScoreAnswer, function(err,result){
					if(err){
						console.log("insert score query failed " + err);
						return;
					}
					else
					{
						console.log("User succesfully voted!");
						console.log(newScoreAnswer);
						res.send(String(newTotalScore)); // sends the new total vote for answer_id 
					}
				});
			}	
		});
		
	});

});



// This handles votes for questions ONLY

/*This has post has 3 queries
* 1st query finds the total score for a the question id to which you scored or voted
* 2nd query finds if you previously did score-vote this question, if you did, returns the total score of the question found in query 1 else goes to query 3.
* 3rd query inserts the new score-vote to the score_question table, update the total score variable and res.send the new total score for the question_id.
*/
router.post("/question-vote", function(req, res) {
	
	var user_id = req.body.user_id;
	var question_id = req.body.question_id;

	//Query takes the sum of the total positive score, and total negative score for the question_id from the score_question table.
	var sql_totalScore = "SELECT SUM(CASE WHEN score= '1' THEN 1 ELSE 0 END) AS positiveScore, Sum(CASE WHEN score = '-1' THEN 1 ELSE 0 END) AS negativeScore FROM score_question WHERE question_id = ?";
	
	db.query(sql_totalScore, [question_id], function(err, result_q1)
	{
		if (err)
		{
			console.log("Select Sum query failed " + err);
			return;
		}
		
		//The totalScore of the question_id is the substraction between the positive score and the negative score.
		var totalScore = 0;
		
		if (result_q1[0].positiveScore != null)
			totalScore += result_q1[0].positiveScore;
		
		if (result_q1[0].negativeScore != null)
			totalScore -= result_q1[0].negativeScore;

		// This Query checks if user has already voted previously
		var sql_scoreExist = "SELECT score FROM score_question WHERE user_id = ? AND question_id = ?";
		
		db.query(sql_scoreExist, [user_id, question_id], function(err, result_q2)
		{
			if (err)
			{
				console.log("select score query failed " + err);
				return;
			}
			
			// if already voted
			if (result_q2.length > 0 )
			{
				result_q2 = result_q2[0];
				
				if (result_q2.score == 1 || result_q2.score == -1)
				{
					console.log("already voted this answer sending "  + totalScore);
					res.send(String(totalScore)); //since alread voted, sends total vote for answer_id 
				}
			}
			else
			{
				//Array to fill in sql query below
				var newScoreQuestion = {
					
					score : req.body.vote, //score is taken from button input ex: click button like gives 1, click button dislike gives -1
					user_id : Number(req.body.user_id), //taken from user session
					question_id : Number(req.body.question_id), //taken question to which the button is found
					datetime_scored_question : date.format(new Date(), 'YYYY-MM-DD h:m:s'),
				};
					
				newTotalScore= totalScore + Number(newScoreQuestion.score); //the new totalScore is found by adding (+1 or -1) from the new score voted to the previous total score

				// This Query inserts the new score (or vote) into the database and res.send the new total score
				var sql_insertNewScore = "INSERT INTO score_question SET ?";

				// Add score to database, table score_question
				db.query(sql_insertNewScore, newScoreQuestion, function(err,result){
					if(err){
						console.log("insert score query failed " + err);
						return;
					}
					else
					{
						console.log("User succesfully voted!");
						
						res.send(String(newTotalScore)); // sends the new total vote for question_id 
					}
				});
			}	
		});
		
	});

});

//Template for above two posts from Anthony
/*
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
*/

module.exports = router;