var likeQuestion = 0;
var dislikeQuestion = 0;
var likeCount;
var dislikeCount;

//function that will run the increment function when the user clicks on the button
function getElementBtnIncrement(){
	document.getElementById("likeQuestion").addEventListener("click", incrementQuestion, false);
	likeCount = document.getElementById("likeCounter");
	document.getElementById("dislikeQuestion").addEventListener("click", decrementQuestion, false);
	dislikeCount = document.getElementById("dislikeCounter");

}

//function that increments the counter by one and displays it
function incrementQuestion(){
	likeQuestion++;
	likeCount.innerHTML = likeQuestion; 
}

function decrementQuestion(){
	dislikeQuestion++;
	dislikeCount.innerHTML = dislikeQuestion; 
}

window.addEventListener( "load", getElementBtnIncrement, false ); 