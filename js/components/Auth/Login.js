class Login {
    constructor(authService, onAuthChange) {
        this.authService = authService;
        this.onAuthChange = onAuthChange;
        this.loginForm = document.getElementById('login-form');
        this.loginError = document.getElementById('login-error');
        
        this.setupForm();
    }

    render() {
        this.loginError.textContent = '';
        this.loginForm.reset();
    }

    setupForm() {
        this.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                window.showLoading(true);
                const success = await this.authService.login(username, password);
                if (success) {
                    window.showToast('Inicio de sesión exitoso', 'success');
                    this.onAuthChange();
                }
            } catch (error) {
                this.loginError.textContent = error.message;
                window.showToast('Error de inicio de sesión', 'error');
            } finally {
                window.showLoading(false);
            }
        });
    }
}

export default Login;