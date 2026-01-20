const loginForm = document.getElementById("loginForm");
const loginView = document.getElementById("loginView");
const profileView = document.getElementById("profileView");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const orderHistory = document.getElementById("orderHistory");
const logoutBtn = document.getElementById("logoutBtn");

const showProfile = (user) => {
  loginView.style.display = "none";
  profileView.style.display = "block";
  profileName.textContent = user.name;
  profileEmail.textContent = user.email;

  const orders = JSON.parse(localStorage.getItem("orders") || "{}");
  const history = orders[user.email] || [];
  orderHistory.innerHTML = "";
  if (history.length === 0) {
    orderHistory.innerHTML =
      '<div class="notice">No orders yet. Place an order to see history here.</div>';
    return;
  }
  history.forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-item";
    card.innerHTML = `
      <p><strong>${order.id}</strong> • ${order.date}</p>
      <p>${order.items.length} items • ${formatCurrency(order.total)}</p>
      <p>Delivery: ${order.delivery} • Payment: ${order.payment}</p>
    `;
    orderHistory.appendChild(card);
  });
};

const showLogin = () => {
  loginView.style.display = "block";
  profileView.style.display = "none";
};

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get("email");
  const password = formData.get("password");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const match = users.find((user) => user.email === email && user.password === password);
  if (!match) {
    alert("Invalid credentials. Please check your email and password.");
    return;
  }
  localStorage.setItem("currentUser", JSON.stringify(match));
  showProfile(match);
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  showLogin();
});

const storedUser = JSON.parse(localStorage.getItem("currentUser"));
if (storedUser) {
  showProfile(storedUser);
} else {
  showLogin();
}
