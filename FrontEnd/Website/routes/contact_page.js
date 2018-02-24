var express = require('express')
var router = express.Router();

var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var nodemailer = require('nodemailer');

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


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'soen341qaproject@gmail.com',
    pass: 'SOEN341W18'
  }
});

/* Listens for user input from conctact us page*/
router.post('/', (req,res) => {
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var country = req.body.country;
	//console.log (" Thank you "+ fname + " "+ lname + " from "+ country + " for contacting us.");
	console.log(req.body);


	var mailOptions = {
		from: 'soen341qaproject@gmail.com',
		to: 'soen341qaproject@gmail.com',
		subject: 'new email',
		text: 'test'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});


	res.redirect("/contact");
});

module.exports = router;