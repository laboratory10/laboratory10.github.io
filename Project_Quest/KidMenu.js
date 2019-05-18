let mainMenuButton = document.getElementById("mainMenuButton");
let earnButton = document.getElementById("earnButton");
let saveButton = document.getElementById("saveButton");

mainMenuButton.onclick = mainMenu;
earnButton.onclick = navigateToEarn;
saveButton.onclick = navigateToSave;

let user = getQueryVariable("u");

function mainMenu() {
  window.location = "Users.html";
}

function navigateToEarn() {
  if (user != false) {
    window.location = "Earn.html?u=" + user;
  } else {
    window.location = "Users.html";
  }
}

function navigateToSave() {
  if (user != false) {
    window.location = "Save.html?u=" + user;
  } else {
    window.location = "Users.html";
  }
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
 return(false);
}
