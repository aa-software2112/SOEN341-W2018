exports.loginChecker = function(redirect_to)
{
	console.log(redirect_to);
	return function (req, res, next)
	{
		console.log(req.session);
		console.log("Logged in? " + (req.session.logged == 'true'));
		
		// When not logged on, redirect to the login page
		if (req.session.logged == true)
			next();
		else
		{
			console.log("redirecting to " + redirect_to);
			res.redirect(redirect_to);
			
		}		
	}
}