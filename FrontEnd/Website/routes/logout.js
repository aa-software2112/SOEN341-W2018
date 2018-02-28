var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

//Logout of website, simply makes cookie session variable "logged" as false

/** <<<<<<<<<<<<<<< Logout Button Response >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

//listens for login page request to load it
router.get('/', (req,res) => {
	console.log("logout requested!");
	
	req.session.logged = false; // "Logout" the user
	
	res.redirect('/home');
});

module.exports = router;