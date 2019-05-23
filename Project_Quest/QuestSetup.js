let mainMenuButton = document.getElementById("mainMenuButton");
let contentArea = document.getElementById("contentArea");

let questModalTitle = document.getElementById("questModalTitle");
let nameInput = document.getElementById("nameInput");
let payInput = document.getElementById("payInput");

let allCheckBoxes = document.getElementById("allCheckBoxes");
let monday = document.getElementById("monday");
let tuesday = document.getElementById("tuesday");
let wednesday = document.getElementById("wednesday");
let thursday = document.getElementById("thursday");
let friday = document.getElementById("friday");
let saturday = document.getElementById("saturday");
let sunday = document.getElementById("sunday");

let deleteButton = document.getElementById("deleteButton");
let saveButton = document.getElementById("saveButton");

let confirmMessage = document.getElementById("confirmMessage");
let confirmDeleteButton = document.getElementById("confirmDeleteButton");

var selectedUserID = 0;
var selectedQuestID = 0;

mainMenuButton.onclick = mainMenu;
deleteButton.onclick = deleteConfirmation;
saveButton.onclick = saveQuest;
confirmDeleteButton.onclick = executeDelete;

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
          if (user.child("type").val() == "kid") {
            //setup header and button
            var hr1 = document.createElement("hr");

            var h3 = document.createElement("h3");
            h3.innerHTML = user.child("name").val();
            h3.align = "center";

            var headerDiv = document.createElement("div");
            headerDiv.className = "col-md-6";
            headerDiv.style = "float:none;margin:auto;padding:5px;";

            var newQuestButton = document.createElement("button");
            newQuestButton.style = "margin-bottom:0px;width:100%";
            newQuestButton.innerHTML = "+ Add New Quest";
            newQuestButton.addEventListener("click", function() {
              selectedUserID = user.key;
              selectedQuestID = 0;
              questModalTitle.innerHTML = "Add New Quest (" + user.child("name").val() + ")";
              nameInput.value = "";
              payInput.value = "";
              deleteButton.style.visibility = "hidden";
              setupCheckBoxes("");
              displayQuestModal();
            });

            var hr2 = document.createElement("hr");

            headerDiv.appendChild(newQuestButton);

            contentArea.appendChild(hr1);
            contentArea.appendChild(h3);
            contentArea.appendChild(headerDiv);
            contentArea.appendChild(hr2);

            //add quest content
            user.child("quest_list").forEach((quest) => {
              var questDiv = document.createElement("div");
              questDiv.className = "col-md-8";
              questDiv.style = "float:none;margin:auto;padding:5px;"

              var questButton = document.createElement("button");
              questButton.style = "width:100%";
              questButton.innerHTML = quest.child("name").val() + " - " + quest.child("days").val() + " - $" + quest.child("pay_per_week").val() + "/week";
              questButton.addEventListener("click", function() {
                selectedUserID = user.key;
                selectedQuestID = quest.key;
                questModalTitle.innerHTML = "Modify Quest (" + user.child("name").val() + ")";
                nameInput.value = quest.child("name").val();
                payInput.value = quest.child("pay_per_week").val();
                deleteButton.style.visibility = "visible";
                setupCheckBoxes(quest.child("days").val());
                displayQuestModal();
              });

              questDiv.appendChild(questButton);
              contentArea.appendChild(questDiv);
            });

            var row2 = document.createElement("div");
            row2.className = "col-md-12";

            var hr2 = document.createElement("hr");

            row2.appendChild(hr2);
            contentArea.appendChild(row2);
          }
        });
    })
  }
});

function displayQuestModal () {

  $("#questModal").modal();
}

function handleCheckUncheckAll () {
  if (allCheckBoxes.checked) {
    monday.checked = true;
    tuesday.checked = true;
    wednesday.checked = true;
    thursday.checked = true;
    friday.checked = true;
    saturday.checked = true
    sunday.checked = true;
  } else {
    monday.checked = false;
    tuesday.checked = false;
    wednesday.checked = false;
    thursday.checked = false;
    friday.checked = false;
    saturday.checked = false
    sunday.checked = false;
  }
}

function setupCheckBoxes (questDays) {
  if (questDays.includes("M")) {
    monday.checked = true;
  } else {
    monday.checked = false;
  }
  if (questDays.includes("TU")) {
    tuesday.checked = true;
  } else {
    tuesday.checked = false;
  }
  if (questDays.includes("W")) {
    wednesday.checked = true;
  } else {
    wednesday.checked = false;
  }
  if (questDays.includes("TH")) {
    thursday.checked = true;
  } else {
    thursday.checked = false;
  }
  if (questDays.includes("F")) {
    friday.checked = true;
  } else {
    friday.checked = false;
  }
  if (questDays.includes("SA")) {
    saturday.checked = true;
  } else {
    saturday.checked = false;
  }
  if (questDays.includes("SU")) {
    sunday.checked = true;
  } else {
    sunday.checked = false;
  }
}

function validateQuest () {
  if (nameInput.value == "") {
    return "Please input a valid quest name";
  } else if (!payInput.reportValidity()) {
    return "Please input a valid pay amount";
  } else if (!monday.checked && !tuesday.checked && !wednesday.checked && !thursday.checked && !friday.checked && !saturday.checked && !sunday.checked) {
    return "Please select at least one day";
  } else {
    return true;
  }
}

function saveQuest () {
  var validation = validateQuest();
  if (validation === true) {
    //get quest id
    if (selectedQuestID == 0) {
      selectedQuestID = new Date().getTime();
    }
    //buld quest day string
    var newQuestDays = "";
    if (monday.checked) {
      newQuestDays += "M";
    }
    if (tuesday.checked) {
      if (newQuestDays.length != 0) {
        newQuestDays += "/"
      }
      newQuestDays += "TU";
    }
    if (wednesday.checked) {
      if (newQuestDays.length != 0) {
        newQuestDays += "/"
      }
      newQuestDays += "W";
    }
    if (thursday.checked) {
      if (newQuestDays.length != 0) {
        newQuestDays += "/"
      }
      newQuestDays += "TH";
    }
    if (friday.checked) {
      if (newQuestDays.length != 0) {
        newQuestDays += "/"
      }
      newQuestDays += "F";
    }
    if (saturday.checked) {
      if (newQuestDays.length != 0) {
        newQuestDays += "/"
      }
      newQuestDays += "SA";
    }
    if (sunday.checked) {
      if (newQuestDays.length != 0) {
        newQuestDays += "/"
      }
      newQuestDays += "SU";
    }
    //save the new quest to quest_list
    dataRef = firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + selectedUserID + "/quest_list");
    dataRef.child(selectedQuestID).set({
      days: newQuestDays,
      name: nameInput.value,
      pay_per_week: payInput.value
    });
    desc.innerHTML = "Quest Saved";
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);

    $("#questModal").modal("hide");
  } else {
    desc.innerHTML = validation;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  }
}

function deleteConfirmation () {
  confirmMessage.innerHTML = "Are you sure you want to delete this quest? This will remove all reference to this quest, but money earned previously from doing this quest will not be affected."
  $("#confirmModal").modal();
}

function executeDelete () {
  dataRef = firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + selectedUserID + "/quest_list");
  dataRef.child(selectedQuestID).remove();
  desc.innerHTML = "Quest has been deleted";
  toast.className = "show";
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  $("#confirmModal").modal("hide");
}
