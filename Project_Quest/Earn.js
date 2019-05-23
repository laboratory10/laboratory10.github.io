let mainMenuButton = document.getElementById("mainMenuButton");
let pageLabel = document.getElementById("pageLabel");
let noQuestLabel = document.getElementById("noQuestLabel");

let completionModal = document.getElementById("completionModal");
let cancelButton = document.getElementById("cancelButton");
let completeButton = document.getElementById("completeButton");
let toast = document.getElementById("toast");
let desc = document.getElementById("desc");

let user = getQueryVariable("u");

mainMenuButton.onclick = mainMenu;


function mainMenu() {
  window.location = "Users.html";
}

firebase.auth().onAuthStateChanged(function() {
  if (!firebase.auth().currentUser || user == false) {
    window.location = "project_quest.html";
  } else {
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user).on('value', (snapshot) => {
      pageLabel.innerHTML = "Today's Quests - " + snapshot.child("name").val();
      contentArea.innerHTML = ""
      noQuestLabel.style.display = "initial"
      snapshot.child("quest_list").forEach((quest) => {
        //determine if the quest is available today
        let questDays = quest.child("days").val();
        let d = new Date();
        var currentDayOfWeek = "invalid";
        switch (d.getDay()) {
          case 0:
            currentDayOfWeek = "SU";
            break;
          case 1:
            currentDayOfWeek = "M";
            break;
          case 2:
            currentDayOfWeek = "TU";
            break;
          case 3:
            currentDayOfWeek = "W";
            break;
          case 4:
            currentDayOfWeek = "TH";
            break;
          case 5:
            currentDayOfWeek = "F";
            break;
          case 6:
            currentDayOfWeek = "SA";
            break;
        }
        if (questDays != null && questDays.includes(currentDayOfWeek)) {
          //build quest string id
          var questString = quest.key + "_" + d.getFullYear() + "_" + (d.getMonth() + 1) + "_" + d.getDate()

          //determine if the quest has already been completed by looking at the pending and completed lists
          var questStatus = "incomplete";
          if (snapshot.child("pending_quests").child(questString).val() != null) {
            questStatus = "pending";
          } else if (snapshot.child("completed_quests").child(questString).val() != null) {
            questStatus = "completed";
          }

          //create quest button
          var newButton = document.createElement("button");
          newButton.type = "button";
          newButton.style = "margin-bottom:0px;width:100%";
          newButton.addEventListener("click", function(){
            //task clicked, launch modal and allow for completion if incomplete
            promptForCompletion(questString, questDays, quest.child("pay_per_week").val());
          });

          //set correct picture based on questStatus
          var newImage = document.createElement("img");
          newImage.style="width:200px;"
          switch (questStatus) {
            case "incomplete":
              newImage.src = "QuestAssets/unchecked_box.svg";
              break;
            case "pending":
              newImage.src = "QuestAssets/pending_account_icon.svg";
              break;
            case "completed":
              newImage.src = "QuestAssets/checked_box.svg";
              break;

          }

          //set correct text
          var newText = document.createElement("text");
          newText.innerHTML = quest.child("name").val();

          //add items to layout
          var newDiv = document.createElement("div");
          newDiv.className = "col-md-6"
          newDiv.style = "float:none;margin:auto;text-align:center;"

          newButton.appendChild(newImage);
          newDiv.appendChild(newButton);
          newDiv.appendChild(newText);
          contentArea.appendChild(newDiv);

          //hide the noQuestLabel
          noQuestLabel.style.display = "none"
        }
      });
    })
  }
});

function promptForCompletion(questString, questDays, payPerWeek) {
  $("#completionModal").modal();
  completeButton.addEventListener("click", function(){
    $("#completionModal").modal("hide");

    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user).once("value").then(function(snapshot) {
      //figure out how much this quest is worth
      var frequency = 1;
      for (i = 0; i < questDays.length; i++) {
        if (questDays[i] == "/") {
          frequency += 1;
        }
      }
      let payPerOccurence = (parseFloat(payPerWeek) / parseFloat(frequency)).toFixed(2);

      //add quest to pending quests
      firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user + "/pending_quests/" + questString).set(payPerOccurence);

      //add pay to pending balance
      let currentBalance = parseFloat(snapshot.child("pending_balance").val());
      let newBalance = (currentBalance + parseFloat(payPerOccurence)).toFixed(2);
      firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user + "/pending_balance").set(newBalance);

      //show toast
      desc.innerHTML = "Quest completed!";
      toast.className = "show";
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
      completeButton.removeAttribute("onclick");
    });

  });
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
  }
 return false;
}
