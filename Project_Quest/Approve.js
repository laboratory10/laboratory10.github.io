let mainMenuButton = document.getElementById("mainMenuButton");
let contentArea = document.getElementById("contentArea");
let confirmModalContent = document.getElementById("confirmModalContent");
let approveButton = document.getElementById("approveButton");

mainMenuButton.onclick = mainMenu;
approveButton.onclick = approveQuests;

selectedQuests = [];
$("#confirmModal").on("hide.bs.modal", function () {selectedQuests = [];});

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
          //setup header
          var hr1 = document.createElement("hr")

          var userName = document.createElement("h3")
          userName.innerHTML = user.child("name").val();
          userName.align = "center";

          var noQuestLabel = document.createElement("h4")
          noQuestLabel.innerHTML = "- No Quests -";
          noQuestLabel.align = "center";
          var questsFoundFlag = false;

          contentArea.appendChild(hr1);
          contentArea.appendChild(userName);
          contentArea.appendChild(noQuestLabel);

          //setup pending
          if (user.hasChild("pending_quests")) {
            //set questFoundFlag to true
            questsFoundFlag = true;

            var headerDiv = document.createElement("div");
            headerDiv.className = "row";

            var headerColumn1 = document.createElement("div");
            headerColumn1.className = "col-md-6"
            headerColumn1.style = "padding-left:20px;padding-right:20px;padding-top:5px;padding-bottom:5px;margin:0px;";

            var headerText = document.createElement("h3");
            headerText.align = "center";
            headerText.style = "margin:5px;"
            headerText.innerHTML = "Pending Quests - " +  user.child("name").val();

            var headerColumn2 = document.createElement("div");
            headerColumn2.className = "col-md-6"
            headerColumn2.align = "center";
            headerColumn2.style = "padding-left:20px;padding-right:20px;padding-top:5px;padding-bottom:5px;margin:0px;";

            var approveAllButton = document.createElement("button");
            approveAllButton.style = "width:60%";
            approveAllButton.innerHTML = "Approve All Pending"

            headerColumn1.appendChild(headerText);
            headerColumn2.appendChild(approveAllButton);

            contentArea.appendChild(headerColumn1);
            contentArea.appendChild(headerColumn2);

            var questRow = document.createElement("div");
            questRow.className = "row";

            var pendingQuestList = [];

            user.child("pending_quests").forEach((quest) => {
              let questData = {userID: user.key,
                                name: user.child("quest_list").child(quest.key.split("_")[0]).child("name").val(),
                                payPerOccurence: quest.val(),
                                type: "pending",
                                questString: quest.key};

              pendingQuestList.push(questData);

              var questDiv = document.createElement("div");
              questDiv.className = "col-md-6";
              questDiv.style = "padding-left:20px;padding-right:20px;padding-top:5px;padding-bottom:5px;margin-bottom:5px;"

              var questButton = document.createElement("button");
              questButton.style = "width:100%;";
              questButton.innerHTML = questData["name"] + " - $"  + questData["payPerOccurence"] + " " + formatDateFromQuestString(questData["questString"]);
              questButton.addEventListener("click", function() {
                displayConfirmModal([questData]);
              });

              questDiv.appendChild(questButton);
              questRow.appendChild(questDiv);
              contentArea.appendChild(questRow);
            });

            approveAllButton.addEventListener("click", function() {
              displayConfirmModal(pendingQuestList);
            });

            var row2 = document.createElement("div");
            row2.className = "col-md-12";

            var hr2 = document.createElement("hr");

            row2.appendChild(hr2);
            contentArea.appendChild(row2);
          }

          //setup missed
          //for each of 10 days, starting with yesterday, going back in time
          var missedQuestList = []
          let d = new Date();
          for (var j = 0; j < 10; j++) {
            d.setDate(d.getDate()-1);
            user.child("quest_list").forEach((quest) => {
              //determine if the quest is available today
              let questDays = quest.child("days").val();
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
                if (user.child("pending_quests").hasChild(questString)) {
                  questStatus = "pending";
                } else if (user.child("completed_quests").hasChild(questString)) {
                  questStatus = "completed";
                }

                //figure out how much this quest is worth
                var payPerWeek = quest.child("pay_per_week").val();
                var frequency = 1;
                for (i = 0; i < questDays.length; i++) {
                  if (questDays[i] == "/") {
                    frequency += 1;
                  }
                }
                let payPerOccurence = (parseFloat(payPerWeek) / parseFloat(frequency)).toFixed(2);

                if (questStatus == "incomplete") {
                  let questData = {userID: user.key,
                                    name: user.child("quest_list").child(quest.key.split("_")[0]).child("name").val(),
                                    payPerOccurence: payPerOccurence,
                                    type: "missed",
                                    questString: questString};
                  missedQuestList.push(questData);
                }
              }
            })
          }
          //now that all of the missed quests are identified we can populate that section
          if (missedQuestList.length > 0) {
            //set questFoundFlag to true
            questsFoundFlag = true;

            var headerDiv = document.createElement("div");
            headerDiv.className = "row";

            var headerColumn1 = document.createElement("div");
            headerColumn1.className = "col-md-6"
            headerColumn1.style = "padding-left:20px;padding-right:20px;padding-top:5px;padding-bottom:5px;margin:0px;";

            var headerText = document.createElement("h3");
            headerText.align = "center";
            headerText.style = "margin:5px;"
            headerText.innerHTML = "Missed Quests - " +  user.child("name").val();

            var headerColumn2 = document.createElement("div");
            headerColumn2.className = "col-md-6"
            headerColumn2.align = "center";
            headerColumn2.style = "padding-left:20px;padding-right:20px;padding-top:5px;padding-bottom:5px;margin:0px;";

            var approveAllButton = document.createElement("button");
            approveAllButton.style = "width:60%";
            approveAllButton.innerHTML = "Approve All Missed"

            headerColumn1.appendChild(headerText);
            headerColumn2.appendChild(approveAllButton);

            contentArea.appendChild(headerColumn1);
            contentArea.appendChild(headerColumn2);

            var questRow = document.createElement("div");
            questRow.className = "row";

            for (quest in missedQuestList) {
              var questDiv = document.createElement("div");
              questDiv.className = "col-md-6";
              questDiv.style = "padding-left:20px;padding-right:20px;padding-top:5px;padding-bottom:5px;margin-bottom:5px;"

              var questButton = document.createElement("button");
              questButton.style = "width:100%;";
              questButton.innerHTML = missedQuestList[quest]["name"] + " - $"  + missedQuestList[quest]["payPerOccurence"] + " " + formatDateFromQuestString(missedQuestList[quest]["questString"]);
              let questData = missedQuestList[quest]
              questButton.addEventListener("click", function() {
                displayConfirmModal([questData]);
              });

              questDiv.appendChild(questButton);
              questRow.appendChild(questDiv);
              contentArea.appendChild(questRow);
            }

            approveAllButton.addEventListener("click", function() {
              displayConfirmModal(missedQuestList);
            });

            var row2 = document.createElement("div");
            row2.className = "col-md-12";

            var hr2 = document.createElement("hr");

            row2.appendChild(hr2);
            contentArea.appendChild(row2);
          }
          //hide no quest label if questFoundFlag is true
          if (questsFoundFlag == true) {
            contentArea.removeChild(noQuestLabel);
          }
        }
      });
    });
  }
});

