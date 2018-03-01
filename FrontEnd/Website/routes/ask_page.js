var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Ask page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
* ============================================================================
*/


router.get('/', (req, res) => {
	res.render("ask.ejs");
});

//logs of questions from the ask_questions
router.post("/askform" , (req,res) => {
	var newQ = {
		question_title : req.body.q_title,
		question_body: req.body.q_body,
		user_id: "3",
		datetime_asked : date.format(new Date(), 'YYYY-MM-DD h:m:s'),
		
	};
	var sql2 =" insert into question set ?";
	
	db.query(sql2, newQ, function(err,result){
		if(err){
			console.log(err);
			return;
		}
		
		//debugging purpose
		console.log("Question possted ");
        
        //query to get all the question ids of all the question from the user_id that is asking the question
		var sql3 ="select question.question_id from question JOIN user ON question.user_id = user.user_id \
		WHERE user.user_id = ?";
		
		//this is the user Id of the user askinng the question, that is taken out from the object newQ that was inserted in to the database
		var userId= newQ.user_id;

		db.query(sql3,[userId], function(err,qId){

			//variable of the value of the LAST question id from the array of question ids.

			var qtId = qId[qId.length-1].question_id;

			//debugging purpose to make sure the variable is an actual value;
			console.log(qtId);

			//redirecting to the forum page of the given question id value.
			res.redirect("/question_forum/"+qtId);
		})
		
	});
});

module.exports = router;