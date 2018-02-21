var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< User profile page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

router.get('/', (req, res) => {
	res.render("user_profile.ejs");
});

module.exports = router;