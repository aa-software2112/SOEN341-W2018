var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Contact page >>>>>>>>>>>>>>
* ============================================================================
* Listens to conctact us page request and loads it
*
*
* ============================================================================
*/

router.get('/' , (req,res) => {
	res.render('contact.ejs');
});

/* Listens for user input from conctact us page*/
router.post('/', (req,res) => {
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var country = req.body.country;
	//console.log (" Thank you "+ fname + " "+ lname + " from "+ country + " for contacting us.");
	console.log(req.body);
	res.redirect("/contact");
});

module.exports = router;