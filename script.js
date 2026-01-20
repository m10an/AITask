const products = [
  {
    id: 1,
    name: "Aurora Smart Lamp",
    price: 39.99,
    category: "Home",
    shortDescription: "Adjustable light with touch controls.",
    fullDescription:
      "A smart lamp with three brightness modes and a soft glow for cozy evenings.",
    stock: 12,
  },
  {
    id: 2,
    name: "Nimbus Wireless Headphones",
    price: 79.99,
    category: "Electronics",
    shortDescription: "Noise isolation and 24-hour battery.",
    fullDescription:
      "Wireless headphones with comfy padding, USB-C charging, and crisp sound.",
    stock: 5,
  },
  {
    id: 3,
    name: "Trailblazer Backpack",
    price: 54.5,
    category: "Outdoor",
    shortDescription: "Lightweight daypack with 5 pockets.",
    fullDescription:
      "A water-resistant backpack perfect for hikes, commutes, and weekend trips.",
    stock: 0,
  },
  {
    id: 4,
    name: "Velvet Throw Blanket",
    price: 24.0,
    category: "Home",
    shortDescription: "Soft knit blanket for your sofa.",
    fullDescription:
      "A warm throw blanket that adds texture and comfort to any living room.",
    stock: 18,
  },
  {
    id: 5,
    name: "Pulse Fitness Band",
    price: 59.0,
    category: "Wellness",
    shortDescription: "Track steps and sleep cycles.",
    fullDescription:
      "Fitness tracker with heart rate monitoring, hydration reminders, and sleep stats.",
    stock: 9,
  },
  {
    id: 6,
    name: "Nomad Ceramic Mug",
    price: 14.25,
    category: "Kitchen",
    shortDescription: "Matte finish mug with 400ml capacity.",
    fullDescription:
      "A sturdy ceramic mug with a matte finish for coffee, tea, or cocoa.",
    stock: 25,
  },
];

const productGrid = document.getElementById("productGrid");
const detailsCard = document.getElementById("detailsCard");
const cartItems = document.getElementById("cartItems");
const subtotalValue = document.getElementById("subtotalValue");
const shippingValue = document.getElementById("shippingValue");
const grandTotalValue = document.getElementById("grandTotalValue");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceSort = document.getElementById("priceSort");
const deliveryOption = document.getElementById("deliveryOption");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");
const profileSummary = document.getElementById("profileSummary");
const orderHistory = document.getElementById("orderHistory");
const sessionStatus = document.getElementById("sessionStatus");
const logoutButton = document.getElementById("logoutButton");

let selectedProduct = null;
let cart = [];
let currentUser = null;

const shippingRates = {
  standard: 5.0,
  express: 12.0,
};

const currency = (value) => `$${value.toFixed(2)}`;

const saveUser = (user) => {
  localStorage.setItem("demoUser", JSON.stringify(user));
};

const loadUser = () => {
  const stored = localStorage.getItem("demoUser");
  return stored ? JSON.parse(stored) : null;
};

const saveSession = (user) => {
  localStorage.setItem("demoSession", JSON.stringify(user));
};

const loadSession = () => {
  const stored = localStorage.getItem("demoSession");
  return stored ? JSON.parse(stored) : null;
};

const saveOrders = (email, orders) => {
  localStorage.setItem(`orders_${email}`, JSON.stringify(orders));
};

const loadOrders = (email) => {
  const stored = localStorage.getItem(`orders_${email}`);
  return stored ? JSON.parse(stored) : [];
};

const renderCategories = () => {
  const categories = ["All", ...new Set(products.map((product) => product.category))];
  categoryFilter.innerHTML = categories
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
};

const getFilteredProducts = () => {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const sort = priceSort.value;

  let result = products.filter((product) =>
    product.name.toLowerCase().includes(search)
  );

  if (category && category !== "All") {
    result = result.filter((product) => product.category === category);
  }

  if (sort === "low-high") {
    result = result.slice().sort((a, b) => a.price - b.price);
  }

  if (sort === "high-low") {
    result = result.slice().sort((a, b) => b.price - a.price);
  }

  return result;
};

