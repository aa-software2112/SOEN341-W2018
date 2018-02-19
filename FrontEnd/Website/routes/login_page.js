var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Login page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

//listens for login page request to load it
router.get('/', (req,res) => {
	res.render('login_page.ejs');
});

// logs info from user from login page
router.post('/', (req,res) => {
	var email = req.body.email;
	var password = req.body.password;
	console.log(req.body);
	res.redirect("/login");
});

module.exports = router;