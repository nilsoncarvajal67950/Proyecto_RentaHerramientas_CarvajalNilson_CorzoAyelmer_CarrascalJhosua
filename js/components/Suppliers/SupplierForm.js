class SupplierForm {
  constructor(supplierService, onSubmitSuccess) {
    this.supplierService = supplierService;
    this.onSubmitSuccess = onSubmitSuccess;
    this.form = document.getElementById("supplier-form");
    this.container = document.getElementById("supplier-form-container");
    this.title = document.getElementById("supplier-form-title");
    this.cancelBtn = document.getElementById("cancel-supplier");

    this.setupForm();
  }

  openForCreate() {
    this.container.style.display = "block";
    this.title.textContent = "Agregar Proveedor";
    this.form.reset();
    document.getElementById("supplier-id").value = "";
  }

  async openForEdit(supplierId) {
    try {
      const supplier = await this.supplierService.getSupplierById(supplierId);

      if (!supplier) {
        throw new Error("Proveedor no encontrado");
      }

      this.title.textContent = "Editar Proveedor";
      document.getElementById("supplier-id").value = supplier.id;
      document.getElementById("supplier-taxId").value = supplier.taxId || "";
      document.getElementById("supplier-company").value =
        supplier.company || "";
      document.getElementById("supplier-userId").value = supplier.userId || "";
      document.getElementById("supplier-rating").value = supplier.rating || "";

      this.container.style.display = "block";
    } catch (error) {
      console.error("Error loading supplier for edit:", error);
      this.showError(`Error al cargar proveedor: ${error.message}`);
    }
  }

  setupForm() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const supplierData = this.getFormData();
        const supplierId = document.getElementById("supplier-id").value;

        if (supplierId) {
          await this.supplierService.updateSupplier(supplierId, supplierData);
          this.showSuccess("Proveedor actualizado exitosamente");
        } else {
          await this.supplierService.createSupplier(supplierData);
          this.showSuccess("Proveedor creado exitosamente");
        }

        this.container.style.display = "none";
        this.onSubmitSuccess();
      } catch (error) {
        console.error("Error saving supplier:", error);
        this.showError(
          `Error al guardar proveedor: ${this.getErrorMessage(error)}`
        );
      }
    });

    this.cancelBtn.addEventListener("click", () => {
      this.container.style.display = "none";
    });
  }

  getFormData() {
    const taxId = document.getElementById("supplier-taxId").value.trim();
    const company = document.getElementById("supplier-company").value.trim();
    const userId = document.getElementById("supplier-userId").value.trim();
    const rating = document.getElementById("supplier-rating").value.trim();

    if (!taxId) {
      throw new Error("Tax ID es requerido");
    }

    if (!company) {
      throw new Error("Nombre de la empresa es requerido");
    }

    if (!userId) {
      throw new Error("User ID es requerido");
    }

    if (isNaN(userId)) {
      throw new Error("User ID debe ser un número");
    }

    if (rating && isNaN(rating)) {
      throw new Error("Rating debe ser un número");
    }

    return {
      taxId,
      company,
      userId: Number(userId),
      ...(rating && { rating: Number(rating) }),
    };
  }

  getErrorMessage(error) {
    if (error.response) {
      try {
        const data = JSON.parse(error.response);
        return data.message || error.message;
      } catch {
        return error.message;
      }
    }
    return error.message;
  }

  showError(message) {
    alert(message);
  }

  showSuccess(message) {
    console.log(message);
  }
}

export default SupplierForm;
