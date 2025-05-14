class ShoppingCart {
    constructor() {
        this.cart = [];
        this.init();
    }
    
    init() {
        this.loadCart();
        this.setupEventListeners();
        this.updateCartUI();
    }
    
    loadCart() {
        const savedCart = localStorage.getItem('alkile_cart');
        if (savedCart) {
            this.cart = JSON.parse(savedCart);
        }
    }
    
    saveCart() {
        localStorage.setItem('alkile_cart', JSON.stringify(this.cart));
    }
    
    setupEventListeners() {
       
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const toolId = parseInt(e.target.dataset.id);
                this.addItem(toolId);
            }
            
            if (e.target.classList.contains('remove-item')) {
                const toolId = parseInt(e.target.dataset.id);
                this.removeItem(toolId);
            }
        });
        
        
        document.getElementById('continue-shopping')?.addEventListener('click', () => {
            window.location.href = 'tienda.html';
        });
        
        document.getElementById('checkout-btn')?.addEventListener('click', () => {
            this.checkout();
        });
    }
    
    addItem(toolId) {
        if (!authSystem.currentUser) {
            alert('Por favor inicia sesión para alquilar herramientas');
            window.location.href = 'cuenta.html';
            return;
        }
        
        const tool = tools.find(t => t.id === toolId);
        if (!tool) return;
        
        const existingItem = this.cart.find(item => item.id === toolId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: tool.id,
                name: tool.name,
                price: tool.price,
                image: tool.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartUI();
        alert(`${tool.name} añadido al carrito`);
    }
    
    removeItem(toolId) {
        this.cart = this.cart.filter(item => item.id !== toolId);
        this.saveCart();
        this.updateCartUI();
    }
    
    updateCartUI() {
     
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
        
        
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (cartItemsContainer) {
            if (this.cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
                return;
            }
            
            cartItemsContainer.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>${item.price.toFixed(2)} $</p>
                        <div class="item-quantity">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            
       
            const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const taxes = subtotal * 0.19; 
            const total = subtotal + taxes;
            
            document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
            document.getElementById('cart-taxes').textContent = taxes.toFixed(2);
            document.getElementById('cart-total').textContent = total.toFixed(2);
        }
    }
    
    async checkout() {
        if (!authSystem.currentUser) {
            alert('Por favor inicia sesión para completar el alquiler');
            window.location.href = 'cuenta.html';
            return;
        }
        
        if (this.cart.length === 0) {
            alert('No hay items en el carrito');
            return;
        }
        
        try {
    
            await this.mockApiCheckout();
            
            alert(`¡Alquiler realizado con éxito por ${this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} $!`);
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            window.location.href = 'index.html';
        } catch (error) {
            alert('Error al procesar el alquiler: ' + error.message);
        }
    }
    
    async mockApiCheckout() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
    }
}


const shoppingCart = new ShoppingCart();