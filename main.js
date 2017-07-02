//window.onload = function() {
	var maintext = document.getElementById("main-content");
	var container = document.getElementsByClassName("body");
	
	maintext.style.marginTop = ((container.offsetHeight)-150)/2+"px";
	maintext.value = ((container.offsetHeight)-150)/2+"px";
	
//}