class CategoryService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getCategories() {
    return this.apiService.request('api/alkile/categories');
  }

  async getCategoryById(id) {
    return this.apiService.request(`api/alkile/categories/${id}`);
  }

  async createCategory(categoryData) {
    return this.apiService.request('api/alkile/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  async updateCategory(id, categoryData) {
    return this.apiService.request(`api/alkile/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
  }

  async deleteCategory(id) {
    return this.apiService.request(`api/alkile/categories/${id}`, {
      method: 'DELETE'
    });
  }
}

export default CategoryService;