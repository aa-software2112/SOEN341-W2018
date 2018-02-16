var likeQuestion = 0;
var dislikeQuestion = 0;
var likeCount;
var dislikeCount;
var likeUsed = false;
var dislikeUsed = false;

//function that will run the increment function when the user clicks on the button
function getElementBtnIncrement(){
	document.getElementById("likeQuestion").addEventListener("click", incrementQuestion, false);
	likeCount = document.getElementById("likeCounter");
	document.getElementById("dislikeQuestion").addEventListener("click", decrementQuestion, false);
	dislikeCount = document.getElementById("dislikeCounter");

}

//function that increments the counter by one and displays it
function incrementQuestion(){
	if(!likeUsed){
		likeQuestion++;
		likeCount.innerHTML = likeQuestion; 
		likeUsed = true;
	}

}

function decrementQuestion(){
	if(!dislikeUsed){
		dislikeQuestion++;
		dislikeCount.innerHTML = dislikeQuestion; 
		dislikeUsed = true;
	}
	
	
}

window.addEventListener( "load", getElementBtnIncrement, false ); 