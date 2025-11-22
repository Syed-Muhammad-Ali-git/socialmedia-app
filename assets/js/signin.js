document
  .getElementById("signinForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // default submit behavior stop and page is not reload on submit...
    const errorEl = document.getElementById("signinError");
    errorEl.textContent = "";

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("signUpEmail").value.trim();
    const password = document.getElementById("signUpPass").value.trim();

    if (!firstName || !lastName || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Fields Required",
        text: "Please fill all fields.",
        confirmButtonColor: "#344F7E",
      });
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password Too Short",
        text: "Password must be at least 6 characters long.",
        confirmButtonColor: "#344F7E",
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#344F7E",
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.some((u) => u.email === email)) {
      Swal.fire({
        icon: "error",
        title: "Email Already Registered",
        text: "This email is already registered. Please use a different email or login.",
        confirmButtonColor: "#344F7E",
      });
      return;
    }

    users.push({ firstName, lastName, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    // Auto login after signup
    localStorage.setItem("loggedInUser", email);
    Swal.fire({
      icon: "success",
      title: "Sign Up Successful!",
      text: "Your account has been created successfully!",
      confirmButtonColor: "#344F7E",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => {
      window.location.href = "../index.html";
    });
  });

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Show/Hide Password functionality
document.addEventListener("DOMContentLoaded", function () {
  const showPasswordCheckbox = document.getElementById("showPasswordSignup");
  const passwordInput = document.getElementById("signUpPass");

  if (showPasswordCheckbox && passwordInput) {
    showPasswordCheckbox.addEventListener("change", function () {
      if (this.checked) {
        passwordInput.type = "text";
      } else {
        passwordInput.type = "password";
      }
    });
  }
});
