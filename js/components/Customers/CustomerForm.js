class CustomerForm {
  constructor(customerService, handleSubmitSuccess) {
    this.customerService = customerService;
    this.handleSubmitSuccess = handleSubmitSuccess;
    this.setupForm();
  }

  setupForm() {
    const form = document.getElementById('customer-form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
    document.getElementById('cancel-customer').addEventListener('click', this.close.bind(this));
    
    // Mostrar/ocultar campo de contraseña según sea creación o edición
    const passwordField = document.getElementById('customer-password-container');
    const idField = document.getElementById('customer-id');
    
    idField.addEventListener('change', () => {
      passwordField.style.display = idField.value ? 'none' : 'block';
    });
  }

  openForCreate() {
    document.getElementById('customer-form-title').textContent = 'Agregar Usuario';
    document.getElementById('customer-id').value = '';
    document.getElementById('customer-password-container').style.display = 'block';
    document.getElementById('customer-form').reset();
    document.getElementById('customer-form-container').style.display = 'flex';
  }

  openForEdit(customerId) {
    this.customerService.getCustomer(customerId).then(customer => {
      document.getElementById('customer-form-title').textContent = 'Editar Usuario';
      document.getElementById('customer-id').value = customer.id;
      document.getElementById('customer-username').value = customer.username;
      document.getElementById('customer-email').value = customer.email;
      document.getElementById('customer-name').value = customer.name;
      document.getElementById('customer-address').value = customer.address;
      document.getElementById('customer-phone').value = customer.phone || '';
      
      // Seleccionar el primer rol si hay múltiples
      const primaryRole = Array.isArray(customer.roles) ? customer.roles[0] : customer.roles;
      document.getElementById('customer-role').value = primaryRole || 'CUSTOMER';
      
      document.getElementById('customer-password-container').style.display = 'none';
      document.getElementById('customer-form-container').style.display = 'flex';
    }).catch(error => {
      console.error('Error al cargar usuario:', error);
      window.showToast('Error al cargar usuario', 'error');
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = {
      id: document.getElementById('customer-id').value || null,
      username: document.getElementById('customer-username').value,
      email: document.getElementById('customer-email').value,
      name: document.getElementById('customer-name').value,
      address: document.getElementById('customer-address').value,
      phone: document.getElementById('customer-phone').value,
      roles: [document.getElementById('customer-role').value]
    };
    
    // Solo incluir password si es un nuevo usuario
    if (!formData.id) {
      formData.password = document.getElementById('customer-password').value;
    }

    const isEdit = !!formData.id;
    const promise = isEdit 
      ? this.customerService.updateCustomer(formData.id, formData)
      : this.customerService.createCustomer(formData);

    promise.then(() => {
      window.showToast(`Usuario ${isEdit ? 'actualizado' : 'creado'} correctamente`, 'success');
      this.handleSubmitSuccess();
      this.close();
    }).catch(error => {
      console.error('Error al guardar usuario:', error);
      window.showToast(`Error al guardar usuario: ${error.message}`, 'error');
    });
  }

  close() {
    document.getElementById('customer-form-container').style.display = 'none';
  }
}

export default CustomerForm;