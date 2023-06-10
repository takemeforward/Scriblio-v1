function togglePasswordVisibility() {
    var confirmPassword = document.getElementById("confirmPassword");
    var eyeButton = document.getElementById("eyeButton");
  
    if (confirmPassword.type === "password") {
      confirmPassword.type = "text";
      eyeButton.innerHTML = "&#128065;"; // Show open eye symbol
    } else {
      confirmPassword.type = "password";
      eyeButton.innerHTML = "&#128274;"; // Show closed eye symbol
    }
  }


var passwordInput = document.getElementById("password");
var confirmPasswordInput = document.getElementById("confirmPassword");
var submitButton = document.getElementById("submitButton");

function checkPasswordMatch() {
  var passwordValue = passwordInput.value;
  var confirmPasswordValue = confirmPasswordInput.value;
if(passwordValue && confirmPasswordValue){
    if (passwordValue === confirmPasswordValue) {
        submitButton.disabled = false;
        document.querySelector(".message").innerHTML = "Password matched";
        document.querySelector(".message").style.color = "green";
      } else {
        submitButton.disabled = true;
        document.querySelector(".message").innerHTML = "Password do not match";
        document.querySelector(".message").style.color = "red";
      }

}
  
}

passwordInput.addEventListener("input", checkPasswordMatch);
confirmPasswordInput.addEventListener("input", checkPasswordMatch);