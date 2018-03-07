var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Forum page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
* ============================================================================
*/

//Static qId to fake loads of the last question from the database, must update everytime the server is open

//* Listens for the question page request - done through the search */
router.get('/:q_id', (req, res) => {
	var qId = req.params.q_id;
	// Verify that the question id is a number
	if (isNaN(req.params.q_id))
	{
		res.render('invalid_page', null);
		return;
	}
	//query from question table joined with user's table user_id
	var sql = "select question.question_title,question.question_body, question.datetime_asked, \
	question.question_id, user.username AS asked_by FROM question JOIN user ON question.user_id = user.user_id \
	WHERE question_id = ?"
	
	db.query(sql,[qId], function(err,result){
		if(err){
			console.log(err);
			return;
		}
		//debugging to show question object
		console.log("FORUM RESULT " + util.inspect(result));
		
		//second query getting answer table and also joined with user's table user_id (yes, this is a query inside a query)
		var sql2 ="select answer.answer_body, answer.answer_id, answer.datetime_answered, \
		user.username AS answered_by FROM answer JOIN user ON answer.user_id = user.user_id \
		WHERE answer.question_id = ?";
		db.query(sql2,[qId], function(err,answer){
			
			//debugging
			console.log(answer);
			
			//Object to be sent to forum page
			var outputQ = {
				
				//takes the last object in the result array and gets its respective parameter 
				q_id : result[result.length-1].question_id,
				title : result[result.length-1].question_title,
				body : result[result.length-1].question_body,
				
				// following code implemented using SQL2 query
				user_asked: result[result.length-1].asked_by,
				question_pts: null,
				datetime_asked:(new Date(result[result.length-1].datetime_asked)).toISOString().split("T")[0],
				
				// for answers, we store all the answers related to the given question_id in an array, where we iterate through the ANSWER object that was posted to the database from SQL2 query
				answers:      
				(function() {
					arr = [];
					var num_answers = answer.length;
					for (var i = 0; i<num_answers; i++)
					arr.push(
						{
							answer_id: answer[i].answer_id,
							answer: answer[i].answer_body,
							user_answered: answer[i].answered_by,
							answer_pts: null,
							datetime_answered: (new Date(answer[i].datetime_answered)).toISOString().split("T")[0]
						});
						
						return arr
					})()
				};
				
				// Get the question points
				//Query takes the sum of the total positive score, and total negative score for the question_id from the score_question table.
				var sql_totalScore = "SELECT SUM(CASE WHEN score= '1' THEN 1 ELSE 0 END) AS positiveScore, Sum(CASE WHEN score = '-1' THEN 1 ELSE 0 END) AS negativeScore FROM score_question WHERE question_id = ?";
				
				db.query(sql_totalScore, [qId], function(err, result_q1)
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

					outputQ.question_pts = totalScore;
				
					console.log("outputQ "  + util.inspect(outputQ) + " " + (new Date(outputQ.datetime_asked)).toISOString().split("T")[0]);
					res.render('forum_page.ejs', {forum: outputQ});
					
				});
		});
	});
});
	
/*POST THE ANSWER ON THE ANSWER BOX, THERE IS A QUERY INSIDE. AND YES THIS APP.POST IS INSIDE THE APP.GET FROM ABOVE*/
router.post("/answer_to/:q_id/:user_answered", function(req, res) {
	
	//OBJECTED TO BE POSTED TO ANSWER TABLE
	var newA = {
		answer_body : req.body.answer_body,
		user_id : req.params.user_answered, // Can also be accessed by req.session.user_id
		question_id : req.params.q_id,
		datetime_answered :  date.format(new Date(), 'YYYY-MM-DD h:m:s'), 
	}
	
	//MYSQL QUERRY
	var sql =" insert into answer set ?";
	db.query(sql, newA, function(err,result){
		if(err){
			console.log(err);
			return;
		}
		console.log("Answer succesfully added ")
		res.redirect("/question_forum/" + req.params.q_id);
	});
});
	
module.exports = router;