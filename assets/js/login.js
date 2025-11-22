document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // default submission not working

    const errorEl = document.getElementById("loginError");
    errorEl.textContent = "";

    const emailValue = document.getElementById("loginEmail").value.trim();

    const passwordValue = document.getElementById("loginPass").value.trim();

    // working as a required attribute
    if (!emailValue || !passwordValue) {
      Swal.fire({
        icon: "warning",
        title: "Fields Required",
        text: "Please fill in all fields.",
        confirmButtonColor: "#344F7E",
      });
      return;
    }

    // function on line 71 email checker regex
    if (!isValidEmail(emailValue)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#344F7E",
      });
      return;
    }

    // password checker
    if (passwordValue.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password Too Short",
        text: "Password must be at least 6 characters long and use uppercase lowecase optional.",
        confirmButtonColor: "#344F7E",
      });
      return;
    }

    // user email password checker for login
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === emailValue && u.password === passwordValue
    );

    if (user) {
      localStorage.setItem("loggedInUser", emailValue);
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back!",
        confirmButtonColor: "#344F7E",
        timer: 1000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "../index.html";
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
        confirmButtonColor: "#344F7E",
      });
    }
  });

// email regex call in line 25
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show / Hide Password functionality
document.addEventListener("DOMContentLoaded", function () {
  // getting check box and password input with id
  const showPasswordCheckbox = document.getElementById("form1Example3");
  const passwordInput = document.getElementById("loginPass");

  if (showPasswordCheckbox && passwordInput) {
    showPasswordCheckbox.addEventListener("change", function () {
      // showpassword check hoto input ki type text hojai gi
      if (this.checked) {
        passwordInput.type = "text";
      } else {
        passwordInput.type = "password";
      }
    });
  }
});

// Forgot Password Functionality
function retrievePassword() {
  const email = document.getElementById("forgotEmail").value.trim();
  const resultDiv = document.getElementById("forgotPasswordResult");

  if (!email) {
    resultDiv.className = "alert alert-danger";
    resultDiv.textContent = "Please enter your email address.";
    resultDiv.style.display = "block";
    return;
  }

  if (!isValidEmail(email)) {
    resultDiv.className = "alert alert-danger";
    resultDiv.textContent = "Please enter a valid email address.";
    resultDiv.style.display = "block";
    return;
  }

  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email);

  if (user) {
    resultDiv.className = "alert alert-success";
    resultDiv.innerHTML = `
      <strong><i class="fas fa-check-circle me-2"></i>Password Found!</strong><br>
      Your password is: <strong>${user.password}</strong>
    `;
    resultDiv.style.display = "block";

    // Auto-fill password in login form
    document.getElementById("loginEmail").value = email;
    document.getElementById("loginPass").value = user.password;
  } else {
    resultDiv.className = "alert alert-danger";
    resultDiv.innerHTML = `
      <i class="fas fa-exclamation-circle me-2"></i>
      Email not found. Please check your email address or sign up first.
    `;
    resultDiv.style.display = "block";
  }
}
