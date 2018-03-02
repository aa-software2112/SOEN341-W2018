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


//email transporter, contains username and password of email sender
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
	var subject = req.body.subject;
	//console.log (" Thank you "+ fname + " "+ lname + " from "+ country + " for contacting us.");
	console.log(req.body);

	//contains information about email that will be sent
	var mailOptions = {
		from: 'soen341qaproject@gmail.com',
		to: 'soen341qaproject@gmail.com',
		subject: 'Email sent by user',
		html: '<div style="margin: auto; background-color: #eaf7fa; width: 75%;"><h1 style="text-align: center;">From: ' + fname + ' ' + lname + '</h1><p style="text-align: center;">Message: ' + subject + '</p></div>'
	};

	//sends the email
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