/** 
* ============================================================================
*  Set up express, body parser, cookies, and ejs - Modules
* ============================================================================
*/

var express = require("express");
var path = require('path');
var util = require('util');
var bodyParser = require("body-parser");
var date = require('date-and-time');
var sortBy = require('sort-by');
var cookieSession = require('cookie-session');

var test = "global";
var homepage = require('./routes/homepage');
var forum_page = require('./routes/forum_page');
var about_page = require('./routes/about_page');
var contact_page = require('./routes/contact_page');
var search_page = require('./routes/search_page');
var signup_page = require('./routes/signup_page');
var login_page = require('./routes/login_page');
var ask_page = require('./routes/ask_page');
var userprofile_page = require('./routes/userprofile_page');
var logout = require('./routes/logout');

var app = express();

/** 
* ============================================================================
*  Middleware
* ============================================================================
*/

// Cookies
app.use(cookieSession({
	keys: ['secret'],
	maxAge: 365*24*60*60*1000
	// Cookie stored on client-side for 1 year in milliseconds
}));


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
*  Cookie Setup 
* ============================================================================
*/

// Sends cookie to locals for use in ejs file
app.use(function(req, res, next) {
	
	console.log("cookiemiddleware");
	console.log(req.originalUrl);
	console.log("Inbound Cookie: " + util.inspect(req.session) + "\n");
	
	if (req.session.logged == true)
	{
		res.locals.username = req.session.username;
		res.locals.user_id = req.session.user_id;
		res.locals.country = req.session.country;
		res.locals.dateOfBirth = req.session.dateOfBirth;
		res.locals.logged = req.session.logged;
		res.locals.fName = req.session.fName;
		res.locals.lName = req.session.lName;
		console.log("Outbound cookie " + util.inspect(res.locals));
	}
	
	next();
});


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
app.use('/logout', logout);


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