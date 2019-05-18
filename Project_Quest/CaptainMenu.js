let mainMenuButton = document.getElementById("mainMenuButton");
let approveButton = document.getElementById("approveButton");
let accountsButton = document.getElementById("accountsButton");
let kidSetupButton = document.getElementById("kidSetupButton");
let questSetupButton = document.getElementById("questSetupButton");

mainMenuButton.onclick = mainMenu;
approveButton.onclick = navigateToApprove;
accountsButton.onclick = navigateToAccounts;
kidSetupButton.onclick = navigateToKidSetup;
questSetupButton.onclick = navigateToQuestSetup;

let user = getQueryVariable("u");

function mainMenu() {
  window.location = "Users.html";
}

function navigateToApprove() {
  if (user != false) {
    window.location = "Approve.html?u=" + user;
  } else {
    window.location = "Users.html";
  }
}

function navigateToAccounts() {
  if (user != false) {
    window.location = "Accounts.html?u=" + user;
  } else {
    window.location = "Users.html";
  }
}

function navigateToKidSetup() {
  if (user != false) {
    window.location = "KidSetup.html?u=" + user;
  } else {
    window.location = "Users.html";
  }
}

function navigateToQuestSetup() {
  if (user != false) {
    window.location = "QuestSetup.html?u=" + user;
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
