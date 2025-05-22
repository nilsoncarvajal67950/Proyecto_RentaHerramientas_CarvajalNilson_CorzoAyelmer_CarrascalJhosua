class SupplierForm {
  constructor(supplierService, onSubmitSuccess) {
    this.supplierService = supplierService;
    this.onSubmitSuccess = onSubmitSuccess;
    this.form = document.getElementById('supplier-form');
    this.container = document.getElementById('supplier-form-container');
    this.title = document.getElementById('supplier-form-title');
    this.cancelBtn = document.getElementById('cancel-supplier');
    
    this.setupForm();
  }

  openForCreate() {
    this.container.style.display = 'block';
    this.title.textContent = 'Agregar Proveedor';
    this.form.reset();
    document.getElementById('supplier-id').value = '';
  }

  async openForEdit(supplierId) {
    try {
      const supplier = await this.supplierService.getSupplierById(supplierId);
      
      this.title.textContent = 'Editar Proveedor';
      document.getElementById('supplier-id').value = supplier.id;
      document.getElementById('supplier-taxId').value = supplier.taxId;
      document.getElementById('supplier-company').value = supplier.company;
      document.getElementById('supplier-userId').value = supplier.userId;
      document.getElementById('supplier-rating').value = supplier.rating || '';
      
      this.container.style.display = 'block';
    } catch (error) {
      console.error('Error loading supplier for edit:', error);
      alert(`Error al cargar proveedor: ${error.message}`);
    }
  }

  setupForm() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const supplierData = this.getFormData();
      if (!supplierData) return;
      
      try {
        const supplierId = document.getElementById('supplier-id').value;
        
        if (supplierId) {
          await this.supplierService.updateSupplier(supplierId, supplierData);
        } else {
          await this.supplierService.createSupplier(supplierData);
        }
        
        this.container.style.display = 'none';
        this.onSubmitSuccess();
      } catch (error) {
        console.error('Error saving supplier:', error);
        alert(`Error al guardar proveedor: ${error.message}`);
      }
    });

    this.cancelBtn.addEventListener('click', () => {
      this.container.style.display = 'none';
    });
  }

  getFormData() {
    const taxId = document.getElementById('supplier-taxId').value.trim();
    const company = document.getElementById('supplier-company').value.trim();
    const userId = document.getElementById('supplier-userId').value.trim();
    const rating = document.getElementById('supplier-rating').value.trim();

    if (!taxId || !company || !userId) {
      alert('Tax ID, Company name y User ID son campos requeridos');
      return null;
    }

    return {
      taxId,
      company,
      userId: Number(userId),
      ...(rating && { rating: Number(rating) })
    };
  }
}

export default SupplierForm;