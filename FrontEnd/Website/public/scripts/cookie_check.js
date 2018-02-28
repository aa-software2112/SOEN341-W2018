window.addEventListener("load", check_cookie);


function check_cookie()
{
	if (!navigator.cookieEnabled)
	{
		// Warn user
		document.getElementById("cookie-msg").innerHTML = "Please enable cookies to Login, then refresh page";
				
				
		// Lock the login button
		document.getElementById("login-btn").addEventListener("click", function(e) {
			
			e.preventDefault();
			
		})
	}
}