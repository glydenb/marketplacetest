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
        name: "Monitor 24\"",
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