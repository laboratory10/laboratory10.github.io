let mainMenuButton = document.getElementById("mainMenuButton");
let pageLabel = document.getElementById("pageLabel");
let savingsBalance = document.getElementById("savingsBalance");
let spendingBalance = document.getElementById("spendingBalance");
let givingBalance = document.getElementById("givingBalance");
let pendingBalance = document.getElementById("pendingBalance");

let transferModal = document.getElementById("transferModal");
let cancelButton = document.getElementById("cancelButton");
let transferButton = document.getElementById("transferButton");
let toast = document.getElementById("toast");
let desc = document.getElementById("desc");

let fromAccountSelect = document.getElementById("fromAccountSelect");
let toAccountSelect = document.getElementById("toAccountSelect");
let transferAmount = document.getElementById("transferAmount");

let user = getQueryVariable("u");

mainMenuButton.onclick = mainMenu;
transferButton.onclick = transferFunds;

function mainMenu() {
  window.location = "Users.html";
}

firebase.auth().onAuthStateChanged(function() {
  if (!firebase.auth().currentUser || user == false) {
    window.location = "project_quest.html";
  } else {
    firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user).on("value", (snapshot) => {
      pageLabel.innerHTML = "Accounts - " + snapshot.child("name").val();

      savingsBalance.innerHTML = "Savings Balance: $" + snapshot.child("savings_balance").val();
      spendingBalance.innerHTML = "Spending Balance: $" + snapshot.child("spending_balance").val();
      givingBalance.innerHTML = "Giving Balance: $" + snapshot.child("giving_balance").val();
      pendingBalance.innerHTML = "Pending Balance: $" + snapshot.child("pending_balance").val();
    })
  }
});

function transferFunds() {
  let fromAccount = fromAccountSelect.value;
  let toAccount = toAccountSelect.value;
  let amount = parseFloat(transferAmount.value);

  firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user).once("value").then(function(snapshot) {
    let fromBalance = parseFloat(snapshot.child(fromAccount).val());
    let toBalance = parseFloat(snapshot.child(toAccount).val());
    let validation = validateTransfer(fromAccount, fromBalance, toAccount, toBalance, amount);
    if (validation === true) {
      //complete transfer
      let newFromBalance = (fromBalance - amount).toFixed(2);
      let newToBalance = (toBalance + amount).toFixed(2);
      firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user + "/" + fromAccount).set(newFromBalance);
      firebase.database().ref("accounts/" + firebase.auth().currentUser.uid + "/users/" + user + "/" + toAccount).set(newToBalance);
      //show toast
      desc.innerHTML = "Transfer Completed Successfully!"
      toast.className = "show";
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
      cancelButton.click();
      transferAmount.value = "";
    } else {
      desc.innerHTML = validation;
      toast.className = "show";
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
    }
  });

}

function validateTransfer(fromAccount, fromBalance, toAccount, toBalance, amount) {
  if (isNaN(amount)) {
    return "Not a valid amount"
  }
  if (amount <= 0) {
    return "Not a valid amount"
  }
  //check the to and from are not the same
  if (fromAccount == toAccount) {
    return "Cannot transfer to same account"
  }
  //check the balance in the from account is adequate
  if (fromBalance < amount) {
    return "Not enough money in account";
  }
  //validation passed, return true
  return true;
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
