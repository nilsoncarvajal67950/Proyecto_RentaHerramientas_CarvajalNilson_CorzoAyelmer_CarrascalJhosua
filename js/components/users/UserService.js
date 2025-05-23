class Userservice {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getUsers() {
    return this.apiService.request('api/alkile/users');
  }

  async getSupplierById(id) {
    return this.apiService.request(`api/alkile/users/${id}`);
  }

  async createSupplier(supplierData) {
    return this.apiService.request('api/alkile/users', {
      method: 'POST',
      body: JSON.stringify(supplierData)
    });
  }

  async updateSupplier(id, supplierData) {
    return this.apiService.request(`api/alkile/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData)
    });
  }

  async deleteSupplier(id) {
    return this.apiService.request(`api/alkile/users/${id}`, {
      method: 'DELETE'
    });
  }
}

export default Userservice;
