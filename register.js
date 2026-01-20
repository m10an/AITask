const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const newUser = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const exists = users.some((user) => user.email === newUser.email);
  if (exists) {
    alert("An account with this email already exists.");
    return;
  }
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! You can now log in.");
  window.location.href = "login.html";
});
