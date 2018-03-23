var express = require("express")
var router = express.Router();

var path = require("path");
var util = require("util");
var bodyParser = require("body-parser");
var date = require("date-and-time");

// Database connection
const mysql = require("mysql");
var db = require("../database/database");

/** <<<<<<<<<<<<<<< Vote page >>>>>>>>>>>>>>
* ============================================================================
* This vote page contains all the queries necessary to make voting functional. 
* 1. Allow users to vote for answers or questions. 
* 2. Allow users to re-vote if they change their mind (cannot cancel their vote, but can toggle between a positive or negative vote).
* 3. Allows questioner to pick their favorite answers out of all the answers.
* ============================================================================
*/

// This handles favorite choices. Questioner can select their favorite answers out of all the answers.
router.post("/favorite", function(req, res) {

	// Send "+" if the favorite save was valid,
	// Send "-" if the favorite save was invalid
	//res.send("+");
	// This Query checks if user has already voted previously
	var sqlFavoriteExist = "SELECT favorite_answer_id FROM question WHERE question_id = ?";
		
	db.query(sqlFavoriteExist, [req.body.q_id], function(err, resultFavQ) {
			if (err) {
				console.log("select favorite_answer_id query failed " + err);
				return;
			}

			console.log("favorite_answer_id" + util.inspect(resultFavQ));

			var resultFavQ1 = resultFavQ.favorite_answer_id;


			//If statement to check if there is already a value in the favorite_answer_id column
			if(resultFavQ1 != null && resultFavQ1 == req.body.fav_ans_id) {
				console.log("already favorited this answer, the favorite_answer_id was" + resultFavQ1);
				res.send(String("+")); // Send "+" if the favorite save was valid,
			}


			//Query if we want to allow the questioner to favorite another answer

			/*else if( resultFavQ1 != null && resultFavQ1 != req.body.fav_ans_id) {

			var sqlUpdateFavoriteAnswerID = "UPDATE question SET favorite_answer_id = ? WHERE question_id = ?";

				// Add score to database, table score_answer
				db.query(sql_updateFavoriteAnswerID, [req.body.fav_ans_id, req.body.q_id], function(err,result){
					if(err){
						console.log("update favorite_answer_id query failed " + err);
						return;
					}
					else {
						console.log("User succesfully update favorite_answer_id!");
						console.log(result);
						res.send("+"); // Send "+" if the favorite save was valid,
					}
				});
		}*/
			
		else {

				// This Query inserts the new favorite answer Id into the table
				var sqlInsertNewFavoriteAnswerID = "UPDATE question SET favorite_answer_id = ? WHERE question_id = ?";

				// Add score to database, table score_answer
				db.query(sqlInsertNewFavoriteAnswerID, [req.body.fav_ans_id, req.body.q_id], function(err,result){
					if(err) {
						console.log("insert score query failed " + err);
						return;
					} else {
						console.log("questioner succesfully favorited!");
						console.log(result);
						res.send("+"); // Send "+" if the favorite save was valid,
					  }
				});				
		}	
	});

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

	var userId = req.body.user_id;
	var answerId = req.body.answer_id;

	//Query takes the sum of the total positive score, and total negative score for the answer_id from the score_answer table.
	var sqlTotalScore = "SELECT SUM(CASE WHEN score= '1' THEN 1 ELSE 0 END) AS positiveScore, Sum(CASE WHEN score = '-1' THEN 1 ELSE 0 END) AS negativeScore FROM score_answer WHERE answer_id = ?";
	
	db.query(sqlTotalScore, [answerId], function(err, resultQ1)
	{
		if (err) {
			console.log("Select Sum query failed " + err);
			return;
		}

		console.log("Query 1 " + util.inspect(resultQ1));

		//The totalScore of the answer_id is the substraction between the positive score and the negative score.
		var totalScore = 0;
		if (resultQ1[0].positiveScore != null){
			totalScore += resultQ1[0].positiveScore;
		}
		
		if (resultQ1[0].negativeScore != null){
			totalScore -= resultQ1[0].negativeScore;
		}
		
		// This Query checks if user has already voted previously
		var sqlScoreExist = "SELECT score FROM score_answer WHERE user_id = ? AND answer_id = ?";
		
		db.query(sqlScoreExist, [userId, answerId], function(err, resultQ2)	{
			if (err) {
				console.log("select score query failed " + err);
				return;
			}

			console.log("Query 2 " + util.inspect(resultQ2));

			var score = Number(req.body.vote);

			// if already voted
			if (resultQ2.length > 0 ) {
				resultQ2 = resultQ2[0];		
				if (resultQ2.score == 1 && score ==1 || resultQ2.score == -1 && score == -1) {
					console.log("already voted this answer, sending "  + totalScore);
					res.send(String(totalScore)); //since alread voted, sends total vote for answer_id
				}

				else if (resultQ2.score == 1 && score ==-1 || resultQ2.score == -1 && score == 1) {

					//Values to fill in sql query below
					var score = req.body.vote; //score is taken from button input ex: click button like gives 1, click button dislike gives -1
					var userId = Number(req.body.user_id); //taken from user session
					var datetimeScoredAnswer = date.format(new Date(), "YYYY-MM-DD h:m:s");
          
				newTotalScore= totalScore + 2*Number(score); //the new totalScore is found by adding (+2 or -2) from the new score voted to the previous total score to cancel out his previous vote. Allows for toggling between upvote & downvote

				//Query updates the new score (or vote) into the database
				var sqlInsertNewScore = "UPDATE score_answer SET score = ?, datetime_scored_answer = ? WHERE user_id = ?";

				// Add score to database, table score_answer
				db.query(sqlInsertNewScore, [score, datetimeScoredAnswer, userId], function(err,result) {
					if(err) {
						console.log("update score query failed " + err);
						return;
					}
					else {
						console.log("User succesfully update vote!");
						console.log(result);
						res.send(String(newTotalScore)); // sends the new total vote for answer_id
					}
				});

				}
			}
			else {
				//Array to fill in sql query below
				var newScoreAnswer = {

					score : req.body.vote, //score is taken from button input ex: click button like gives 1, click button dislike gives -1
					user_id : Number(req.body.user_id), //taken from user session
					answer_id : Number(req.body.answer_id), //taken answer to which the button is found
					datetime_scored_answer : date.format(new Date(), "YYYY-MM-DD h:m:s"),
				};

				newTotalScore= totalScore + Number(newScoreAnswer.score); //the new totalScore is found by adding (+1 or -1) from the new score voted to the previous total score

				// This Query inserts the new score (or vote) into the database and res.send the new total score
				var sqlInsertNewScore = "INSERT INTO score_answer SET ?";

				// Add score to database, table score_answer
				db.query(sqlInsertNewScore, newScoreAnswer, function(err,result) {
					if(err) {
						console.log("insert score query failed " + err);
						return;
					}
					else {
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

	var userId = req.body.user_id;
	var questionId = req.body.question_id;

	//Query takes the sum of the total positive score, and total negative score for the question_id from the score_question table.
	var sqlTotalScore = "SELECT SUM(CASE WHEN score= '1' THEN 1 ELSE 0 END) AS positiveScore, Sum(CASE WHEN score = '-1' THEN 1 ELSE 0 END) AS negativeScore FROM score_question WHERE question_id = ?";
	
	db.query(sqlTotalScore, [questionId], function(err, resultQ1) {
		if (err) {
			console.log("Select Sum query failed " + err);
			return;
		}
		//The totalScore of the question_id is the substraction between the positive score and the negative score.
		var totalScore = 0;	
		if (resultQ1[0].positiveScore != null){
			totalScore += resultQ1[0].positiveScore;
		}
		
		if (resultQ1[0].negativeScore != null){
			totalScore -= resultQ1[0].negativeScore;
		}

		// This Query checks if user has already voted previously
		var sqlScoreExist = "SELECT score FROM score_question WHERE user_id = ? AND question_id = ?";
		
		db.query(sqlScoreExist, [userId, questionId], function(err, resultQ2) {
			if (err) {
				console.log("select score query failed " + err);
				return;
			}

			var score = Number(req.body.vote);

			// if already voted
			if (resultQ2.length > 0 ) {
				resultQ2 = resultQ2[0];
				
				if (resultQ2.score == 1 && score ==1 || resultQ2.score == -1 && score == -1) {
					console.log("already voted this question, sending "  + totalScore);
					res.send(String(totalScore)); //since alread voted, sends total vote for question_id
				}

				else if (resultQ2.score == 1 && score ==-1 || resultQ2.score == -1 && score == 1) {

					//Values to fill in sql query below
						var score = req.body.vote; //score is taken from button input ex: click button like gives 1, click button dislike gives -1
						var userId = Number(req.body.user_id); //taken from user session
						var datetimeScoredQuestion = date.format(new Date(), "YYYY-MM-DD h:m:s");
					
						
					newTotalScore= totalScore + 2*Number(score); //the new totalScore is found by adding (+2 or -2) from the new score voted to the previous total score to cancel out his previous vote

					// This Query inserts the new score (or vote) into the database and res.send the new total score
					var sqlInsertNewScore = "UPDATE score_question SET score = ?, datetime_scored_question = ? WHERE user_id = ?";

					// Add score to database, table score_question
					db.query(sqlInsertNewScore, [score, datetimeScoredQuestion, userId], function(err,result) {
						if(err) {
							console.log("update score query failed " + err);
							return;
						}
						else {
							console.log("User succesfully update vote!");
							console.log(result);
							res.send(String(newTotalScore)); // sends the new total vote for question_id 
						}
					});
				}

			}
			else {
				//Array to fill in sql query below
				var newScoreQuestion = {

					score : req.body.vote, //score is taken from button input ex: click button like gives 1, click button dislike gives -1
					user_id : Number(req.body.user_id), //taken from user session
					question_id : Number(req.body.question_id), //taken question to which the button is found
					datetime_scored_question : date.format(new Date(), "YYYY-MM-DD h:m:s"),
				};

				newTotalScore= totalScore + Number(newScoreQuestion.score); //the new totalScore is found by adding (+1 or -1) from the new score voted to the previous total score

				// This Query inserts the new score (or vote) into the database and res.send the new total score
				var sqlInsertNewScore = "INSERT INTO score_question SET ?";

				// Add score to database, table score_question
				db.query(sqlInsertNewScore, newScoreQuestion, function(err,result){
					if(err){
						console.log("insert score query failed " + err);
						return;
					}
					else {
						console.log("User succesfully voted!");

						res.send(String(newTotalScore)); // sends the new total vote for question_id
					}
				});
			}
		});

	});

});

module.exports = router;