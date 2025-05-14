class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.loadUser();
        this.setupEventListeners();
    }
    
    loadUser() {
        const userData = localStorage.getItem('alkile_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUI();
        }
    }
    
    setupEventListeners() {
      
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));
        
    
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }
    
    async handleLogin(e) {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        
 
        try {
            const user = await this.mockApiLogin(email, password);
            this.currentUser = user;
            localStorage.setItem('alkile_user', JSON.stringify(user));
            this.updateUI();
            alert('¡Bienvenido!');
            window.location.href = 'index.html';
        } catch (error) {
            alert(error.message);
        }
    }
    
    async handleRegister(e) {
        e.preventDefault();
        const name = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        
      
        try {
            const user = await this.mockApiRegister(name, email, password);
            this.currentUser = user;
            localStorage.setItem('alkile_user', JSON.stringify(user));
            this.updateUI();
            alert('¡Registro exitoso!');
            window.location.href = 'index.html';
        } catch (error) {
            alert(error.message);
        }
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('alkile_user');
        this.updateUI();
        window.location.href = 'index.html';
    }
    
    updateUI() {
   
        if (this.currentUser) {
            document.getElementById('user-menu').innerHTML = `
                <a href="#"><i class="fas fa-user"></i> ${this.currentUser.name}</a>
                <ul class="submenu">
                    <li><a href="#" id="logout-btn">Cerrar Sesión</a></li>
                </ul>
            `;
            document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        } else {
            document.getElementById('user-menu').innerHTML = `
                <a href="cuenta.html"><i class="fas fa-user"></i> MI CUENTA</a>
            `;
        }
    }
    
    switchTab(tab) {
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        
        document.getElementById(`${tab}-form`).classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${tab}"]`).classList.add('active');
    }
    
    
    async mockApiLogin(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'user@example.com' && password === 'password') {
                    resolve({ id: 1, name: "Usuario Demo", email });
                } else {
                    reject(new Error('Credenciales incorrectas'));
                }
            }, 1000);
        });
    }
    
    async mockApiRegister(name, email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ id: Math.floor(Math.random() * 1000), name, email });
            }, 1000);
        });
    }
}


const authSystem = new AuthSystem();