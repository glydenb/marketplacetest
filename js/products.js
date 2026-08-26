const products = [
  {
    id: 1,
    name: "Fone Razer",
    category: "tecnologia",
    price: 189.9,
    description: "Fone sem fio com estojo compacto e conexão Bluetooth."
  },
  {
    id: 2,
    name: "Luminária",
    category: "casa",
    price: 129.9,
    description: "Luz de mesa com controle remoto."
  },
  {
    id: 3,
    name: "Teclado Ninja",
    category: "tecnologia",
    price: 249.9,
    description: "Teclado gamer 70% com switch brown."
  },
  {
    id: 4,
    name: "Agenda",
    category: "escritorio",
    price: 39.9,
    description: "Agenda para organização."
  },
  {
    id: 5,
    name: "Sashineca",
    category: "casa",
    price: 49.9,
    description: "Caneca com foto de um gato chamado Sashimi."
  },
  {
    id: 6,
    name: "Mouse Cobra",
    category: "tecnologia",
    price: 119.9,
    description: "Mouse sem fio compacto com clique silencioso."
  },
  {
    id: 7,
    name: "Organizador de Fios",
    category: "escritorio",
    price: 79.9,
    description: "Organizador de fios."
  },
  {
    id: 8,
    name: "Bonsai",
    category: "casa",
    price: 69.9,
    description: "Planta decorativa para escritórios."
  },
  {
    id: 9,
    name: "Soundbar RGB",
    category: "tecnologia",
    price: 99.9,
    description: "Soundbar sem fio para computadores ou notebooks."
  }
];

const CART_KEY = "market_cart";
const selectedQuantities = new Map();

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value);
}

function formatCategory(category) {
  const names = {
    tecnologia: "Tecnologia",
    casa: "Casa",
    escritorio: "Escritório"
  };

  return names[category] || category;
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
  updateCartCounters();
}

function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.productId === productId);

  if (item) {
    item.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveCart(cart);
}

function getSelectedCheckboxes() {
  return [...document.querySelectorAll(".product-select:checked")];
}

function updateSelectedCounter() {
  const count = getSelectedCheckboxes().length;
  const selectedCount = document.getElementById("selectedCount");
  selectedCount.textContent = `${count} ${count === 1 ? "selecionado" : "selecionados"}`;
}

function addSelectedProducts() {
  const selectedCards = getSelectedCheckboxes();

  if (selectedCards.length === 0) {
    showToast("Selecione pelo menos um produto.");
    return;
  }

  selectedCards.forEach((checkbox) => {
    const productId = Number(checkbox.dataset.id);
    const quantity = selectedQuantities.get(productId) || 1;
    addToCart(productId, quantity);
  });

  selectedCards.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.closest(".product-card")?.classList.remove("selected");
  });

  updateSelectedCounter();
  showToast(`${selectedCards.length} produto(s) adicionado(s) ao carrinho.`);
}

function updateCartItem(productId, delta) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.productId === productId);
  if (!item) return;

  item.quantity += delta;
  saveCart(cart.filter((cartItem) => cartItem.quantity > 0));
}

function removeCartItem(productId) {
  saveCart(getCart().filter((item) => item.productId !== productId));
}

function clearCart() {
  saveCart([]);
  showToast("Carrinho limpo.");
}

function getFilteredProducts() {
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  return products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search);
    const matchesCategory = category === "todos" || product.category === category;
    return matchesSearch && matchesCategory;
  });
}

