class CustomerForm {
    constructor(customerService, handleSubmitSuccess) {
        this.customerService = customerService;
        this.handleSubmitSuccess = handleSubmitSuccess;
        this.setupForm();
    }

    setupForm() {
        // Configura los eventos del formulario
        document.getElementById('customer-form').addEventListener('submit', this.handleSubmit.bind(this));
        document.getElementById('cancel-customer').addEventListener('click', this.close.bind(this));
    }

    openForCreate() {
        document.getElementById('customer-form-title').textContent = 'Agregar Usuario';
        document.getElementById('customer-id').value = '';
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
            document.getElementById('customer-role').value = customer.role;
            
            document.getElementById('customer-form-container').style.display = 'flex';
        }).catch(error => {
            console.error('Error al cargar usuario:', error);
            window.showToast('Error al cargar usuario', 'error');
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const customerData = {
            id: document.getElementById('customer-id').value || null,
            username: document.getElementById('customer-username').value,
            email: document.getElementById('customer-email').value,
            name: document.getElementById('customer-name').value,
            address: document.getElementById('customer-address').value,
            phone: document.getElementById('customer-phone').value,
            role: document.getElementById('customer-role').value
        };

        const promise = customerData.id 
            ? this.customerService.updateCustomer(customerData.id, customerData)
            : this.customerService.createCustomer(customerData);

        promise.then(() => {
            window.showToast('Usuario guardado correctamente', 'success');
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
