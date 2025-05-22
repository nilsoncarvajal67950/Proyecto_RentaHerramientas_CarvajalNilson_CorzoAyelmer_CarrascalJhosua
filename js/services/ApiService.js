class ApiService {
    constructor(baseUrl) {
        this.API_URL = baseUrl;
    }

    async request(endpoint, options = {}) {
        const token = localStorage.getItem("token");
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            window.showLoading(true);
            const response = await fetch(`${this.API_URL}${endpoint}`, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({
                    message: `HTTP error! status: ${response.status}`
                }));
                
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    window.showToast("Debes iniciar sesión para acceder a esta función", "error");
                    window.navigateToPage("login");
                    throw new Error("No autorizado - Debes iniciar sesión");
                }
                
                throw new Error(errorData.message || "Error en la solicitud");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            
            
            if (!error.message.includes("No autorizado")) {
                window.showToast(error.message || "Error en la solicitud", "error");
            }
            
            throw error;
        } finally {
            window.showLoading(false);
        }
    }
}

export default ApiService;