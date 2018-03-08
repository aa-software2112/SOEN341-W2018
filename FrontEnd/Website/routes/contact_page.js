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


    res.render('email', {fname: req.body.firstname, lName: req.body.lastname}, function(err, html){ 
    if (err) {
        console.log('error rendering email template:', err) 
        return
    } else {

    	//contains information about email that will be sent
        var mailOptions = {
            from: 'soen341qaproject@gmail.com',
            to : 'soen341qaproject@gmail.com',
            subject: 'Thank You For Contacting Us',
            generateTextFromHtml : true, 
            html: html 
        };

		//sends the email
        transporter.sendMail(mailOptions, function(error, response){
            if(error) {
                console.log(error);
                res.send('Mail Error! Try again')
            } else {
                console.log(response);

                res.send("Mail succesfully sent!")
            }
        });


        mailOptions = {
            from: 'soen341qaproject@gmail.com',
            to : req.session.email,
            subject: 'Thank You For Contacting Us',
            generateTextFromHtml : true,
            html: html 
        };

        
        transporter.sendMail(mailOptions, function(error, response){
            if(error) {
                console.log(error);
                res.send('Mail Error! Try again')
            } else {
                console.log(response);

                res.send("Mail succesfully sent!")
            }
        }); */


      } 
    }); 

    res.redirect("/contact");
});


module.exports = router;