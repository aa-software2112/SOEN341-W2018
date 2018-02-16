function checkLogin(){
				return checkPassword();
			}



			function checkPassword(){
				var dom = document.getElementById("password");
				var password = dom.value;
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

				//checks if password is at least 4 characters
				if((ok == 0) && (password.length >= 6))
					returnVal = (lowerLetterCheck && numberCheck && upperLetterCheck);
				else
					returnVal = false;

				if(returnVal)
					return true;
				else{
					alert("Password does not match the allowed format.\nMake sure password contains letters and numbers only.");
					return false;
				}


			}