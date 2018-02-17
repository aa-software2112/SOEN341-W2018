// Set up express, body parser, and ejs
var express = require("express");
var app = express();
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

var qId = "20"; //Static qId to fake loads of the last question from the database, must update everytime the server is open

var mysql = require('mysql');


//MUST CHANGE USER AND PASSWORD ACCORDING TO YOUR LOCAL DATABASE USER AND PASSWORD
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "soen341_project"
});


con.connect(function(err){
	if (err){
		throw err;
	}
	console.log(' connected ! :D');
});
  
/* INSERTS PAGE GET/POST CONNECTIONS HERE */

/** <<<<<<<<<<<<<<< Homepage >>>>>>>>>>>>>>
* ============================================================================
* > homepage.ejs
* Listens for the question list request.
* Depending of the given tab.
* ============================================================================
*/

app.get(['/', '/home'], (req, res) => {
	
	
	var sql = "SELECT question.question_title, user.username AS asked_by, answer.answer_body AS answers, \
	(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, \
	(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
	datetime_asked \
	FROM question JOIN user ON question.user_id=user.user_id JOIN answer ON question.user_id=answer.user_id \
	WHERE (answer.question_id is NOT NULL) OR (answer.question_id IS NULL) \
	ORDER BY datetime_asked DESC \
	LIMIT 10;";
	
	var query_popular = "SELECT question.question_title, user.username AS asked_by, answer.answer_body AS answers, \
	(SELECT COUNT(*) FROM score_question WHERE question_id=question.question_id) AS num_votes, \
	(SELECT COUNT(*) FROM answer WHERE question_id=question.question_id) AS num_views, \
	datetime_asked \
	FROM question JOIN user ON question.user_id=user.user_id JOIN answer ON question.user_id=answer.user_id \
	ORDER BY num_votes DESC \
	LIMIT 10;"
	
	con.query(sql, function (err, result) {
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
		} else {
			
			console.log(result);
			
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
						
						for (var i = 0; i < num_of_questions; i++) {
							var questions = {
								userName: result[i].asked_by,
								question: result[i].question_title,
								numOfVotes: result[i].num_votes,
								numOfAnswers: result[i].num_views,
								date_ans: result[i].datetime_asked							
							}
							newestQuestionList.push(questions);
						}						
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
});	

//* Listens for the question page request - done through the search */
app.get("/question_forum/:q_id", function(req, res) {
	
	// Verify that the question id is a number
	if (isNaN(req.params.q_id))
	{
		res.render('invalid_page', null);
		return;
	}
	//query from question table joined with user's table user_id
	var sql = "select question.question_title,question.question_body, question.datetime_asked, question.question_id, user.username AS asked_by FROM question JOIN user ON question.user_id = user.user_id WHERE question_id = ?";
	con.query(sql,[qId], function(err,result){
  if(err){
    console.log(err);
    return;
  }
      //debugging to show question object
      console.log(result);

       //second query getting answer table and also joined with user's table user_id (yes, this is a query inside a query)
      var sql2 ="select answer.answer_body, answer.answer_id, answer.datetime_answered, user.username AS answered_by FROM answer JOIN user ON answer.user_id = user.user_id WHERE answer.question_id = ?";
      con.query(sql2,[qId], function(err,answer){

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
		question_pts: 10,
		datetime_asked: result[result.length-1].datetime_asked,

		// for answers, we store all the answers related to the given question_id in an array, where we iterate through the ANSWER object that was posted to the database from SQL2 query
		answers:      
			(function() {
				arr = [];
				var num_answers = answer.length;
				for (var i = 0; i<num_answers; i++)
					arr.push(
					{
						answer: answer[i].answer_body,
						user_answered: answer[i].answered_by,
						answer_pts: Math.round(Math.random()*1000 + 1),
						datetime_answered: answer[i].datetime_answered
					});
		
				return arr
			})()
      };
	res.render('forum_page.ejs', {forum: outputQ});


/*POST THE ANSWER ON THE ANSWER BOX, THERE IS A QUERRY INSIDE. AND YES THIS APP.POST IS INSIDE THE APP.GET FROM ABOVE*/
app.post("/answer_to/:q_id", function(req, res) {
	//OBJECTED TO BE POSTED TO ANSWER TABLE
	var newA ={
		answer_body : req.body.answer_body,
		user_id : "1", //This can be changed to any user id that is in our local table, to be modified for log in implementation
		question_id : outputQ.q_id,
		datetime_answered :  date.format(new Date(), 'YYYY-MM-DD h:m:s'), 
	}
	
	//MYSQL QUERRY
	 var sql =" insert into answer set ?";
con.query(sql, newA, function(err,result){
 	if(err){
 		console.log(err);
 		return;
 	}
 	console.log("Answer succesfully added ")
     res.redirect("/question_forum/"+outputQ.q_id);
});
});
      });
      
	
});

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

/* logs info from user from signup page*/
app.post("/sign_up", function(req,res){

	//THIS IS THE OBJECT TO BE POSTED IN THE DATABSE USER TABLE. EVERY DATA IS GOTTEN FROM THE SIGN UP FORM
      var newUser = {

 	first_name : req.body.fName,
 	last_name : req.body.lName,
 	username : req.body.uName,
 	email : req.body.email,
 	password : req.body.password,
 	country : req.body.country,
 	birth_date : req.body.year +"-" + req.body.month + "-"+req.body.day,
 	gender : req.body.gender,
 	datetime_entered : date.format(new Date(), 'YYYY-MM-DD h:m:s'), 

 };

//MYSQL QUERRY (MIGHT NEED MODIFICATIONS)
 var sql =" insert into user set ?";
con.query(sql, newUser, function(err,result){
 	if(err){
 		console.log(err);
 		return;
 	}
 	console.log("User succesfully added ")
     res.redirect("/sign_up");
});
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

