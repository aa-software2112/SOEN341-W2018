var express = require("express")
var router = express.Router();

var path = require("path");
var util = require("util");
var bodyParser = require("body-parser");

// Database connection
const mysql = require("mysql");
var db = require("../database/database");

/** <<<<<<<<<<<<<<< About page >>>>>>>>>>>>>>
* ============================================================================
* Listens for a request from about us page and loads it
* ============================================================================
*/

router.get('/', function(req, res) {
	res.render('about.ejs');
});

module.exports = router;