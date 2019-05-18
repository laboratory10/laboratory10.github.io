let logoutButton = document.getElementById("logoutButton");
let contentArea = document.getElementById("contentArea");

logoutButton.onclick = logout;

function logout() {
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }).catch(function(error) {
    // An error happened.
  });
}

firebase.auth().onAuthStateChanged(function() {
  if (!firebase.auth().currentUser) {
    window.location = "project_quest.html";
  } else {
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users").on('value', (snapshot) => {
      contentArea.innerHTML = ""
      snapshot.forEach((child) => {
        var newButton = document.createElement("button");
        newButton.innerHTML = child.child("name").val();
        newButton.type = "button";
        newButton.style = "margin-bottom:0px;width:100%";
        newButton.addEventListener("click", function(){
          if (child.child("type").val() == "captain") {
            window.location = "CaptainMenu.html?u=" + child.key;
          } else {
            window.location = "KidMenu.html?u=" + child.key;
          }
        })

        var newDiv = document.createElement("div");
        newDiv.className = "col-md-6"
        newDiv.style = "float:none;margin:auto;"

        newDiv.appendChild(newButton);
        contentArea.appendChild(newDiv);

      });
    })
  }
});
