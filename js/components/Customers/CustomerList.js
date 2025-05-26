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
        console.log('Datos recibidos de usuarios:', customers); 
      if (customers.length === 0) {
        container.innerHTML = "<p>No hay usuarios registrados</p>";
        return;
      }

      let html = "";
      customers.forEach((customer) => {
        html += `
                    <div class="card">
                        <div class="card-header">
                            <h3>${
                              customer.username || "Nombre no disponible"
                            }</h3>
                        </div>
                        <div class="card-body">
                            <p><strong>Email:</strong> ${
                              customer.email || "No disponible"
                            }</p>
                            <p><strong>Rol:</strong> ${this.getRoleName(
                              customer.roles
                            )}</p>
                            <p><strong>Dirección:</strong> ${
                              customer.address || "No disponible"
                            }</p>
                            ${
                              customer.phone
                                ? `<p><strong>Teléfono:</strong> ${customer.phone}</p>`
                                : ""
                            }
                        </div>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="app.handleEditCustomer(${
                              customer.id
                            })">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button class="btn btn-danger" onclick="app.handleDeleteCustomer(${
                              customer.id
                            })">
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

  getRoleName(roles) {
    if (!roles || !Array.isArray(roles) || roles.length === 0) {
        return "Sin rol asignado";
    }

    return roles.map(role => {
        switch (role) {
            case "ADMIN":
                return "Administrador";
            case "SUPPLIER":
                return "Proveedor";
            case "CUSTOMER":
                return "Cliente";
            default:
                return role;
        }
    }).join(", ");
}
}

export default CustomerList;
