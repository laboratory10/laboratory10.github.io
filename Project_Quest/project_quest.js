let emailInput = document.getElementById("emailInput");
let passwordInput = document.getElementById("passwordInput");
let errorText = document.getElementById("errorText");
let loginButton = document.getElementById("loginButton");
let sendResetEmailButton = document.getElementById("sendResetEmailButton");
let createAccountButton = document.getElementById("createAccountButton");
let resetEmail = document.getElementById("resetEmail");
let resetCancelButton = document.getElementById("resetCancelButton");
let newName = document.getElementById("newName");
let newEmail = document.getElementById("newEmail");
let newPassword = document.getElementById("newPassword");
let createCancelButton = document.getElementById("createCancelButton");
let toast = document.getElementById("toast");
let desc = document.getElementById("desc");

loginButton.onclick = login;
sendResetEmailButton.onclick = sendResetEmail;
//createAccountButton.onclick = createNewAccount;

function login () {
  errorText.innerHTML = ""
  firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).catch(function(error) {
    // Handle Errors here
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error.code);
    console.log(error.message);
    errorText.innerHTML = "Authentication Failed";
  });
}

function sendResetEmail () {
  firebase.auth().sendPasswordResetEmail(resetEmail.value).then(function() {
    //email sent
    desc.innerHTML = "Email sent to " + resetEmail.value;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
    resetCancelButton.click();
    resetEmail.value = "";
  }).catch(function(error) {
    //error occured
    let message = error.message;
    if (message == "There is no user record corresponding to this identifier. The user may have been deleted.") {
      message = "There is no user with this email address."
    }
    desc.innerHTML = message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  })
}

function createNewAccount () {
  let name = newName.value
  let email = newEmail.value
  let password = newPassword.value
  firebase.auth().createUserWithEmailPassword(email, password).then(function() {
    //success
    console.log(firebase.auth().currentUser.uid)
    //create new user inside account
    //TODO
    
    createCancelButton.click();
    newName.value = "";
    newEmail.value = "";
    newPassword.value = "";
  }).catch(function(error) {
    //error occured
    desc.innerHTML = error.message;
    toast.className = "show";
    setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 5000);
  })
}

firebase.auth().onAuthStateChanged(function() {
  if (firebase.auth().currentUser) {
    window.location = "Users.html";
  }
});
