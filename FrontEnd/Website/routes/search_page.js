var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');
var dateFormat = require('dateformat');

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Search page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

// Listens for a request to the search page and renders it with the results
// GET command should not be used - user should only get to search page via a search POST
router.get('/', (req, res) => {
	// Titles will be passed in once hooked up to DB
	res.render('search_page.ejs');
});



// Gets data from the search bar and renders the search page with the results
router.get('/search_on', (req,res) => {
	var keyword = req.query.search;
	
	/**
	*  Query to match the keyword to the question title of the question's table in the database. Also return the
	question id for redirecting the user to the forum page upon clicking on a matched question. 
	*/
	var search_keyword = 'SELECT question.question_id, question.question_title, question.user_id, user.username, question.datetime_asked FROM question, user WHERE Match(question_title) Against("'+ keyword +'" IN NATURAL LANGUAGE MODE) AND question.user_id = user.user_id';
	
	db.query(search_keyword, function(err, rows, fields) {
		if (err){
			console.log(err);
		}
		console.log(rows);
		
		// Stores the result into the array data, which is returned when the function search_question_list is called
		var output = {
			search_question: {
				search_question_list:
				(function() {
					var data=[];
					var number_of_questions = rows.length;
					for (var i = 0; i < number_of_questions; i++) {
						
						var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
						var d = (new Date(rows[i].datetime_asked  - timezoneOffset)).toISOString().split("T");
						d = d[0] + " - " + d[1].split("Z")[0].slice(0, -4);
						
						var searchList = {
							questionID: rows[i].question_id,
							questionList: rows[i].question_title,
							userName: rows[i].username,
							date_ask: d
							
						}						
						data.push(searchList);
					}
					return data;
					
				})()
			}
		}
		
		res.render('search_page.ejs', {search_page: output});
	})
});

module.exports = router;