var modal = document.getElementById("contact-modal")
var btn = document.getElementById("contact-button")
var span = document.getElementsByClassName("close")[0];

btn.onClick = function() {
	modal.style.display = "block";
}
span.onClick = function() {
	modal.style.display = "none";
	
window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}