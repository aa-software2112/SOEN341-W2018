function openTab(event, questionTab) {
    var i, questionTabContent, navLink;
    questionTabContent = document.getElementsByClassName("card-body");
    for (i = 0; i < questionTabContent.length; i++) {
        questionTabContent[i].style.display = "none";
    }
    navLink = document.getElementsByClassName("tab-link");
    for (i = 0; i < navLink.length; i++) {
        navLink[i].className = navLink[i].className.replace(" active", "");
    }
    document.getElementById(questionTab).style.display = "block";
    event.currentTarget.className += " active";
}