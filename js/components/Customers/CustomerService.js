class CustomerService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    getCustomers() {
        return this.apiService.request('api/alkile/users', 'GET');
    }

    getCustomer(id) {
        return this.apiService.request(`api/alkile/users/${id}`, 'GET');
    }

    createCustomer(customerData) {
        return this.apiService.request('api/alkile/users', 'POST', customerData);
    }

    updateCustomer(id, customerData) {
        return this.apiService.request(`api/alkile/users/${id}`, 'PUT', customerData);
    }

    deleteCustomer(id) {
        return this.apiService.request(`api/alkile/users/${id}`, 'DELETE');
    }
}

export default CustomerService;
