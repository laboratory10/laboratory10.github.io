let mainMenuButton = document.getElementById("mainMenuButton");

mainMenuButton.onclick = mainMenu;


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
          var mainDiv = document.createElement("div");
          mainDiv.className = "col-md-6";
          mainDiv.style = "float:none;margin:auto;text-align:center;padding:5px;";

          var hr1 = document.createElement("hr");

          var h3 = document.createElement("h3");
          h3.innerHTML = user.child("name").val();

          var hr2 = document.createElement("hr");

          var row1 = document.createElement("div");
          row1.className = "row";

          var row2 = document.createElement("div");
          row2.className = "row";

          var savingsDiv = document.createElement("div");
          savingsDiv.className = "col-md-6";
          savingsDiv.style = "padding:0px;";
          var savingsText = document.createElement("text");
          savingsText.innerHTML = "Savings: $" + user.child("savings_balance").val();

          var spendingDiv = document.createElement("div");
          spendingDiv.className = "col-md-6";
          spendingDiv.style = "padding:0px;";
          var spendingText = document.createElement("text");
          spendingText.innerHTML = "Spending: $" + user.child("spending_balance").val();

          var givingDiv = document.createElement("div");
          givingDiv.className = "col-md-6";
          givingDiv.style = "padding:0px;";
          var givingText = document.createElement("text");
          givingText.innerHTML = "Giving: $" + user.child("giving_balance").val();

          var pendingDiv = document.createElement("div");
          pendingDiv.className = "col-md-6";
          pendingDiv.style = "padding:0px;";
          var pendingText = document.createElement("text");
          pendingText.innerHTML = "Pending: $" + user.child("pending_balance").val();

          savingsDiv.appendChild(savingsText);
          spendingDiv.appendChild(spendingText);
          givingDiv.appendChild(givingText);
          pendingDiv.appendChild(pendingText);

          row1.appendChild(savingsDiv);
          row1.appendChild(spendingDiv);
          row2.appendChild(givingDiv);
          row2.appendChild(pendingDiv);

          mainDiv.appendChild(hr1);
          mainDiv.appendChild(h3);
          mainDiv.appendChild(hr2);
          mainDiv.appendChild(row1);
          mainDiv.appendChild(row2);

          contentArea.appendChild(mainDiv);
        }
      });
    })
  }
});
