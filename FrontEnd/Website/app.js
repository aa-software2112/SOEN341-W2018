// Set up express, body parser, and ejs
var express = require("express");

// Database 
const mysql = require('mysql');
var db = require('./database/database');


var app = express();

// Routes 
// var router = express.Router();
// router.get("/",function(req,res){
// 	res.json({"message" : "Hello World"});
// });

// app.use("/api",router);

var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');
app.use(bodyParser.urlencoded({extended: true}));
var sortBy = require('sort-by');
app.set("view engine", "ejs");
//Static files in Express must go inside the directory specified. This is used for about us page, so far.
app.use( express.static( "public/about_team_img" ) ); 

// Links express to the stylesheets
app.use(express.static(__dirname + "/public"));

/** <<<<<<<<<<<<<<< DATABASE CONNECTION >>>>>>>>>>>>>>
* ============================================================================
* 
* ============================================================================
*/

// app.get('/createdb', (req, res) => {
// 	let sql = 'CREATE DATABASE SOEN341 PROJECT';
// 	db.query(sql, (err, result) => {
// 		if (err) throw err;
// 		console.log(result);
// 		res.send('Database Created');
// 	});
// });




/* INSERTS PAGE GET/POST CONNECTIONS HERE */

/** <<<<<<<<<<<<<<< Homepage >>>>>>>>>>>>>>
* ============================================================================
* > homepage.ejs
* Listens for the question list request.
* Depending of the given tab.
* ============================================================================
*/

app.get(['/', '/home'], (req, res) => {
	
	
	var sql = "SELECT DISTINCT question.question_title, \
	question.question_body, question.datetime_asked, \
	(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) \
	AS number_question_replies, (SELECT COUNT(*) \
	FROM score_question WHERE question_id=question.question_id) \
	AS question_score From question, answer, score_question WHERE question.user_id=24776";
	
	db.query(sql, function (err, result) {
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
		} else {
			
		

			const output = {
				/*
				* ---------------------------------------------------------------------------
				* > Object newest
				* username, question, # of votes, # of answers, # of views, date and time
				* ---------------------------------------------------------------------------
				*/
				
				newest: {
					newest_question_list:
					(function() {
						var newestQuestionList = [];
						var num_of_questions = 10;
						
						for (var i = 0; i < num_of_questions; i++)
						 question = {
								userName: (function() {
									var text = "";
									var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
									
									for (var i = 0; i < 5; i++)
									text += possible.charAt(Math.floor(Math.random() * possible.length));
									
									return text;
								})(),
								question: result[1].question_title,
								numOfVotes: Math.floor(Math.random() * 100), 
								numOfAnswers: Math.floor(Math.random() * 100),
								numOfViews: Math.floor(Math.random() * 100),
								date_ans: result[1].datetime_asked,
								time_ans: date.format(new Date(), 'h:m A').toUpperCase()
						}
						newestQuestionList.push(question);
						return newestQuestionList
					})()
				},
				
				/** 
				* ---------------------------------------------------------------------------
				* > Object newest
				* ---------------------------------------------------------------------------
				*/
				popular: {
					popular_question_list:
					(function() {
						popularQuestionList = [];
						var num_of_questions = 10;
						for (var i = 0; i < num_of_questions; i++)
						popularQuestionList.push(
							{
								userName: (function() {
									var text = "";
									var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
									
									for (var i = 0; i < 5; i++)
									text += possible.charAt(Math.floor(Math.random() * possible.length));
									
									return text;
								})(),
								question: (function() {
									var text = "";
									var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
									
									for (var i = 0; i < 200; i++)
									text += possible.charAt(Math.floor(Math.random() * possible.length));
									
									return text;
								})(),
								numOfVotes: Math.floor(Math.random() * 100), 
								numOfAnswers: Math.floor(Math.random() * 100),
								numOfViews: Math.floor(Math.random() * 100),
								date_ans: date.format(new Date(), 'DD/MM/YYYY'),
								time_ans: date.format(new Date(), 'h:m A').toUpperCase()
							}
						);
						popularQuestionList.sort(sortBy('-numOfVotes'));
						return popularQuestionList
					})()
				}
				
			}
			res.render('homepage.ejs', {homepage: output});
		};	
		// Populate the homepage.ejs file with the output object.
		
		
		
	});
	
	// let sql = 'SELECT question.question_title, question.question_body, question.datetime_asked, (SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS number_question_replies, (SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS question_score From question, answer, score_question WHERE question.user_id=1";'
	// let query = db.query(sql, (err, results) => {
	// 	if (err) throw err;
	// 	console.log(results);
	// 	res.send('Post 2 added...');
	// });
	
});

