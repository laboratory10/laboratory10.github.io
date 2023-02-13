let mainMenuButton = document.getElementById("mainMenuButton");
let depositButton = document.getElementById("depositButton");
let initiateDepositButton = document.getElementById("initiateDepositButton");
let confirmDepositButton = document.getElementById("confirmDepositButton");

let depositUser = document.getElementById("depositUser");
let depositAmount = document.getElementById("depositAmount");

mainMenuButton.onclick = mainMenu;

//depositButton.onclick = displayDepositModal;
//modalCancel.onclick = clearDepositModal;
//modalDeposit.onclick = depositConfirmation;


function mainMenu() {
  window.location = "Users.html";
}

$("#depositModal").on("hide.bs.modal");
$("#depositModal").on("hidden.bs.modal");
$("#confirmModal").on("hide.bs.modal");

depositButton.addEventListener("click", function() {displayUserModal();});
initiateDepositButton.addEventListener("click", depositConfirmation);
confirmDepositButton.addEventListener("click", executeDeposit);


function displayUserModal () {
  $("#depositModal").modal();
}

function depositConfirmation () {
  let validation = validateDeposit(depositUser.selectedIndex, depositAmount);
  if (validation === true) {
    $("#depositModal").modal("hide");
    confirmMessage.innerHTML = "Are you sure you want to deposit $" + parseFloat(depositAmount.value).toFixed(2) + " to " + depositUser.options[depositUser.selectedIndex].text + "'s Savings Account?"
    //depositUser.value
    $("#confirmModal").modal();
  } else {
    desc.innerHTML = validation;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  }
}

function executeDeposit () {
  firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + depositUser.value + "/savings_balance").set(parseFloat(depositAmount.value).toFixed(2));
  desc.innerHTML = "Funds have been deposited";
  toast.className = "show";
  setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  $("#confirmModal").modal("hide");
  clearDepositModal();
}

function validateDeposit(userIndex, depositAmount) {
  if (userIndex == 0) {
    return "Please select a child for the deposit"
  }
  if (isNaN(depositAmount.value)) {
    return "Not a valid amount"
  }
  if (depositAmount.value <= 0) {
    return "Not a valid amount"
  }
  if (depositAmount.checkValidity() === false) {
    return "Not a valid amount"
  }
  //validation passed, return true
  return true;
}

function clearDepositModal () {
  depositUser.selectedIndex = 0;
  depositAmount.value = "0.00";
}

firebase.auth().onAuthStateChanged(function() {
  if (!firebase.auth().currentUser) {
    window.location = "project_quest.html";
  } else {
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users").on('value', (snapshot) => {
      contentArea.innerHTML = ""
      snapshot.forEach((user) => {
        if (user.child("type").val() == "kid") {

          var option = document.createElement("option");
          option.text = user.child("name").val();
          option.value = user.key;
          depositUser.add(option);

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
