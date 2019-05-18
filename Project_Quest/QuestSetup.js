let mainMenuButton = document.getElementById("mainMenuButton");

mainMenuButton.onclick = mainMenu;


function mainMenu() {
  window.location = "Users.html";
}

firebase.auth().onAuthStateChanged(function() {
  if (!firebase.auth().currentUser || user == false) {
    window.location = "project_quest.html";
  } else {
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user).on('value', (snapshot) => {

    })
  }
});
