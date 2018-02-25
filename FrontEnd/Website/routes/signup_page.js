var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Signup page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

//listens for signup page request to load it
router.get('/', (req,res) => {
	res.render('sign_up.ejs');
});

/* logs info from user from signup page*/
router.post('/', (req,res) => {
	
	
	// Query check if user already exists
	var check_exists = "SELECT " + 
	"SUM(CASE WHEN email = ? then 1 else 0 end) email_count, " + 
	"SUM(CASE WHEN username = ? then 1 else 0 end) user_count " +
	"FROM user;"; 
	
	db.query(check_exists, [req.body.email, req.body.uName], function(err, result)
	{
		if (err)
		{
			console.log("Email check query failed " + err);
			return;
		}
		result = result[0]; // Get passed the array
		
		// The email already exists, signup failed
		if (result.email_count > 0)
		{
			res.render("sign_up", {msg: "The email " + req.body.email + " already exists."});
		}
		// The username already exists, signup failed
		else if (result.user_count > 0)
		{
			res.render("sign_up", {msg: "The username " + req.body.uName + " already exists."});	
		}
		// The email and username don't exist, signup succeeded
		else
		{
			
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
			
			// Add user to database
			db.query("insert into user set ? ", newUser, function(err,result){
				if(err){
					console.log(err);
					return;
				}
				console.log("User succesfully added!")
				res.render("sign_up", {msg: "Sign-up successful!"});
			});
		}
		
		
	});
	
	
	
	
});


module.exports = router;