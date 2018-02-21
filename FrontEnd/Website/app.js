/** 
* ============================================================================
*  Set up express, body parser, and ejs - Modules
* ============================================================================
*/

var express = require("express");
var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');
var sortBy = require('sort-by');

var homepage = require('./routes/homepage');
var forum_page = require('./routes/forum_page');
var about_page = require('./routes/about_page');
var contact_page = require('./routes/contact_page');
var search_page = require('./routes/search_page');
var signup_page = require('./routes/signup_page');
var login_page = require('./routes/login_page');
var ask_page = require('./routes/ask_page');
var userprofile_page = require('./routes/userprofile_page');

var app = express();

/** 
* ============================================================================
*  Middleware
* ============================================================================
*/

app.use(bodyParser.urlencoded({extended: true}));

// Views engine setup
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

//Static files in Express must go inside the directory specified. This is used for about us page, so far.
app.use( express.static( "public/about_team_img" ));

// Links express to the stylesheets
app.use(express.static(path.join(__dirname, 'public')));


/** 
* ============================================================================
*  Link to the path in our URL
* ============================================================================
*/

app.use(['/', '/home'], homepage);
app.use('/question_forum', forum_page);
app.use('/about', about_page);
app.use('/contact', contact_page);
app.use('/search', search_page);
app.use('/sign_up', signup_page);
app.use('/login', login_page);
app.use('/ask', ask_page);
app.use('/askform', ask_page);

app.use('/user_profile', userprofile_page);


/** 
* ============================================================================
*  Catches invalid URL requests 
* ============================================================================
*/
// Catch 404 and forward to err handler
app.use(function(req, res, next) {
	var err = new Error('Not found');
	err.status = 404;
	next(err);
});

/* error handlers 
* development error handler
* will print stacktrace
*/
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('invalid_page', {
			message: err.message,
			error: err
		});
	});
}

/* production error handler
* no stacktraces leaked to user
*/
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('invalid_page', {
		message: err.message,
		error: {}
	});
});

/** 
* ============================================================================
*  Makes the server listen for req/res - http://localhost:3000
* ============================================================================
*/
app.listen(3000, function() {
	console.log("Server Running on Port 3000");
	console.log("Working Directory: " + __dirname);
});

module.exports = app;