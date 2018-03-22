var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var url = require('url');
var dateFormat = require('dateformat');

// Database connection
const mysql = require('mysql');
var db = require('../../database/database');

exports.delete_question = function(req,res){
          
    var qId = req.params.q_id;

	db.query("DELETE question, answer FROM question INNER JOIN answer ON question.question_id = answer.question_id WHERE question_id = ? ", [qId], function (err, rows) {
	
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			console.log("Error deleting : %s ", err );
		} else {
			res.redirect('/user_profile_questions.ejs');
		};
	});
};

exports.delete_answer = function(req,res){
          
    var aId = req.params.a_id;

	db.query("DELETE FROM answer WHERE answer_id = ? ", [aId], function (err, rows) {
	
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			console.log("Error deleting : %s ", err );
		} else {
			res.redirect('/user_profile/?tab=answers');
		};
	});
};