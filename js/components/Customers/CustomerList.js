class CustomerList {
  constructor(customerService, handleEdit, handleDelete) {
    this.customerService = customerService;
    this.handleEdit = handleEdit;
    this.handleDelete = handleDelete;
  }

  async render() {
    const container = document.getElementById('customers-list');
    container.innerHTML = '<div class="loading">Cargando usuarios...</div>';

    try {
      const customers = await this.customerService.getCustomers();
      
      if (!customers || customers.length === 0) {
        container.innerHTML = "<p>No hay usuarios registrados</p>";
        return;
      }

      let html = "";
      customers.forEach((customer) => {
        const roles = this.getFormattedRoles(customer.roles);
       
        html += `
          <div class="card">
            <div class="card-header">
              <h3>${customer.username || "Nombre no disponible"}</h3>
            </div>
            <div class="card-body">
              <p><strong>Email:</strong> ${customer.email || "No disponible"}</p>
              <p><strong>Nombre:</strong> ${customer.name || "No disponible"}</p>
              <p><strong>Rol:</strong> ${roles}</p>
              <p><strong>Dirección:</strong> ${customer.address || "No disponible"}</p>
              ${customer.phone ? `<p><strong>Teléfono:</strong> ${customer.phone}</p>` : ""}
            </div>
            <div class="card-actions">
              <button class="btn btn-secondary" onclick="app.handleEditCustomer('${customer.id}')">
                <i class="fas fa-edit"></i> Editar
              </button>
                <button class="btn btn-danger" onclick="if(confirm('¿Estás seguro de eliminar este usuario?')) app.handleDeleteCustomer('${customer.id}')">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      container.innerHTML = `<p class="error">Error al cargar usuarios: ${error.message}</p>`;
    }
  }

  getFormattedRoles(roles) {
    if (!roles || roles.length === 0) return "Sin rol asignado";
    
    const roleNames = {
      "ADMIN": "Administrador",
      "SUPPLIER": "Proveedor",
      "CUSTOMER": "Cliente"
    };
    
    return roles.map(role => roleNames[role] || role).join(", ");
  }
}

export default CustomerList;