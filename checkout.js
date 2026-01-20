const orderItems = document.getElementById("orderItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutShipping = document.getElementById("checkoutShipping");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");

const productList = ensureProducts();

const getShippingCost = (delivery) => (delivery === "express" ? 15 : 5);

const renderSummary = () => {
  const items = getCartItems();
  orderItems.innerHTML = "";
  let subtotal = 0;

  items.forEach((item) => {
    const product = productList.find((prod) => prod.id === item.id);
    if (!product) return;
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    const row = document.createElement("div");
    row.className = "summary-row";
    row.innerHTML = `<span>${product.name} × ${item.quantity}</span><strong>${formatCurrency(
      lineTotal
    )}</strong>`;
    orderItems.appendChild(row);
  });

  const delivery = checkoutForm.querySelector("input[name='delivery']:checked").value;
  const shippingCost = getShippingCost(delivery);
  checkoutSubtotal.textContent = formatCurrency(subtotal);
  checkoutShipping.textContent = formatCurrency(shippingCost);
  checkoutTotal.textContent = formatCurrency(subtotal + shippingCost);
};

const saveOrder = (order) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;
  const orders = JSON.parse(localStorage.getItem("orders") || "{}");
  const history = orders[currentUser.email] || [];
  history.unshift(order);
  orders[currentUser.email] = history;
  localStorage.setItem("orders", JSON.stringify(orders));
};

checkoutForm.addEventListener("change", renderSummary);

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const items = getCartItems();
  if (items.length === 0) {
    alert("Your cart is empty. Add items before checkout.");
    return;
  }

  const formData = new FormData(checkoutForm);
  const delivery = formData.get("delivery");
  const payment = formData.get("payment");
  const shippingCost = getShippingCost(delivery);
  const subtotal = items.reduce((sum, item) => {
    const product = productList.find((prod) => prod.id === item.id);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const total = subtotal + shippingCost;

  saveOrder({
    id: `ORD-${Date.now()}`,
    date: new Date().toLocaleString(),
    delivery,
    payment,
    total,
    items,
  });

  setCartItems([]);
  checkoutForm.reset();
  renderSummary();
  alert("Order placed! You'll see it in your order history if logged in.");
});

renderSummary();