/* Listens for the question page request - done through the search */
app.get("/question_forum/:q_id", function(req, res) {
	
	// Verify that the question id is a number
	if (isNaN(req.params.q_id))
	{
		res.render('invalid_page', null);
		return;
	}
	
	// Get the entire page's data --> var outputObj = get_forum(question_id);
	var outputObj = {
		q_id: req.params.q_id,
		title: "What is polymorphism in Java, and how can I test it?",
		body: "I often hear my professor lecture about polymorphism, but I think I missed the class where he " +
		"explained what it was (the snooze button :/ ). Can someone refresh me on the ins-and-outs of polymorphism, " +
		"specifically, its implementation within java",
		user_asked: "Anthony2112",
		question_pts: 10,
		date_asked: date.format(new Date(), 'DD/MM/YYYY'),
		time_asked: date.format(new Date(), 'h:m A').toUpperCase(),
		answers:      
		(function() {
			arr = [];
			var num_answers = Math.round(Math.random()*15)+1;
			for (var i = 0; i<num_answers; i++)
			arr.push(
				{
					answer: "From what I remember in my COMP 249 class @ Concordia University," +
					"polymorphism is when an object takes on different forms based on the left-hand-side" +
					"type and the right-hand-side object.",
					user_answered: (function() {
						var size = Math.round(Math.random()*10) + 1; // Size of username
						var uname = new String("");
						
						for(var s = 0; s<size; s++)
						uname = uname.concat(
							String.fromCharCode(Math.round(Math.random()*42) + 48)
						);
						
						return uname;
					})(),
					answer_pts: Math.round(Math.random()*1000 + 1),
					date_answered: date.format(new Date(), 'DD/MM/YYYY'),
					time_answered: date.format(new Date(), 'h:m A').toUpperCase()
				});
				
				return arr
			})()
		};
		
		
		
		console.log("Requested Question Forum q_id = " + util.inspect(req.params));
		// if q_id is valid
		res.render('forum_page.ejs', {forum: outputObj});
		// else
		// res.render('invalid_page.ejs', null);
		
	});
	
	/* Listens for an answer from the forum page */
	app.post("/answer_to/:q_id", function(req, res) {
		
		console.log("Received Answer!");
		console.log(util.inspect(req.body) + " q_id : " + req.params.q_id);
		res.redirect("/question_forum/"+req.params.q_id);	
	});
	
	/* listens for a request from about us page and loads it*/
	app.get("/about", function(req,res){
		res.render('about.ejs');
	});
	
	/* Listens to conctact us page request and loads it*/
	app.get("/contact" , function(req,res){
		res.render('contact.ejs');
	});
	
	// Listens for a request to the search page and renders it with the results
	app.get("/search", function(req, res) {
		// Titles will be passed in once hooked up to DB
		res.render('search_page.ejs');
	});
	
	// Gets data from the search bar
	app.post("/search", function(req, res) {
		var search = req.body.search;
		console.log(req.body);
		res.redirect("/search");
	});
	
	//listens for signup page request to load it
	app.get("/sign_up", function(req,res){
		res.render('sign_up.ejs');
	});
	
	//listens for login page request to load it
	app.get("/login", function(req,res){
		res.render('login_page.ejs');
	});
	
	/* Listens for user input from conctact us page*/
	app.post("/contact", function(req,res){
		var fname = req.body.firstname;
		var lname = req.body.lastname;
		var country = req.body.country;
		//console.log (" Thank you "+ fname + " "+ lname + " from "+ country + " for contacting us.");
		console.log(req.body);
		res.redirect("/contact");
	});
	
	// logs info from user from signup page
	app.post("/sign_up", function(req,res){
		var fName = req.body.fName;
		var lName = req.body.lName;
		var uName = req.body.uName;
		var email = req.body.email;
		var password = req.body.password;
		var country = req.body.country;
		var month = req.body.month;
		var day = req.body.day;
		var year = req.body.year;
		var gender = req.body.gender;
		
		//console.log("New user added:");    
		//console.log ("First Name: " + fName + "\nLast Name: " + lName + "\nUsername: " + uName + "\nEmail: " + email + "\nPassword: " + "\nCountry: " + country + 
		//	"\nDate of Birth: " + month+"/" + day + "/" + year + "\nGender: " + gender);
		console.log(req.body);
		res.redirect("/sign_up");
	});
	
	// logs info from user from login page
	app.post("/login", function(req,res){
		var email = req.body.email;
		var password = req.body.password;
		console.log(req.body);
		res.redirect("/login");
	});
	
	app.get("/ask", function(req, res) {
		res.render("ask.ejs");
	});
	
	//logs of questions from the ask_questions
	app.post("/askform" , function(req,res){
		var q_title = req.body.q_title;
		var q_body = req.body.q_body;
		console.log(req.body);
		res.redirect("/question_forum/234");
	});
	
	app.get("/user_profile", function (req, res) {
		res.render("user_profile.ejs");
	});
	
	
	
	// Catches invalid URL requests
	app.get("*", function(req, res) {
		res.render('invalid_page', null);
	}) ;
	
	// Makes the server listen for req/res - http://localhost:3000
	app.listen(3000, function() {
		console.log("Server Running on Port 3000");
		console.log("Working Directory: " + __dirname);
	});
	
	