class Header {
    constructor(authService) {
        this.authService = authService;
        this.loginNav = document.getElementById('login-nav');
        this.logoutNav = document.getElementById('logout-nav');
        this.userInfo = document.getElementById('user-info');
        this.usernameDisplay = document.getElementById('username-display');
        this.roleDisplay = document.getElementById('role-display');
    }

    render() {
        this.setupLogout();
    }

    updateAuthState(isAuthenticated) {
        if (isAuthenticated) {
            this.loginNav.style.display = 'none';
            this.logoutNav.style.display = 'block';
            this.userInfo.style.display = 'block';

            const username = this.authService.getUsername();
            const role = this.authService.getUserRole();

            this.usernameDisplay.textContent = username;
            
            let roleText = '';
            switch(role) {
                case 'ADMIN':
                    roleText = 'Administrador';
                    break;
                case 'SUPPLIER':
                    roleText = 'Proveedor';
                    break;
                case 'CUSTOMER':
                    roleText = 'Cliente';
                    break;
                default:
                    roleText = role;
            }
            
            this.roleDisplay.textContent = roleText;
        } else {
            this.loginNav.style.display = 'block';
            this.logoutNav.style.display = 'none';
            this.userInfo.style.display = 'none';
        }
    }

    setupLogout() {
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.authService.logout();
            this.updateAuthState(false);
            
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById('login').classList.add('active');
        });
    }
}

export default Header;