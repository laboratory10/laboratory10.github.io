let mainMenuButton = document.getElementById("mainMenuButton");
let userNameInput = document.getElementById("userNameInput");
let deleteButton = document.getElementById("deleteButton");
let saveButton = document.getElementById("saveButton");

let confirmMessage = document.getElementById("confirmMessage");
let confirmDeleteButton = document.getElementById("confirmDeleteButton");

mainMenuButton.onclick = mainMenu;

$("#userModal").on("hide.bs.modal", function () {selectedUserID = 0;});
$("#userModal").on("hidden.bs.modal", function () {userNameInput.value = "";});
$("#confirmModal").on("hide.bs.modal", function () {selectedUserID = 0;});

var selectedUserID = 0;
var pendingDeletionUserID = 0;

function mainMenu() {
  window.location = "Users.html";
}

firebase.auth().onAuthStateChanged(function() {
  if (!firebase.auth().currentUser) {
    window.location = "project_quest.html";
  } else {
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users").on('value', (snapshot) => {
      contentArea.innerHTML = ""
      snapshot.forEach((user) => {
        var newButton = document.createElement("button");
        newButton.innerHTML = user.child("name").val();
        newButton.type = "button";
        newButton.style = "margin-bottom:0px;width:100%";
        newButton.addEventListener("click", function() {
          displayUserModal(user.key, user.child("name").val(), user.child("type").val());
        });

        var newDiv = document.createElement("div");
        newDiv.className = "col-md-6"
        newDiv.style = "float:none;margin:auto;"

        newDiv.appendChild(newButton);
        contentArea.appendChild(newDiv);

      });
    })
  }
});

deleteButton.addEventListener("click", deleteConfirmation);
saveButton.addEventListener("click", updateUserData);
confirmDeleteButton.addEventListener("click", executeDelete);

function displayUserModal (userID, name, type) {
  selectedUserID = userID
  userNameInput.value = name;

  if (type == "captain") {
    deleteButton.style.visibility = "hidden";
    $("#userModal").modal();
  } else {
    deleteButton.style.visibility = "visible";
    $("#userModal").modal();
  }
}

function deleteConfirmation () {
  confirmMessage.innerHTML = "Are you sure you want to delete " + userNameInput.value + "? This is non-reversable and will result in all data being deleted...forever!"
  pendingDeletionUserID = selectedUserID;
  $("#confirmModal").modal();
}

function executeDelete () {
  dataRef = firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users");
  dataRef.child(pendingDeletionUserID).remove();
  desc.innerHTML = "User has been deleted";
  toast.className = "show";
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  $("#confirmModal").modal("hide");
}

function updateUserData () {
  if (userNameInput.value.length > 0 ) {
    if (selectedUserID == 0) {
      //this is a new user, give them an id and initialize their datset
      selectedUserID = new Date().getTime();
      firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + selectedUserID).set({
        name: userNameInput.value,
        type: "kid",
        savings_balance: "0.00",
        spending_balance: "0.00",
        giving_balance: "0.00",
        pending_balance: "0.00"
      });
      desc.innerHTML = "New user created!";
      toast.className = "show";
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
      $("#userModal").modal("hide");
    } else {
      firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + selectedUserID + "/name").set(userNameInput.value);
      desc.innerHTML = "User Info Saved!";
      toast.className = "show";
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
      $("#userModal").modal("hide");
    }
  } else {
    desc.innerHTML = "Name required!";
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  }
}
