class ApiService {
    constructor(baseUrl) {
        this.API_URL = baseUrl;
    }

    async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        ...options.headers,
    };

    // Si no se especifica un Content-Type, no lo incluyamos
    if (options.body && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status}`
        }));
        throw new Error(errorData.message || "Request failed");
    }

    return response.json();
}
}

export default ApiService;