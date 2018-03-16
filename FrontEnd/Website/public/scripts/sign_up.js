function checkLogin(){
				return checkPassword();
			}



			function checkPassword(){
				var dom = document.getElementById("password");
				var password = dom.value;
				var letter = password.search(/[A-Z]/);
				var number = password.search(/[0-9]/);
				var letterCheck;
				var numberCheck;
				//checks if it contains at least one number and letter
				letterCheck = (letter != -1);
				numberCheck = (number != -1);

				//checks if pass contains letters and numbers only
				var ok = password.search(/^[A-Za-z0-9]+$/);

				var returnVal;

				//checks if password is at least 6 characters
				if((ok == 0) && (password.length >= 6))
					returnVal = (letterCheck && numberCheck);
				else
					returnVal = false;

				if(returnVal)
					return true;
				else{
					alert("Username or password does not match the allowed format");
					return false;
				}


			}
