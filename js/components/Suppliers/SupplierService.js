class SupplierService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getSuppliers() {
    return this.apiService.request('api/alkile/suppliers');
  }

  async getSupplierById(id) {
    return this.apiService.request(`api/alkile/suppliers/${id}`);
  }

  async createSupplier(supplierData) {
    return this.apiService.request('api/alkile/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData)
    });
  }

  async updateSupplier(id, supplierData) {
    return this.apiService.request(`api/alkile/suppliers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(supplierData)
    });
  }

  async deleteSupplier(id) {
    return this.apiService.request(`api/alkile/suppliers/${id}`, {
      method: 'DELETE'
    });
  }
}

export default SupplierService;
