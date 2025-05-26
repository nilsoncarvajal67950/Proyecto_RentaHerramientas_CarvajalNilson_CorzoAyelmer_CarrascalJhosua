class Register {
    constructor(authService, onAuthChange, navigateTo) {
        this.authService = authService;
        this.onAuthChange = onAuthChange;
        this.navigateTo = navigateTo;
        this.registerForm = document.getElementById('register-form');
        this.registerError = document.getElementById('registro-error');
        
        this.setupForm();
    }

    render() {
        this.registerError.textContent = '';
        this.registerForm.reset();
    }

    setupForm() {
        this.registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const registerData = {
                username: document.getElementById('reg-username').value,
                name: document.getElementById('reg-name').value,
                email: document.getElementById('reg-email').value,
                address: document.getElementById('reg-address').value,
                phone: document.getElementById('reg-phone').value || null,
                password: document.getElementById('reg-password').value
            };

            // Client-side validation
            if (registerData.password.length < 8) {
                this.registerError.textContent = 'La contraseña debe tener al menos 8 caracteres';
                return;
            }

            try {
                window.showLoading(true);
                await this.authService.register(registerData);
                window.showToast('Registro exitoso. Por favor inicie sesión.', 'success');
                this.navigateTo('login');
            } catch (error) {
                this.registerError.textContent = error.message;
                window.showToast('Error en el registro: ' + error.message, 'error');
            } finally {
                window.showLoading(false);
            }
        });
    }
}

export default Register;