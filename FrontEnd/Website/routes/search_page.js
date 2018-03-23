var express = require("express")
var router = express.Router();

var path = require("path");
var util = require("util");
var bodyParser = require("body-parser");
var date = require("date-and-time");
var dateFormat = require("dateformat");

// Database connection
const mysql = require("mysql");
var db = require("../database/database");

/** <<<<<<<<<<<<<<< Search page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

// Listens for a request to the search page and renders it with the results
// GET command should not be used - user should only get to search page via a search POST
// Gets data from the search bar and renders the search page with the results
router.get("/search_on", (req,res) => {
	var keyword = req.query.search;
	
	/**
	*  Query to match the keyword to the question title of the question's table in the database. Also return the
	question id for redirecting the user to the forum page upon clicking on a matched question. 
	*/
	//causes error when using double quotation on query
	var searchKeyword = 'SELECT question.question_id, question.question_title, question.user_id, user.user_id, user.username, question.datetime_asked FROM question, user WHERE Match(question_title) Against("'+ keyword +'" IN NATURAL LANGUAGE MODE) AND question.user_id = user.user_id';
	var output = " ";
	
	db.query(searchKeyword, function(err, rows, fields) {
		if (err){
			console.log(err);
		}
		console.log(rows);
		
		if (rows.length == 0) {
			output = {
				
				message:  {
					msg: "No result found :) "
				},
				
				search_question: {
					search_question_list:
					(function() {
						var data=[];
						var numberOfQuestions = rows.length;
						for (var i = 0; i < numberOfQuestions; i++) {
							
							var searchList = {
								questionID: " ",
								questionList: " ",
								userID: " ",
								userName: " ",
								date_ask: " "
								
							}						
							data.push(searchList);
						}
						return data;
						
					})()
				}
			}
		} else {
			// Stores the result into the array data, which is returned when the function search_question_list is called
			output = {
				
				message:  {
					msg: "Results for: " + keyword
				},
				
				search_question: {
					search_question_list:
					(function() {
						var data=[];
						var numberOfQuestions = rows.length;
						for (var i = 0; i < numberOfQuestions; i++) {
							
							var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
							var date = (new Date(rows[i].datetime_asked  - timezoneOffset)).toISOString().split("T");
							date = date[0] + " - " + date[1].split("Z")[0].slice(0, -4);
							
							var searchList = {
								questionID: rows[i].question_id,
								questionList: rows[i].question_title,
								userID: rows[i].user_id,
								userName: rows[i].username,
								date_ask: date						
							}						
							data.push(searchList);
							
						}
						return data;
						
					})()
				}
			}
		}
		
		res.render("search_page.ejs", {search_page: output});
	})
});

module.exports = router;