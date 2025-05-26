class SupplierForm {
  constructor(supplierService, onSubmitSuccess) {
    this.supplierService = supplierService
    this.onSubmitSuccess = onSubmitSuccess
    this.setupForm()
  }

  setupForm() {
    const form = document.getElementById("supplier-form")
    form.addEventListener("submit", this.handleSubmit.bind(this))
    document.getElementById("cancel-supplier").addEventListener("click", this.close.bind(this))
  }

  openForCreate() {
    document.getElementById("supplier-form-title").textContent = "Agregar Proveedor"
    document.getElementById("supplier-id").value = ""

    // Mostrar el campo contraseña y limpiar su valor
    const passwordField = document.getElementById("supplier-password-container")
    const passwordInput = document.getElementById("supplier-password")
    if (passwordField) {
      passwordField.style.display = "block"
    }
    if (passwordInput) {
      passwordInput.value = ""
    }

    // Resetear el resto del formulario excepto la contraseña que ya limpiamos
    document.getElementById("supplier-username").value = ""
    document.getElementById("supplier-email").value = ""
    document.getElementById("supplier-name").value = ""
    document.getElementById("supplier-address").value = ""
    document.getElementById("supplier-phone").value = ""

    document.getElementById("supplier-form-container").style.display = "flex"
  }

  async openForEdit(supplierId) {
    try {
      const supplier = await this.supplierService.getSupplierById(supplierId);

      document.getElementById("supplier-form-title").textContent = "Editar Proveedor"
      document.getElementById("supplier-id").value = supplier.id || ""
      document.getElementById("supplier-username").value = supplier.username || ""
      document.getElementById("supplier-email").value = supplier.email || ""
      document.getElementById("supplier-name").value = supplier.name || ""
      document.getElementById("supplier-address").value = supplier.address || ""
      document.getElementById("supplier-phone").value = supplier.phone || ""

      // Ocultar el campo de contraseña al editar (ya que no es obligatorio cambiar)
      const passwordField = document.getElementById("supplier-password-container")
      if (passwordField) {
        passwordField.style.display = "none"
      }

      document.getElementById("supplier-form-container").style.display = "flex"
    } catch (error) {
      console.error("Error al cargar proveedor para edición:", error)
      alert(`Error al cargar proveedor: ${error.message}`)
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = {
      id: document.getElementById("supplier-id").value || null,
      username: document.getElementById("supplier-username").value,
      email: document.getElementById("supplier-email").value,
      name: document.getElementById("supplier-name").value,
      address: document.getElementById("supplier-address").value,
      phone: document.getElementById("supplier-phone").value,
      roles: ["SUPPLIER"],
    }

    // Solo incluir password si es un nuevo proveedor (crear)
    if (!formData.id) {
      const passwordField = document.getElementById("supplier-password")
      if (passwordField) {
        formData.password = passwordField.value
      }
    }

    const isEdit = !!formData.id
    const promise = isEdit
      ? this.supplierService.updateSupplier(formData.id, formData)
      : this.supplierService.createSupplier(formData)

    promise
      .then(() => {
        window.showToast(`Proveedor ${isEdit ? "actualizado" : "creado"} correctamente`, "success")
        this.onSubmitSuccess()
        this.close()
      })
      .catch((error) => {
        console.error("Error al guardar proveedor:", error)
        window.showToast(`Error al guardar proveedor: ${error.message}`, "error")
      })
  }

  close() {
    document.getElementById("supplier-form-container").style.display = "none"
  }
}

export default SupplierForm
