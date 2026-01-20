const products = ensureProducts();
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceSort = document.getElementById("priceSort");
const detailsModal = document.getElementById("detailsModal");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalDetails = document.getElementById("modalDetails");
const modalPrice = document.getElementById("modalPrice");
const modalAdd = document.getElementById("modalAdd");
const modalClose = document.getElementById("modalClose");

let selectedProduct = null;

const populateCategories = () => {
  const categories = Array.from(new Set(products.map((item) => item.category)));
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
};

const openModal = (product) => {
  selectedProduct = product;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  modalDetails.textContent = product.details;
  modalPrice.textContent = formatCurrency(product.price);
  detailsModal.style.display = "flex";
  detailsModal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  detailsModal.style.display = "none";
  detailsModal.setAttribute("aria-hidden", "true");
};

const addToCart = (productId) => {
  const items = getCartItems();
  const existing = items.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ id: productId, quantity: 1 });
  }
  setCartItems(items);
};

const renderProducts = () => {
  const searchValue = searchInput.value.trim().toLowerCase();
  const categoryValue = categoryFilter.value;
  const sortValue = priceSort.value;

  let filtered = products.filter((product) =>
    product.name.toLowerCase().includes(searchValue)
  );

  if (categoryValue !== "all") {
    filtered = filtered.filter((product) => product.category === categoryValue);
  }

  if (sortValue === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }
  if (sortValue === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = "";

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-image">Image placeholder</div>
      <span class="stock-badge">${product.stock}</span>
      <h3 class="product-name">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <p class="product-price">${formatCurrency(product.price)}</p>
      <button class="button button-outline" data-details>View details</button>
      <button class="button button-primary" data-add>Add to cart</button>
    `;

    card.querySelector("[data-details]").addEventListener("click", () => {
      openModal(product);
    });

    card.querySelector("[data-add]").addEventListener("click", () => {
      addToCart(product.id);
    });

    productGrid.appendChild(card);
  });
};

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
priceSort.addEventListener("change", renderProducts);
modalClose.addEventListener("click", closeModal);
modalAdd.addEventListener("click", () => {
  if (selectedProduct) {
    addToCart(selectedProduct.id);
    closeModal();
  }
});

detailsModal.addEventListener("click", (event) => {
  if (event.target === detailsModal) {
    closeModal();
  }
});

populateCategories();
renderProducts();
