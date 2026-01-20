const CART_KEY = "cart";

const getCartItems = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");

const setCartItems = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
};

const updateCartCount = () => {
  const count = getCartItems().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? "inline-block" : "none";
  });
};

const formatCurrency = (value) => `$${value.toFixed(2)}`;

const ensureProducts = () => {
  const stored = localStorage.getItem("products");
  if (stored) {
    return JSON.parse(stored);
  }
  const products = [
    {
      id: 1,
      name: "Aurora Wireless Headphones",
      price: 129.99,
      description: "Noise-cancelling comfort for every commute.",
      category: "Electronics",
      stock: "In stock",
      details: "Bluetooth 5.3, 30-hour battery life, and plush ear cushions.",
    },
    {
      id: 2,
      name: "Lumen Desk Lamp",
      price: 42.5,
      description: "Warm lighting with adjustable brightness.",
      category: "Home",
      stock: "In stock",
      details: "Touch controls with three color temperatures and USB charging.",
    },
    {
      id: 3,
      name: "Nimbus Travel Backpack",
      price: 78,
      description: "Organized storage for weekend adventures.",
      category: "Accessories",
      stock: "In stock",
      details: "Water-resistant fabric, padded laptop sleeve, and hidden pocket.",
    },
    {
      id: 4,
      name: "Solstice Running Shoes",
      price: 96,
      description: "Lightweight support for daily training.",
      category: "Apparel",
      stock: "In stock",
      details: "Breathable mesh and responsive foam midsole.",
    },
    {
      id: 5,
      name: "Cedar Coffee Set",
      price: 58,
      description: "Minimalist cups and pour-over dripper.",
      category: "Home",
      stock: "In stock",
      details: "Includes 2 ceramic cups and a reusable stainless filter.",
    },
    {
      id: 6,
      name: "Orbit Smartwatch",
      price: 149.99,
      description: "Track wellness goals with style.",
      category: "Electronics",
      stock: "In stock",
      details: "Heart-rate sensor, sleep tracking, and 10-day battery.",
    },
  ];
  localStorage.setItem("products", JSON.stringify(products));
  return products;
};

document.addEventListener("DOMContentLoaded", updateCartCount);
