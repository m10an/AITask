const cartItemsContainer = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const shippingEl = document.getElementById("shipping");
const grandTotalEl = document.getElementById("grandTotal");

const productsData = ensureProducts();
const shippingFlat = 8;

const renderCart = () => {
  const items = getCartItems();
  cartItemsContainer.innerHTML = "";

  if (items.length === 0) {
    cartItemsContainer.innerHTML =
      '<div class="notice">Your cart is empty. Add items from the catalog.</div>';
  }

  let subtotal = 0;

  items.forEach((item) => {
    const product = productsData.find((prod) => prod.id === item.id);
    if (!product) return;
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <strong>${product.name}</strong>
        <p class="product-description">${product.description}</p>
        <p class="product-price">${formatCurrency(product.price)}</p>
      </div>
      <div class="quantity-controls">
        <button data-action="decrease">−</button>
        <span>${item.quantity}</span>
        <button data-action="increase">+</button>
      </div>
      <div>
        <p><strong>${formatCurrency(lineTotal)}</strong></p>
        <button class="button button-outline" data-action="remove">Remove</button>
      </div>
    `;

    row.querySelector('[data-action="decrease"]').addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity -= 1;
      }
      setCartItems(items);
      renderCart();
    });

    row.querySelector('[data-action="increase"]').addEventListener("click", () => {
      item.quantity += 1;
      setCartItems(items);
      renderCart();
    });

    row.querySelector('[data-action="remove"]').addEventListener("click", () => {
      const updated = items.filter((cartItem) => cartItem.id !== item.id);
      setCartItems(updated);
      renderCart();
    });

    cartItemsContainer.appendChild(row);
  });

  subtotalEl.textContent = formatCurrency(subtotal);
  shippingEl.textContent = formatCurrency(shippingFlat);
  grandTotalEl.textContent = formatCurrency(subtotal + shippingFlat);
};

renderCart();
