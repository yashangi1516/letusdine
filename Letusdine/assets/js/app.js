function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id) {
  const item = foodItems.find(f => f.id === id);
  const cart = getCart();
  const existing = cart.find(c => c.id === id);

  if (existing) existing.qty++;
  else cart.push({ ...item, qty: 1 });

  saveCart(cart);
  alert(item.name + " added to cart");
}

function removeFromCart(id) {
  let cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
  renderCartPage();
}

function updateCartCount() {
  const count = getCart().reduce((a, b) => a + b.qty, 0);
  const el = document.querySelector(".cart-count");
  if (el) el.textContent = count;
}

function renderMenuPage() {
  const container = document.getElementById("menu-container");
  if (!container) return;

  container.innerHTML = "";
  foodItems.forEach(item => {
    container.innerHTML += `
      <div class="card">
        <img src="${item.image}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <p class="rating">⭐ ${item.rating}</p>
          <p class="price">₹${item.price}</p>
          <button onclick="addToCart(${item.id})">Add to Cart</button>
        </div>
      </div>
    `;
  });
}

function renderCartPage() {
  const container = document.getElementById("cart-container");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    container.innerHTML += `
      <div class="cart-item">
        <div>
          <h4>${item.name}</h4>
          <p>Qty: ${item.qty}</p>
          <p>₹${item.price * item.qty}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `;
  });

  totalEl.textContent = "₹" + total;
}

function handleCheckoutSubmit(e) {
  e.preventDefault();

  const order = {
    id: Date.now(),
    items: getCart(),
    status: "Preparing"
  };

  localStorage.setItem("lastOrder", JSON.stringify(order));
  localStorage.removeItem("cart");

  window.location.href = "track.html";
}

function renderTrackingPage() {
  const statusEl = document.getElementById("order-status");
  if (!statusEl) return;

  const steps = ["Preparing", "On the way", "Delivered"];
  let i = 0;

  statusEl.textContent = "Status: " + steps[i];

  const interval = setInterval(() => {
    i++;
    if (i >= steps.length) return clearInterval(interval);
    statusEl.textContent = "Status: " + steps[i];
  }, 2000);
}

function renderAdminPage() {
  const container = document.getElementById("admin-food-list");
  if (!container) return;

  foodItems.forEach(item => {
    container.innerHTML += `
      <div class="admin-item">
        <span>${item.id}</span>
        <span>${item.name}</span>
        <span>₹${item.price}</span>
        <span>${item.category}</span>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderMenuPage();
  renderCartPage();
  renderTrackingPage();
  renderAdminPage();

  const form = document.getElementById("checkout-form");
  if (form) form.addEventListener("submit", handleCheckoutSubmit);
});
