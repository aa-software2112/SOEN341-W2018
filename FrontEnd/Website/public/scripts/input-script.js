

// Highlights all inputs on-click based on predefined style
window.addEventListener("load", function() {
	
	var inputs = document.getElementsByTagName("INPUT");
	
	console.log(typeof inputs);
	
	for (var i = 0; i<inputs.length; i++)
	{
		
		// Make sure navbar doesn't get affected
		if (inputs[i].type === "text" && inputs[i].name !== "search")
		{
			console.log(inputs[i]);
		
			inputs[i].addEventListener("focus", function(e) {
				
				console.log(e);
				e.target.style.border = " solid #668cff";
				
			});
			
			inputs[i].addEventListener("blur", function(e) {
				
				console.log(e);
				e.target.style.border = "";
				
			});
			
		}
		
	}
	
	
	var textareas = document.getElementsByTagName("TEXTAREA");
	
	for (var i = 0; i<textareas.length; i++)
	{
		
	
		textareas[i].addEventListener("focus", function(e) {
			
			console.log(e);
			e.target.style.border = "3px solid #668cff";
			
		});
		
		textareas[i].addEventListener("blur", function(e) {
			
			console.log(e);
			e.target.style.border = "";
			
		});
		
	}
	
	
	
})