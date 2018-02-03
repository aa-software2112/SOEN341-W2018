// Set up express, body parser, and ejs
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// Links express to the stylesheets
app.use(express.static(__dirname + "/public"));



/* INSERTS PAGE GET/POST CONNECTIONS HERE */


// Catches invalid URL requests
app.get("*", function(req, res) {
	res.send("This page does not exist - error page under construction");
}) ;

// Makes the server listen for req/res - http://localhost:3000
app.listen(3000, function() {
	console.log("Server Running on Port 3000");
	console.log("Working Directory: " + __dirname);
});