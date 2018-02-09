// Set up express, body parser, and ejs
var express = require("express");
var app = express();
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//Static files in Express must go inside the directory specified. This is used for about us page, so far.
app.use( express.static( "public/about_team_img" ) ); 

// Links express to the stylesheets
app.use(express.static(__dirname + "/public"));


/* INSERTS PAGE GET/POST CONNECTIONS HERE */

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

//listens for signup page request to load it
app.get("/sign_up", function(req,res){
	res.render('sign_up.ejs');
});

//listens for login page request to load it
app.get("/sign_up", function(req,res){
	res.render('login.ejs');
});

/* Listens for user input from conctact us page*/
app.post("/contact", function(req,res){
     var fname = req.body.firstname;
     var lname = req.body.lastname;
     var country = req.body.country;
     console.log (" Thank you "+ fname + " "+ lname + " from "+ country + " for contacting us.");
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

	 console.log("New user added:");    
     console.log ("First Name: " + fName + "\nLast Name: " + lName + "\nUsername: " + uName + "\nEmail: " + email + "\nPassword: " + "\nCountry: " + country + 
     	"\nDate of Birth: " + month+"/" + day + "/" + year + "\nGender: " + gender);
     res.redirect("/sign_up");
});

// logs info from user from login page
app.post("/sign_up", function(req,res){
     var email = req.body.email;
     var password = req.body.password;
	 console.log("user logged in:");    
     console.log ("Email: " + email + "\nPassword: " + password);
     res.redirect("/login);
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
