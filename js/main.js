
const tools = [
    { name: "Compresor de aire (MTGP SRL)", price: "30.00 $", image: "images/herramientas/compresor.png" },
    { name: "Compresor de aire (NGCO SRL)", price: "25.00 $", image: "images/herramientas/compresor.png" },
    { name: "Compresor de aire (NAOFDW SRL)", price: "30.00 $", image: "images/herramientas/compresor.png" },
    { name: "Guía angular 2500W EHWELL", price: "13.00 $", image: "images/herramientas/guia-angular.png" },
    { name: "Guía angular ajustable touch 500V", price: "7.50 $", image: "images/herramientas/guia-angular.png" },
    { name: "Guía angular touch 670w", price: "7.00 $", image: "images/herramientas/guia-angular.png" },
    { name: "Guía angular Cardless IPDB DINN", price: "15.00 $", image: "images/herramientas/guia-angular.png" },
    { name: "Guía angular CROWNS 10.0V", price: "7.50 $", image: "images/herramientas/guia-angular.png" }
];


const categories = [
    { name: "Alquiler de motocierras", price: "$250.000.00/día" },
    { name: "Alquiler de Hidrolavadora Industrial a gasolina", price: "$87.000.00/día" },
    { name: "Alquiler de Taladro Digital Export", price: "$100.000.00/día" },
    { name: "Alquiler de Martillo Perforador TOTAL 200W - 75 Joules", price: "$125.000.00/día" },
    { name: "Alquiler de Broca Industrial", price: "$250.000.00/día" },
    { name: "Alquiler de Tanque Almacenador de Lodos SORIES", price: "$220.000.00/día" },
    { name: "Alquiler de pulidoras", price: "$45.500.00/día", }
];

let currentUser = null;
let cart = [];
let currentPage = 1;
const itemsPerPage = 8;

const elements = {
    toolGrid: document.querySelector('.tool-grid'),
    categoryList: document.querySelector('.category-list'),
    searchInput: document.getElementById('search-input') || { value: '', addEventListener: () => {} },
    searchBtn: document.getElementById('search-btn') || { addEventListener: () => {} },
    categoryFilter: document.getElementById('category-filter') || { value: '', addEventListener: () => {} },
    priceFilter: document.getElementById('price-filter') || { value: '', addEventListener: () => {} },
    loadMoreBtn: document.querySelector('.view-all'),
    authModal: document.getElementById('auth-modal'),
    cartModal: document.getElementById('cart-modal'),
    authForm: document.getElementById('auth-form'),
    authToggle: document.getElementById('auth-toggle'),
    modalTitle: document.getElementById('modal-title'),
    registerFields: document.getElementById('register-fields'),
    authSubmit: document.getElementById('auth-submit'),
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    userMenu: document.getElementById('user-menu'),
    cartLink: document.getElementById('cart-link'),
    cartCount: document.getElementById('cart-count'),
    cartItems: document.getElementById('cart-items'),
    cartTotal: document.getElementById('cart-total'),
    checkoutBtn: document.getElementById('checkout-btn')
};

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    renderTools();
    renderCategories();
    populateCategoryFilter();
    setupEventListeners();
    setupViewAllButton();
});

function initAuth() {
    const token = localStorage.getItem('alkile_token');
    if (token) {
        currentUser = { name: "Usuario Demo", id: 1 };
        updateAuthUI();
    }
}

function renderTools(filteredTools = null) {
    elements.toolGrid.innerHTML = '';
    const toolsToRender = filteredTools || tools.slice(0, currentPage * itemsPerPage);
    
    toolsToRender.forEach(tool => {
        const toolCard = document.createElement('div');
        toolCard.className = 'tool-card';
        toolCard.innerHTML = `
            <div class="tool-image-container">
                <img src="${tool.image}" alt="${tool.name}" class="tool-image">
            </div>
            <div class="tool-info">
                <div class="tool-name">${tool.name}</div>
                <div class="tool-price">${tool.price.toFixed(2)} $</div>
                <div class="tool-category" style="display:none;">${tool.category}</div>
                <button class="add-to-cart" data-id="${tool.id}">Añadir al carrito</button>
            </div>
        `;
        elements.toolGrid.appendChild(toolCard);
    });
}


