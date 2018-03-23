var express = require("express");
var router = express.Router();

var path = require("path");
var util = require("util");
var bodyParser = require("body-parser");

// Database connection
const mysql = require("mysql");
var db = require("../database/database");

// Login check support
//var loginChecker = require('../public/scripts/login_check').loginChecker;

/** <<<<<<<<<<<<<<< Login page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

//listens for login page request to load it
router.get("/", function(req,res) {
	//Show that you are at login page
	console.log("login page!");
	res.render("login_page.ejs");
});

// logs info from user from login page
router.post("/", function(req,res) {
	
	//Console to get the body of the page
	console.log(req.body);
	
	// Check if email exists, and if so, pull entire row	
	db.query("SELECT * FROM user WHERE email = ?", [req.body.email], function(err, result) {
		if (err) {
			res.redirect("/login");
		} else {
			// A user exists with this email
			if (result.length == 1) {
				// The provided password matches that of the retreived row
				if (result[0].password === req.body.password) {
					// Set the user cookie 
					req.session.logged = true;
					req.session.username = result[0].username;
					req.session.user_id = result[0].user_id;
					req.session.country = result[0].country;
					req.session.dateOfBirth = result[0].birth_date;
					req.session.fName = result[0].first_name;
					req.session.lName = result[0].last_name;
					req.session.email = result[0].email;
					res.redirect("/home");
				
				// Password was incorrect
				} else {
					res.render("login_page", {msg: "Provided incorrect password for account " + req.body.email});
				}
				
			} else {

				//Debugging to make sure the result from the query is correct
				console.log(result);
				res.render("login_page", {msg: "User with email " + req.body.email + " does not exist"});
			}
		}
	});
});

module.exports = router;