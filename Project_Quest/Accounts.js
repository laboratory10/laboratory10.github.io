let mainMenuButton = document.getElementById("mainMenuButton");

let depositButton = document.getElementById("depositButton");
let initiateDepositButton = document.getElementById("initiateDepositButton");
let confirmDepositButton = document.getElementById("confirmDepositButton");
let depositUser = document.getElementById("depositUser");
let depositAmount = document.getElementById("depositAmount");

let spendButton = document.getElementById("spendButton");
let initiateSpendButton = document.getElementById("initiateSpendButton");
let confirmSpendButton = document.getElementById("confirmSpendButton");
let spendUser = document.getElementById("spendUser");
let spendAmount = document.getElementById("spendAmount");

mainMenuButton.onclick = mainMenu;

function mainMenu() {
  window.location = "Users.html";
}

//$("#depositModal").on("hide.bs.modal");
//$("#depositModal").on("hidden.bs.modal");
//$("#confirmDepositModal").on("hide.bs.modal");

depositButton.addEventListener("click", displayDepositModal);
initiateDepositButton.addEventListener("click", depositConfirmation);
confirmDepositButton.addEventListener("click", executeDeposit);

spendButton.addEventListener("click", displaySpendModal);
initiateSpendButton.addEventListener("click", spendConfirmation);
confirmSpendButton.addEventListener("click", executeSpend);


function displayDepositModal () {
  $("#depositModal").modal();
}

function displaySpendModal () {
  $("#spendModal").modal();
}

function depositConfirmation () {
  let validation = validateDeposit(depositUser.selectedIndex, depositAmount);
  if (validation === true) {
    $("#depositModal").modal("hide");
    confirmDepositMessage.innerHTML = "Are you sure you want to deposit $" + parseFloat(depositAmount.value).toFixed(2) + " to " + depositUser.options[depositUser.selectedIndex].text + "'s Savings Account?"
    //depositUser.value
    $("#confirmDepositModal").modal();
  } else {
    desc.innerHTML = validation;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  }
}

function spendConfirmation () {
  firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + spendUser.value).once("value").then(function(snapshot) {
    let validation = validateSpend(spendUser.selectedIndex, spendAmount, parseFloat(snapshot.child("spending_balance").val()));
    if (validation === true) {
      $("#spendModal").modal("hide");
      confirmSpendMessage.innerHTML = "Are you sure you want to spend $" + parseFloat(spendAmount.value).toFixed(2) + " from " + spendUser.options[spendUser.selectedIndex].text + "'s Spending Account?"
      $("#confirmSpendModal").modal();
    } else {
      desc.innerHTML = validation;
      toast.className = "show";
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
    }
  });
}

function executeDeposit () {
  firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + depositUser.value).once("value").then(function(snapshot) {
    let currentBalance = parseFloat(snapshot.child("savings_balance").val());
    let newBalance = currentBalance + parseFloat(depositAmount.value);
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + depositUser.value + "/savings_balance").set(newBalance.toFixed(2));
    desc.innerHTML = "Funds have been deposited";
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
    $("#confirmDepositModal").modal("hide");
    clearDepositModal();
  });
}

function executeSpend () {
  firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + spendUser.value).once("value").then(function(snapshot) {
    let currentBalance = parseFloat(snapshot.child("spending_balance").val());
    let newBalance = currentBalance - parseFloat(spendAmount.value);
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + spendUser.value + "/spending_balance").set(newBalance.toFixed(2));
    desc.innerHTML = "Funds have been spent";
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
    $("#confirmSpendModal").modal("hide");
    clearSpendModal();
  });
}

function validateDeposit(userIndex, amt) {
  if (userIndex == 0) {
    return "Please select a child for the deposit";
  }
  if (isNaN(amt.value)) {
    return "Not a valid amount";
  }
  if (amt.value <= 0) {
    return "Not a valid amount";
  }
  if (amt.checkValidity() === false) {
    return "Not a valid amount";
  }
  //validation passed, return true
  return true;
}

function validateSpend(userIndex, amt, available) {
  if (userIndex == 0) {
    return "Please select a child for the deposit";
  }
  if (isNaN(amt.value)) {
    return "Not a valid amount";
  }
  if (amt.value <= 0) {
    return "Not a valid amount";
  }
  if (amt.checkValidity() === false) {
    return "Not a valid amount";
  }
  if (amt.value > available) {
    return "Insufficient funds";
  }

  //validation passed, return true
  return true;
}

function clearDepositModal () {
  depositUser.selectedIndex = 0;
  depositAmount.value = "0.00";
}

function clearSpendModal () {
  spendUser.selectedIndex = 0;
  spendAmount.value = "0.00";
}

firebase.auth().onAuthStateChanged(function() {
  if (!firebase.auth().currentUser) {
    window.location = "project_quest.html";
  } else {
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users").on('value', (snapshot) => {
      contentArea.innerHTML = ""
      snapshot.forEach((user) => {
        if (user.child("type").val() == "kid") {

          var optionDeposit = document.createElement("option");
          optionDeposit.text = user.child("name").val();
          optionDeposit.value = user.key;
          depositUser.add(optionDeposit);

          var optionSpend = document.createElement("option");
          optionSpend.text = user.child("name").val();
          optionSpend.value = user.key;
          spendUser.add(optionSpend);

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
