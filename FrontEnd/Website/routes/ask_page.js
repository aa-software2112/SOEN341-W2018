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
router.post("/askform/:user_id" , (req,res) => {
	
	console.log("Asked a question with user_id " + req.params.user_id);
	
	var newQ = {
		question_title : req.body.q_title,
		question_body: req.body.q_body,
		user_id: req.params.user_id,
		datetime_asked : date.format(new Date(), 'YYYY-MM-DD h:m:s')
	};
	var sql2 =" insert into question set ?";
	
	db.query(sql2, newQ, function(err,result){
		if(err){
			console.log(err);
			return;
		}

		console.log("Question posted ");
        
        //query to get all the question ids of all the question from the user_id that is asking the question
		var sql3 ="select question.question_id from question JOIN user ON question.user_id = user.user_id \
		WHERE user.user_id = ?";
		
		//this is the user Id of the user askinng the question, that is taken out from the object newQ that was inserted in to the database
		var userId= newQ.user_id;

		db.query(sql3,[req.params.user_id], function(err,qId){

			//debugging purpose to make sure the variable is an actual value;
			console.log(qId);
      
			//variable of the value of the LAST question id from the array of question ids.
      if (qId.length == 0)
      {
        res.redirect('/home');
      }
      else
      {
			  var qId = qId[qId.length-1].question_id;
        res.redirect("/question_forum/"+qId);
      }
		})
		
	});
});

module.exports = router;