const renderProducts = () => {
  const filtered = getFilteredProducts();
  productGrid.innerHTML = "";

  if (!filtered.length) {
    productGrid.innerHTML = "<p>No products match your search.</p>";
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">Image</div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.shortDescription}</p>
        <strong>${currency(product.price)}</strong>
      </div>
      <span class="badge ${product.stock > 0 ? "in-stock" : "out-stock"}">
        ${product.stock > 0 ? "In stock" : "Out of stock"}
      </span>
    `;
    card.addEventListener("click", () => selectProduct(product.id));
    productGrid.appendChild(card);
  });
};

const selectProduct = (productId) => {
  selectedProduct = products.find((product) => product.id === productId);

  if (!selectedProduct) {
    return;
  }

  const isAvailable = selectedProduct.stock > 0;
  detailsCard.classList.remove("empty-state");
  detailsCard.innerHTML = `
    <div class="details-image">Image</div>
    <div class="details-info">
      <h3>${selectedProduct.name}</h3>
      <p>${selectedProduct.fullDescription}</p>
      <p><strong>${currency(selectedProduct.price)}</strong></p>
      <span class="badge ${isAvailable ? "in-stock" : "out-stock"}">
        ${isAvailable ? "In stock" : "Out of stock"}
      </span>
      <div class="details-actions">
        <label class="field">
          <span>Quantity</span>
          <input id="quantityInput" type="number" min="1" max="${selectedProduct.stock}" value="1" ${
            isAvailable ? "" : "disabled"
          } />
        </label>
        <button id="addToCartButton" class="primary" ${
          isAvailable ? "" : "disabled"
        }>Add to cart</button>
        <span id="addMessage" class="status-message"></span>
      </div>
    </div>
  `;

  const addButton = document.getElementById("addToCartButton");
  const qtyInput = document.getElementById("quantityInput");
  const addMessage = document.getElementById("addMessage");

  if (addButton) {
    addButton.addEventListener("click", () => {
      const quantity = Number(qtyInput.value);
      addToCart(selectedProduct.id, quantity);
      addMessage.textContent = "Added to cart";
      setTimeout(() => {
        addMessage.textContent = "";
      }, 1500);
    });
  }
};

const addToCart = (productId, quantity) => {
  const product = products.find((item) => item.id === productId);
  if (!product || product.stock === 0) {
    return;
  }

  const existing = cart.find((item) => item.id === productId);
  const newQuantity = Math.min(
    product.stock,
    (existing?.quantity || 0) + quantity
  );

  if (existing) {
    existing.quantity = newQuantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: newQuantity,
    });
  }

  renderCart();
};

const updateQuantity = (productId, delta) => {
  const item = cart.find((entry) => entry.id === productId);
  const product = products.find((entry) => entry.id === productId);
  if (!item || !product) {
    return;
  }

  item.quantity = Math.min(product.stock, Math.max(1, item.quantity + delta));
  renderCart();
};

const removeItem = (productId) => {
  cart = cart.filter((entry) => entry.id !== productId);
  renderCart();
};

const renderCart = () => {
  cartItems.innerHTML = "";

  if (!cart.length) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <div>
          <h4>${item.name}</h4>
          <p>${currency(item.price)}</p>
        </div>
        <div class="quantity-controls">
          <button data-action="decrease">−</button>
          <span>${item.quantity}</span>
          <button data-action="increase">+</button>
        </div>
        <div><strong>${currency(item.price * item.quantity)}</strong></div>
        <button class="secondary" data-action="remove">Remove</button>
      `;
      row.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.dataset.action;
          if (action === "increase") {
            updateQuantity(item.id, 1);
          }
          if (action === "decrease") {
            updateQuantity(item.id, -1);
          }
          if (action === "remove") {
            removeItem(item.id);
          }
        });
      });
      cartItems.appendChild(row);
    });
  }

  updateSummary();
};

const updateSummary = () => {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = cart.length ? shippingRates[deliveryOption.value] : 0;
  const total = subtotal + shipping;
  subtotalValue.textContent = currency(subtotal);
  shippingValue.textContent = currency(shipping);
  grandTotalValue.textContent = currency(total);
};

const renderProfile = () => {
  if (!currentUser) {
    profileSummary.innerHTML = "<p>No active session.</p>";
    sessionStatus.textContent = "Guest";
    logoutButton.classList.add("hidden");
    orderHistory.innerHTML = "<li>No orders yet.</li>";
    return;
  }

  profileSummary.innerHTML = `
    <strong>${currentUser.name}</strong>
    <p>${currentUser.email}</p>
  `;
  sessionStatus.textContent = `Logged in as ${currentUser.name}`;
  logoutButton.classList.remove("hidden");

  const orders = loadOrders(currentUser.email);
  if (!orders.length) {
    orderHistory.innerHTML = "<li>No orders yet.</li>";
  } else {
    orderHistory.innerHTML = orders
      .map(
        (order) =>
          `<li>${order.date} — ${order.items} items — ${currency(order.total)}</li>`
      )
      .join("");
  }
};

const handleRegister = (event) => {
  event.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;

  const user = { name, email, password };
  saveUser(user);
  registerMessage.textContent = "Registration successful. You can log in.";
  registerForm.reset();
};

const handleLogin = (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const user = loadUser();

  if (!user || user.email !== email || user.password !== password) {
    loginMessage.textContent = "Invalid email or password.";
    return;
  }

  currentUser = user;
  saveSession(user);
  loginMessage.textContent = "Login successful.";
  loginForm.reset();
  renderProfile();
};

const handleLogout = () => {
  currentUser = null;
  localStorage.removeItem("demoSession");
  renderProfile();
};

const handleCheckout = (event) => {
  event.preventDefault();
  if (!cart.length) {
    checkoutMessage.textContent = "Your cart is empty.";
    return;
  }

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = shippingRates[deliveryOption.value];
  const total = subtotal + shipping;

  checkoutMessage.textContent = "Order placed! We are preparing your shipment.";

  if (currentUser) {
    const orders = loadOrders(currentUser.email);
    orders.unshift({
      date: new Date().toLocaleDateString(),
      items: cart.reduce((sum, item) => sum + item.quantity, 0),
      total,
    });
    saveOrders(currentUser.email, orders);
  }

  cart = [];
  renderCart();
  checkoutForm.reset();
  renderProfile();
};

const init = () => {
  renderCategories();
  renderProducts();
  renderCart();
  currentUser = loadSession();
  renderProfile();
};

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
priceSort.addEventListener("change", renderProducts);
deliveryOption.addEventListener("change", updateSummary);
registerForm.addEventListener("submit", handleRegister);
loginForm.addEventListener("submit", handleLogin);
logoutButton.addEventListener("click", handleLogout);
checkoutForm.addEventListener("submit", handleCheckout);

init();