function renderProducts() {
  const track = document.getElementById("productsGrid");
  const filteredProducts = getFilteredProducts();
  const countText = document.getElementById("productCountText");

  document.getElementById("catalogProductCount").textContent = products.length;
  countText.textContent = `${filteredProducts.length} ${filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}`;

  if (filteredProducts.length === 0) {
    track.innerHTML = `
      <div class="catalog-empty">
        <strong>Nenhum produto encontrado</strong>
        <span>Altere a busca ou a categoria.</span>
      </div>
    `;
    updateSelectedCounter();
    return;
  }

  track.innerHTML = filteredProducts.map((product) => {
    const quantity = selectedQuantities.get(product.id) || 1;
    return `
      <article class="product-card">
        <label class="product-check">
          <input class="product-select" type="checkbox" data-id="${product.id}">
          <span>Selecionar</span>
        </label>

        <div class="product-card-top">
          <span class="category-pill">${formatCategory(product.category)}</span>
          <span class="stock-label">Em estoque</span>
        </div>

        <div class="product-content">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>

        <div class="product-price-block">
          <span>Preço</span>
          <strong class="price">${formatCurrency(product.price)}</strong>
        </div>

        <div class="product-card-bottom">
          <div class="quantity-control" aria-label="Quantidade de ${product.name}">
            <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Diminuir quantidade">−</button>
            <span data-quantity-for="${product.id}">${quantity}</span>
            <button type="button" data-action="increase" data-id="${product.id}" aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="secondary-button add-one-button" type="button" data-action="add" data-id="${product.id}">Adicionar</button>
        </div>
      </article>
    `;
  }).join("");

  updateSelectedCounter();
  document.getElementById("productsCarousel").scrollTo({ left: 0, behavior: "smooth" });
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.</div>';
    totalElement.textContent = formatCurrency(0);
    return;
  }

  let total = 0;

  container.innerHTML = cart.map((item) => {
    const product = getProductById(item.productId);
    if (!product) return "";

    const subtotal = product.price * item.quantity;
    total += subtotal;

    return `
      <div class="cart-item">
        <div class="cart-item-main">
          <span class="category-pill">${formatCategory(product.category)}</span>
          <h4>${product.name}</h4>
          <small>${formatCurrency(product.price)} cada</small>
          <div class="cart-item-controls">
            <button type="button" data-cart-action="decrease" data-id="${product.id}">−</button>
            <strong>${item.quantity}</strong>
            <button type="button" data-cart-action="increase" data-id="${product.id}">+</button>
          </div>
        </div>
        <div class="cart-item-side">
          <strong>${formatCurrency(subtotal)}</strong>
          <button class="remove-button" type="button" data-cart-action="remove" data-id="${product.id}">Remover</button>
        </div>
      </div>
    `;
  }).join("");

  totalElement.textContent = formatCurrency(total);
}

function updateCartCounters() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cartCount").textContent = count;
  document.getElementById("heroCartCount").textContent = `${count} ${count === 1 ? "item" : "itens"}`;
}

function updateAuthUI() {
  const session = getSession();
  const greeting = document.getElementById("userGreeting");
  const loginLink = document.getElementById("loginLink");
  const logoutButton = document.getElementById("logoutButton");

  if (session) {
    const firstName = session.name.split(" ")[0];
    greeting.textContent = `Olá, ${firstName}`;
    loginLink.classList.add("hidden");
    logoutButton.classList.remove("hidden");
  } else {
    greeting.textContent = "";
    loginLink.classList.remove("hidden");
    logoutButton.classList.add("hidden");
  }
}

function logout() {
  clearSession();
  updateAuthUI();
  showToast("Sessão encerrada.");
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("overlay").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
}

function scrollCarousel(direction) {
  const carousel = document.getElementById("productsCarousel");
  const firstCard = carousel.querySelector(".product-card");
  const distance = firstCard ? firstCard.getBoundingClientRect().width + 18 : 340;
  carousel.scrollBy({ left: distance * direction, behavior: "smooth" });
}

function clearFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("categoryFilter").value = "todos";
  renderProducts();
}

let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function checkout() {
  const cart = getCart();

  if (cart.length === 0) {
    showToast("Seu carrinho está vazio.");
    return;
  }

  if (!getSession()) {
    showToast("Entre na sua conta antes de finalizar o pedido.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
    return;
  }

  saveCart([]);
  closeCart();
  showToast("Pedido registrado com sucesso.");
}

document.getElementById("productsGrid").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const productId = Number(button.dataset.id);
  const current = selectedQuantities.get(productId) || 1;

  if (button.dataset.action === "add") {
    addToCart(productId, current);
    showToast("Produto adicionado ao carrinho.");
    return;
  }

  const next = button.dataset.action === "increase" ? current + 1 : Math.max(1, current - 1);
  selectedQuantities.set(productId, next);

  const quantityElement = document.querySelector(`[data-quantity-for="${productId}"]`);
  if (quantityElement) quantityElement.textContent = next;
});

document.getElementById("productsGrid").addEventListener("change", (event) => {
  if (!event.target.matches(".product-select")) return;
  event.target.closest(".product-card")?.classList.toggle("selected", event.target.checked);
  updateSelectedCounter();
});

document.getElementById("cartItems").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-cart-action]");
  if (!button) return;

  const productId = Number(button.dataset.id);
  const action = button.dataset.cartAction;

  if (action === "increase") updateCartItem(productId, 1);
  if (action === "decrease") updateCartItem(productId, -1);
  if (action === "remove") removeCartItem(productId);
});

document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("categoryFilter").addEventListener("change", renderProducts);
document.getElementById("clearFiltersButton").addEventListener("click", clearFilters);
document.getElementById("addSelectedButton").addEventListener("click", addSelectedProducts);
document.getElementById("carouselPrev").addEventListener("click", () => scrollCarousel(-1));
document.getElementById("carouselNext").addEventListener("click", () => scrollCarousel(1));
document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCartButton").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);
document.getElementById("clearCartButton").addEventListener("click", clearCart);
document.getElementById("checkoutButton").addEventListener("click", checkout);
document.getElementById("logoutButton").addEventListener("click", logout);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

renderProducts();
renderCart();
updateCartCounters();
updateAuthUI();
