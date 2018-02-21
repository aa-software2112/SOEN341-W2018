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
		user_id: "24776",
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
		console.log(newQ.question_id);
		
		db.query("select * from question", function(err,qId){
			var qId = qId[qId.length-1].question_id;
			res.redirect("/question_forum/"+qId);
		})
		
	});
});

module.exports = router;