class UserService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getUsers() {
    return this.apiService.request('api/alkile/users');
  }

  async getUsersById(id) {
    return this.apiService.request(`api/alkile/users/${id}`);
  }

  async createUsers(usersData) {
    return this.apiService.request('api/alkile/users', {
      method: 'POST',
      body: JSON.stringify(usersData)
    });
  }

  async updateUsers(id, usersData) {
    return this.apiService.request(`api/alkile/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(usersData)
    });
  }

  async deleteUsers(id) {
    return this.apiService.request(`api/alkile/users/${id}`, {
      method: 'DELETE'
    });
  }
}

export default UserService;
