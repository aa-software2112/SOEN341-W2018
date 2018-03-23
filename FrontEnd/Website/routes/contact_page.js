var express = require("express")
var router = express.Router();

var path = require("path");
var util = require("util");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");

// Database connection
const mysql = require("mysql");
var db = require("../database/database");

/** <<<<<<<<<<<<<<< Contact page >>>>>>>>>>>>>>
* ============================================================================
* Listens to contact us page request and loads it
*
*
* ============================================================================
*/

router.get("/" , function(req,res) {
	res.render("contact.ejs");
});


//email transporter, contains username and password of email sender
var transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "soen341qaproject@gmail.com",
		pass: "SOEN341W18"
	}
});

/* Listens for user input from conctact us page*/
router.post("/", function(req,res) {
	var fname = req.body.firstname;
	var lname = req.body.lastname;
	var country = req.body.country;
	var subject = req.body.subject;
	
	console.log(req.body);

	// Uses the ejs rendering engine to render the email 
    // Pass in variables that will be used in email
    res.render("email_user", {fname: req.body.firstname, lName: req.body.lastname, message: req.body.subject}, function(err, html) { 
		if (err) {
			console.log("error rendering email template:", err) 
			return;
		} else {

			//contains information about email that will be sent
			var mailOptions = {
				from: "soen341qaproject@gmail.com",
				to : req.body.email,
				subject: "Thank You For Contacting Us",
				generateTextFromHtml : true, 
				html: html 
			};

			//sends the email
			transporter.sendMail(mailOptions, function(error, response) {
				if(error) {
					console.log(error);
					res.send("Mail Error! Try again");
				} else {
					console.log(response);
					res.send("Mail succesfully sent!");
				}
			});
		} 
    }); 

    // Uses the ejs rendering engine to render the email 
    // Pass in variables that will be used in email
    res.render("email_website", {fname: req.body.firstname, lName: req.body.lastname, country: req.body.country, message: req.body.subject}, function(err, html) { 
		if (err) {
			console.log("error rendering email template:", err);
			return;
		} else {

			//contains information about email that will be sent
			var mailOptions = {
				from: "soen341qaproject@gmail.com",
				to : "soen341qaproject@gmail.com",
				subject: "A user has contacted you!",
				generateTextFromHtml : true, 
				html: html 
			};

			//sends the email
			transporter.sendMail(mailOptions, function(error, response) {
				if (error) {
					console.log(error);
					res.send("Mail Error! Try again");
				} else {
					console.log(response);
					res.send("Mail succesfully sent!");
				}
			});
		} 
    }); 

    res.redirect("/contact");
});


module.exports = router;