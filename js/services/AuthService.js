class AuthService {
    constructor() {
        this.API_URL = "http://localhost:8080/api";
    }

    async login(username, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: "Usuario o contraseña inválidas"
                }));
                throw new Error(errorData.message || "Error de autenticación");
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("userRole", data.role);
            localStorage.setItem("username", username);
            localStorage.setItem("userId", data.userId);

            return true;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    async register(registerData) {
        try {
            const response = await fetch(`${this.API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(registerData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Registration failed");
            }

            return await response.json();
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        window.showToast('Sesión cerrada correctamente', 'info');
    }

    isAuthenticated() {
        return !!localStorage.getItem("token");
    }

    getToken() {
        return localStorage.getItem("token");
    }

    getUserRole() {
        return localStorage.getItem("userRole");
    }

    getUsername() {
        return localStorage.getItem("username");
    }

    getUserId() {
        return localStorage.getItem("userId");
    }
}

export default AuthService;