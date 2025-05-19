class Header extends HTMLElement {
    constructor() {
    super();
    this.shadowDOM = this.attachShadow({ mode: "open" });
    this.render();
    }

    connectedCallback() {
    this.updateCartCount();
    this.loadExternalStyles();
    }

    updateCartCount() {
    const cartCount = this.shadowDOM.getElementById("cart-count");
    if (cartCount) {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
        cartCount.textContent = cartItems.length;
    }
    }

    loadExternalStyles() {
    const tailwindLink = document.createElement("link");
    tailwindLink.rel = "stylesheet";
    tailwindLink.href = "https://cdn.tailwindcss.com";

    const fontAwesomeLink = document.createElement("link");
    fontAwesomeLink.rel = "stylesheet";
    fontAwesomeLink.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css";

    this.shadowDOM.appendChild(tailwindLink);
    this.shadowDOM.appendChild(fontAwesomeLink);
    }

    render() {
    this.shadowDOM.innerHTML = `
        <div class="bg-blue-400 shadow-sm">
        <div class="container mx-auto px-4 py-4">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
                <img src="./assets/images/icons/logo-transparente.png" alt="Alkile Logo" class="h-16 w-auto">
            </div>

            <div class="md:text-right text-center">
                <p class="text-sm font-semibold text-gray-100">3164938507 - 3336475416</p>
                <a href="mailto:contactsupport@gmail.com" class="text-sm font-bold text-gray-100">contacto@alkile.com</a>
            </div>
            </div>

            <nav class="mt-4">
            <ul class="font-bold text-white flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                <li>
                <a href="index.html" class="hover:text-gray-600 transition-colors">
                    INICIO
                </a>
                </li>
                <li id="user-menu">
                <a href="pages/login.html" class="hover:text-gray-600 transition-colors">
                    <i class="fas fa-user mr-1"></i> MI CUENTA
                </a>
                </li>
                <li>
                <a href="pages/carrito.html" class="hover:text-gray-600 transition-colors">
                    <i class="fas fa-shopping-cart mr-1"></i> (<span id="cart-count">0</span>)
                </a>
                </li>
            </ul>
            </nav>
        </div>
        </div>
    `;
    }
}

customElements.define("alkile-header", Header);

export default Header;
