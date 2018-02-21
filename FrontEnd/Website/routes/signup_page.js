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
	db.query(sql, newUser, function(err,result){
		if(err){
			console.log(err);
			return;
		}
		console.log("User succesfully added ")
		res.redirect("/sign_up");
	});
});


module.exports = router;