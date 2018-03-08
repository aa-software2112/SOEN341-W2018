
window.addEventListener("load", vote_listeners);


function vote_listeners()
{
	
	// Get question up button
	var qup = document.getElementsByClassName("qup")[0];
	var qdown = document.getElementsByClassName("qdown")[0];
	
	// Attach listeners if the user is logged in
	if (qup.id !== "q-upvote-null")
		qup.addEventListener("click", function(e) {
			
			console.log("Upvoting!")
			
			var vote = e.srcElement.id.split("-");
			
			// Send the question upvote to backend
			register_vote(e.srcElement, "q", vote[3], vote[2], 1);
			
		});
	
	if (qdown.id !== "q-downvote-null")
		qdown.addEventListener("click", function(e) {
			
			console.log("Downvoting!");
			
			var vote = e.srcElement.id.split("-");
			
			// Send the question downvote to backend
			register_vote(e.srcElement, "q", vote[3], vote[2], -1);
			
		});
	
	// Get all the answer buttons
	var aup = document.getElementsByClassName("ans-upvote");
	var adown = document.getElementsByClassName("ans-downvote");
	
	// Attach listeneres if the user is logged in
	for (var i = 0; i<aup.length; i++)
	{
		// User is logged on
		if(aup[i].id.split("-")[2] !== "null")
			aup[i].addEventListener("click", function(e)
			{
				
				console.log("Answer upvote " + e.srcElement.id.split("-")[2]);
				
				var vote = e.srcElement.id.split("-");
				
				// Send the answer upvote to backend
				register_vote(e.srcElement, "a", vote[3], vote[2], 1);
				
			});
			
		// User is logged on
		if(adown[i].id.split("-")[2] !== "null")
			adown[i].addEventListener("click", function(e)
			{
				
				console.log("Answer downvote " + e.srcElement.id.split("-")[2]);
				
				var vote = e.srcElement.id.split("-");
							
				// Send the answer downvote to backend
				register_vote(e.srcElement, "a", vote[3], vote[2], -1);
				
			});
		
	} // Upvotes & Downvotes
	
	
}

// Vote type should either be "q" for question or "a" for answer
// user_id is the user who votes
// vote_id is the id of the question or answer voted on
// vote_value should be 1 or -1 for upvote and downvote, respectively
function register_vote(srcElem, vote_type, user_id, vote_id, vote_value)
{
		
	// Send data to server side
	// Start the XMLHttpRequest
	var xml = new XMLHttpRequest();
	var method = "POST";
	var url;
	
	if (vote_type === "a")
		url = "/vote/answer-vote";
	else if (vote_type === "q")
		url = "/vote/question-vote";
	
	xml.open(method, url, true);
	xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	// Set the outbound values 
	var urlout = new URLSearchParams();
	
	// The outbound message
	urlout.append('user_id', user_id);
	
	if (vote_type === "a")
		urlout.append('answer_id', vote_id);
	else if (vote_type === "q")
		urlout.append('question_id', vote_id);
	
	urlout.append('vote', vote_value);
	
	// Send the message
	xml.send(urlout);
	
	console.log("Sent " + urlout + " !");
	
	// Wait for response
	xml.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			response(this, vote_id, vote_type);
		}
	};
		

	
}

function response(r, vote_id, vote_type)
{
	
	console.log(r.response);
	
	// Pick ID based on vote type
	var count_id = vote_type === 'q' ? "q-votevalue" : "ans-count-" + String(vote_id);
	
	document.getElementById(count_id).innerHTML = r.response;
	
	
}
