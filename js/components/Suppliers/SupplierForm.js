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

    // Mostrar/ocultar campo de contraseña según sea creación o edición
    const passwordField = document.getElementById("supplier-password-container")
    const idField = document.getElementById("supplier-id")

    if (passwordField && idField) {
      idField.addEventListener("change", () => {
        passwordField.style.display = idField.value ? "none" : "block"
      })
    }
  }

  openForCreate() {
    document.getElementById("supplier-form-title").textContent = "Agregar Proveedor"
    document.getElementById("supplier-id").value = ""

    // Mostrar campo de contraseña para nuevos proveedores
    const passwordField = document.getElementById("supplier-password-container")
    if (passwordField) {
      passwordField.style.display = "block"
    }

    document.getElementById("supplier-form").reset()
    document.getElementById("supplier-form-container").style.display = "flex"
  }

  openForEdit(supplierId) {
    this.supplierService
      .getSupplierById(supplierId)
      .then((supplier) => {
        document.getElementById("supplier-form-title").textContent = "Editar Proveedor"
        document.getElementById("supplier-id").value = supplier.id
        document.getElementById("supplier-username").value = supplier.username
        document.getElementById("supplier-email").value = supplier.email
        document.getElementById("supplier-name").value = supplier.name
        document.getElementById("supplier-address").value = supplier.address
        document.getElementById("supplier-phone").value = supplier.phone || ""

        // Ocultar campo de contraseña para edición
        const passwordField = document.getElementById("supplier-password-container")
        if (passwordField) {
          passwordField.style.display = "none"
        }

        document.getElementById("supplier-form-container").style.display = "flex"
      })
      .catch((error) => {
        console.error("Error al cargar proveedor:", error)
        window.showToast("Error al cargar proveedor", "error")
      })
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
      roles: ["SUPPLIER"], // Los proveedores siempre tienen rol SUPPLIER
    }

    // Solo incluir password si es un nuevo proveedor
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
