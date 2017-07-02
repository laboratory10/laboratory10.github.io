//window.onload = function() {
	var maintext = document.getElementById("main-content");
	var container = document.getElementsByClassName("body");
	
	maintext.marginTop = ((container.height-150)-maintext.height)/2+"px";
	maintext.value = ((container.height-150)-maintext.height)/2+"px";
	
//}