function approveQuests () {
  firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + selectedQuests[0]["userID"]).once("value").then(function(snapshot) {
    let type = selectedQuests[0]["type"];
    var totalPay = 0;
    dataRef = firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + selectedQuests[0]["userID"]);
    for (quest in selectedQuests) {
      let questString = selectedQuests[quest]["questString"];
      let pay = selectedQuests[quest]["payPerOccurence"];
      //add quest string to completed_quests
      dataRef.child("completed_quests").child(questString).set(pay);
      //if pending, remove from pending quests
      if (type == "pending") {
        dataRef.child("pending_quests").child(questString).remove();
      }
      //sum total value of approval
      totalPay += parseFloat(pay);

    }
    //update new savings balance (and pending if appropriate)
    var savings_balance = parseFloat(snapshot.child("savings_balance").val());
    savings_balance += parseFloat(totalPay);
    dataRef.child("savings_balance").set(savings_balance.toFixed(2));

    if (type == "pending") {
      var pending_balance = parseFloat(snapshot.child("pending_balance").val());
      pending_balance -= parseFloat(totalPay);
      dataRef.child("pending_balance").set(pending_balance.toFixed(2));
    }

    desc.innerHTML = "Successfully approved " + selectedQuests.length + "quests!";
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);

    $("#confirmModal").modal("hide");
  });
}

function displayConfirmModal (questList) {
  selectedQuests = questList;

  var questQuantity = 0;
  var pay = 0;

  for (quest in questList) {
    questQuantity += 1;
    pay += parseFloat(questList[quest]["payPerOccurence"]);
  }

  if (questQuantity == 1) {
    confirmModalContent.innerHTML =  "Are you sure you want to approve payment of $" + pay.toFixed(2) + " for this quest?";
  } else if (questList[quest]["type"] == "pending") {
    confirmModalContent.innerHTML =  "Are you sure you want to approve payment for all " + questQuantity + " pending quests, a total of $"  + pay.toFixed(2) + "?";
  } else if (questList[quest]["type"] == "missed") {
    confirmModalContent.innerHTML =  "Are you sure you want to approve payment for all " + questQuantity + " missed quests, a total of $"  + pay.toFixed(2) + "?";
  }

  $("#confirmModal").modal();
}


function formatDateFromQuestString (questString) {
  var month = "";

  switch (questString.split("_")[2]) {
    case "1":
      month = "January";
      break;
    case "2":
      month = "February";
      break;
    case "3":
      month = "March";
      break;
    case "4":
      month = "April";
      break;
    case "5":
      month = "May";
      break;
    case "6":
      month = "June";
      break;
    case "7":
      month = "July";
      break;
    case "8":
      month = "August";
      break;
    case "9":
      month = "September";
      break;
    case "10":
      month = "October";
      break;
    case "11":
      month = "November";
      break;
    case "12":
      month = "December";
      break;
  }

  return "(" + questString.split("_")[3] + " " + month + ")";
}
