// Set up express, body parser, and ejs
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Links express to the stylesheets
app.use(express.static(__dirname + "/public"));

// Array of question titles for testing purposes
var titles = ["It's the summer of George!", "Serenity Now!", "It feels like an Arby's night", "yada yada yada...",
				"It's not a lie if you believe it", "George likes his chicken spicy!"];

var users = [ {email: "hi@bye.com", pass: "hello"}, {email: "art@vandalayindustries.com", pass: "bigsalad"}];
var currentUser = {email: "blank", pass: "blank"};

// Tests what pages can be accessed when logged in/out
var loggedIn = true;

// Sends back the landing page
app.get("/", function(req, res) {
	res.render("landing.ejs", {titles: titles});
});

// Sends back the ask question page
app.get("/questions", function(req, res) {
	res.render("questions.ejs");
});

// Form to add a new question
app.get("/questions/new", function(req, res) {
	if(loggedIn === true){
		res.render("new.ejs");
	} else {
		res.redirect("/signlog");
	}
});

app.get("/reply", function(req, res) {
	res.render("reply.ejs");
});

// Sends back the signup/login page
app.get("/signlog", function(req, res) {
	res.render("signlog.ejs");
});

// Gets the data from the login form
app.post("/login", function(req, res) {
	var email = req.body.email;
	var pass = req.body.pass;
	currentUser.email = email;
	currentUser.pass = pass;
	console.log(email + " has logged in with password: " + pass);
	res.redirect("/");
});

// Gets the data from the ask question form
app.post("/questions", function(req, res) {
	var title = req.body.title;
	titles.push(title);
	console.log("New Question Submitted");
	res.redirect("/");
});

// Gets the data from the reply form
app.post("/reply",  function(req, res) {
	console.log("New Response Submitted");
	res.redirect("/");
});

// Gets data from the search bar
app.post("/search", function(req, res) {
	var search = req.body.search;
	console.log("Search initiated for: " + search);
	res.redirect("/");
});

// Gets the data from the new user signup form
app.post("/signup", function(req, res) {
	var newemail = req.body.newemail;
	var newpass = req.body.newpass;
	var newUser = {email: newemail, pass: newpass};
	titles.push(newUser);
	console.log("New user added - email: " + newemail + ", password: " + newpass);
	res.redirect("/");
});


// Catches invalid url requests
app.get("*", function(req, res) {
	res.render("invalid.ejs");
});

// Makes the server listen for req/res - http://localhost:3000
app.listen(3000, function() {
	console.log("Current Directory: " + __dirname);
	console.log("Server Running on PORT: 3000");
});