function renderCategories() {
    elements.categoryList.innerHTML = '';
    categories.forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="category-name">${category.name}</div>
            <div class="category-price">${category.price}</div>
        `;
        categoryItem.addEventListener('click', () => filterByCategory(category.id));
        elements.categoryList.appendChild(categoryItem);
    });
}

function populateCategoryFilter() {
    if (elements.categoryFilter) {
        elements.categoryFilter.innerHTML = `
            <option value="">Todas las categorías</option>
            ${categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('')}`;
    }
}

function setupEventListeners() {
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', searchTools);
        elements.searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') searchTools();
        });
    }
    
    if (elements.categoryFilter) {
        elements.categoryFilter.addEventListener('change', filterTools);
    }
    
    if (elements.priceFilter) {
        elements.priceFilter.addEventListener('change', filterTools);
    }

    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => showAuthModal('login'));
        elements.registerBtn.addEventListener('click', () => showAuthModal('register'));
        elements.logoutBtn.addEventListener('click', logout);
        elements.authToggle.addEventListener('click', toggleAuthMode);
        elements.authForm.addEventListener('submit', handleAuth);
    }

    if (elements.cartLink) {
        elements.cartLink.addEventListener('click', showCartModal);
    }
    
    if (elements.checkoutBtn) {
        elements.checkoutBtn.addEventListener('click', checkout);
    }
    
document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', () => {
            if (elements.authModal) elements.authModal.style.display = 'none';
            if (elements.cartModal) elements.cartModal.style.display = 'none';
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const toolId = parseInt(e.target.dataset.id);
            addToCart(toolId);
        }
        
        if (e.target.classList.contains('remove-item')) {
            const toolId = parseInt(e.target.dataset.id);
            removeFromCart(toolId);
        }
    });

    if (elements.loadMoreBtn) {
        elements.loadMoreBtn.addEventListener('click', loadMoreTools);
    }
}

   function searchTools() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    if (searchTerm.trim() === '') {
        renderTools();
        return;
    }

    const filtered = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) || 
        tool.category.toLowerCase().includes(searchTerm)
    );
    
    renderTools(filtered);
}

function filterTools() {
    const categoryId = elements.categoryFilter.value;
    const priceOrder = elements.priceFilter.value;
    
    let filtered = [...tools];

     if (categoryId) {
        filtered = filtered.filter(tool => tool.category === categories.find(c => c.id == categoryId).name);
    }

    if (priceOrder) {
        filtered.sort((a, b) => priceOrder === 'asc' ? a.price - b.price : b.price - a.price);
    }
    
    renderTools(filtered);
}

function filterByCategory(categoryId) {
    if (elements.categoryFilter) {
        elements.categoryFilter.value = categoryId;
        filterTools();
    }
}

function loadMoreTools() {
    currentPage++;
    renderTools();
}

function showAuthModal(mode) {
    if (!elements.authModal) return;
    elements.authModal.style.display = 'block';
    if (mode === 'login') {
        setAuthMode('login');
    } else {
        setAuthMode('register');
    }
}

function setAuthMode(mode) {
    if (!elements.authModal) return;
    
    if (mode === 'login') {
        elements.modalTitle.textContent = 'Iniciar Sesión';
        elements.registerFields.style.display = 'none';
        elements.authSubmit.textContent = 'Ingresar';
        elements.authToggle.textContent = '¿No tienes cuenta? Regístrate aquí';
    } else {
        elements.modalTitle.textContent = 'Registrarse';
        elements.registerFields.style.display = 'block';
        elements.authSubmit.textContent = 'Registrarse';
        elements.authToggle.textContent = '¿Ya tienes cuenta? Inicia sesión aquí';
    }
}

function toggleAuthMode() {
    if (!elements.authModal) return;
    
    if (elements.registerFields.style.display === 'none') {
        setAuthMode('register');
    } else {
        setAuthMode('login');
    }
}

async function handleAuth(e) {
    e.preventDefault();
    if (!elements.authModal) return;
    
    const isLogin = elements.registerFields.style.display === 'none';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = isLogin ? null : document.getElementById('name').value;

    try {
        // Simulamos un retraso de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password) {
            localStorage.setItem('alkile_token', 'simulated_token');
            currentUser = { 
                name: name || "Usuario Demo", 
                id: Math.floor(Math.random() * 1000),
                email 
            };
            updateAuthUI();
            elements.authModal.style.display = 'none';
            if (elements.authForm) elements.authForm.reset();
            alert(`¡Bienvenido ${currentUser.name}!`);
        } else {
            alert('Por favor completa todos los campos');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en la autenticación');
    }
}

function logout() {
    localStorage.removeItem('alkile_token');
    currentUser = null;
    updateAuthUI();
    alert('Sesión cerrada correctamente');
}

function updateAuthUI() {
    if (!elements.loginBtn || !elements.registerBtn || !elements.logoutBtn || !elements.userMenu) return;
    
    if (currentUser) {
        elements.loginBtn.style.display = 'none';
        elements.registerBtn.style.display = 'none';
        elements.logoutBtn.style.display = 'block';
        elements.userMenu.querySelector('a').innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
    } else {
        elements.loginBtn.style.display = 'block';
        elements.registerBtn.style.display = 'block';
        elements.logoutBtn.style.display = 'none';
        elements.userMenu.querySelector('a').innerHTML = '<i class="fas fa-user"></i> MI CUENTA';
    }
}
    
   function addToCart(toolId) {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;
    
    const existingItem = cart.find(item => item.id === toolId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: tool.id,
            name: tool.name,
            price: tool.price,
            image: tool.image,
            quantity: 1
        });
    }
    
    updateCart();
    alert(`${tool.name} añadido al carrito`);
}

function removeFromCart(toolId) {
    cart = cart.filter(item => item.id !== toolId);
    updateCart();
}

function updateCart() {
    if (!elements.cartCount || !elements.cartItems || !elements.cartTotal) return;
    
    elements.cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    elements.cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toFixed(2)} $ x ${item.quantity}</p>
                <button class="remove-item" data-id="${item.id}">Eliminar</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    elements.cartTotal.textContent = total.toFixed(2);
}

function showCartModal() {
    if (!elements.cartModal) return;
    
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    elements.cartModal.style.display = 'block';
}

async function checkout() {
    if (!currentUser) {
        showAuthModal('login');
        return;
    }
    
    if (cart.length === 0) {
        alert('No hay items en el carrito');
        return;
    }

    try {
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        alert(`¡Alquiler realizado con éxito por ${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} $!`);
        cart = [];
        updateCart();
        if (elements.cartModal) elements.cartModal.style.display = 'none';
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar el alquiler');
    }
}

function setupViewAllButton() {
    const viewAllBtn = document.querySelector('.view-all');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            alert('Mostrando todas las herramientas disponibles...');
            currentPage = 1;
            renderTools(tools); 
        });
    }
}
