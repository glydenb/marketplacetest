const products = [
    {
        id: 1,
        name: "Fone Ilidan",
        category: "tecnologia",
        price: 170,
        description: "Fone sem fio com estojo de conexão Bluetooth."
    },

    {
        id: 2,
        name: "Cadeira Gamer",
        category: "casa",
        price: 150,
        description: "Cadeira ergonômica para gamers."
    },
    {
        id: 3,
        name: "Monitor 24pol Full HD",
        category: "tecnologia",
        price: 300,
        description: "Monitor LED Full HD com tecnologia IPS."
    },
    {
        id: 4,
        name: "Teclado Mecânico",
        category: "tecnologia",
        price: 200,
        description: "Teclado mecânico com switches de alta qualidade."
    },
    {
        id: 5,
        name: "Mouse Gamer",
        category: "tecnologia",
        price: 100,
        description: "Mouse ergonômico para gamers."
    },
    {
        id: 6,
        name: "Caderno do Ben 10",
        category: "escritorio",
        price: 15,
        description: "Caderno com ilustrações do Ben 10."
    },
    {
        id: 7,
        name: "Vaso de Flores",
        category: "casa",
        price: 87.9,
        description: "Vaso de flores com design moderno."
    },
    {
        id: 8,
        name: "Bonsai",
        category: "casa",
        price: 12.5,
        description: "Bonsai artificial decorativo."
    },
    {
        id: 9,
        name: "Luminária",
        category: "escritorio",
        price: 25,
        description: "Luminária com design moderno."
    },
];

const CART_KEY = "marketplace_cart";
const selectedQuantities = new Map();

function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
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
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return cart || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    renderCart();
    updateCartCounters();
}

function getProductById(productId) {
    return products.find(product => product.id === Number(id));
}

function addToCart(productId, quantity = 1) {
    const cart = getCart();
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    saveCart(cart);
}

function getSelectedCheckboxes() {
    return document.querySelectorAll('.product-select:checked');
}

function updateSelectedCounter() {
    const count = getSelectedCheckboxes().length;
    const selectedCount = document.getElementById('selectedCount');
    selectedCount.textContent = `${count === 1 ? "selecionado" : "selecionados"}`;
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
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;

    return products.filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search);
        const matchesDescription = product.description.toLowerCase().includes(search);
        const matchesCategory = category === "todos" || product.category === category;
        return matchesSearch && matchesCategory;
    });
}

function renderProducts(){
    const track = document.getElementById("productGrid");
    const filteredProducts = getFilteredProducts();
    const countText = document.getElementById("productCountText");

    document.getElementById("catalogProductCount").textContent = products.length;
    countText.textContent = `${filteredProducts.length} ${products.length} === 1 ? "produto encontrado" : "produtos encontrados"}`;

    if (filteredProducts.length === 0) {
        track.innerHTML = `
        <div class="catalog-empty">
            <strong>Nenhum produto encontrado</strong>
            <span>Altere ou busque a categoria.</span>
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
                <span class="stock-label>Em estoque</span>
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
                    <button type="button" data-action="decrease" data-id="${product.id}" aria-label="Diminuir quantidade">-</button>
                    <span class="quantity">${quantity}</span>
                    <button type="button" data-action="increase" data-id="${product.id}" aria-label="Aumentar quantidade">+</button>
                </div>
                <button class="secondary-button add-one-button" type="button" data-action="add" data-id="${product.id}">Adicionar</button>
            </div>
        </article>
    `;
    }).join();

    updateSelectedCounter();
    document.getElementById("productCarousel").scrollTo({ left: 0, behavior: "smooth" });
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

function logout () {
    clearSession();
    updateAuthUI();
    showToast("Você saiu da sua conta.");
}

function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("Overlay").classList.add("open");
    document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
}

function scrollCaroulsel(direction) {
    const carousel = document.getElementById("productCarousel");
    const firstCard = caroulse.querySelectorAll(".product-card");
    const distance = firstCard ? firstCard.getBoudingClientRect().width + 18 : 340;
    caroulsel.scrollBy({left: distance * direction, behavior: "smooth"});
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
    showToast("Entre na sua conta para finalizar seu pedido.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 900);
    return;
  }

  saveCart([]);
  closeCart();
  showToast("Pedido registrado com sucesso.");
}