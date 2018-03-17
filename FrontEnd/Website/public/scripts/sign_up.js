function checkLogin(){
				return (checkPassword() && checkEmail());
			}



			function checkEmail(){
				var domEmail = document.getElementById("signup_email");
				 var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  				 var emailReturn = re.test(domEmail.value);

  				 if(emailReturn)
					return true;
				else{
					alert("Email is not in correct format.");
					return false;
				}
  				 


			}		



			function checkPassword(){
				var domPassword = document.getElementById("signup_password");
				var password = domPassword.value;
				var lowerLetter = password.search(/[a-z]/);
				var upperLetter = password.search(/[A-Z]/);
				var number = password.search(/[0-9]/);
				var lowerLetterCheck;
				var numberCheck;
				var upperLetterCheck;
				//checks if it contains at least one number and letter
				lowerLetterCheck = (lowerLetter != -1);
				upperLetterCheck = (upperLetter != -1);
				numberCheck = (number != -1);

				//checks if pass contains letters and numbers only
				var ok = password.search(/^[A-Za-z0-9]+$/);

				var returnVal;

				//checks if password is at least 6 characters
				if((ok == 0) && (password.length >= 6))
					returnVal = (lowerLetterCheck && numberCheck && upperLetterCheck);
				else
					returnVal = false;

				if(returnVal)
					return true;
				else{
					alert("Password does not match the allowed format.\nMake sure that password contains letters and numbers only.\nMake sure that at least one upper case and lower case letter is used.");
					return false;
				}


			}