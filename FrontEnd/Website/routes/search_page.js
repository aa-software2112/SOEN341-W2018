var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");

// Database connection
const mysql = require('mysql');
var db = require('../database/database');

/** <<<<<<<<<<<<<<< Search page >>>>>>>>>>>>>>
* ============================================================================
* Add comments here
*
*
* ============================================================================
*/

// Listens for a request to the search page and renders it with the results
router.get('/', (req, res) => {
	// Titles will be passed in once hooked up to DB
	res.render('search_page.ejs');
});

// Gets data from the search bar
router.post('/', (req, res) => {
	var search = req.body.search;
	console.log(req.body);
	res.redirect("/search");
});

module.exports = router;