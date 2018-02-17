To fully see the functionalities of the latest version of the website as of  February 16th, 2018 11:30 pm: 

Remember that some functionalities will not display correctly locally, because Our database entries are different. 
When you want to try the functionalities. I suggest:

signing up 3-4 new users.
asking at least 10 question (So they are displayed on homepage)
Everytime you ask a question, just make 3-4 answers (the user_id who answers is static for now, so if you want 
more user names to show, before answer, make sure to change the user id on line 216~!!, you would have to restart the app.js if you are not using nodemon)

Important, BEFORE you restart app.js check your QUESTION TABLE to see the latest question_id and then change var qId to that one (our forum page get is faking that is dynamically loading the last question id from the table)

To run website:

// Most Recent
Enter the "Website" folder, and run the "home_page.html" to view the site's template



// Deprecated
-Ensure nodeJS is installed
-Navigate to "Website" directory in command line
-type: node app.js in command line
-Server will open on PORT:3000 (console log should confirm this)
-Go to http://localhost:3000 in your browser to access the landing page
-ctrl + c will close the server in the command prompt
