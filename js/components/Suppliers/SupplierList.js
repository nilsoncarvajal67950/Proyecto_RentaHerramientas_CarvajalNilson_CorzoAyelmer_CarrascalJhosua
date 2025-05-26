class SupplierList {
  constructor(supplierService, onEditSupplier, onDeleteSupplier) {
    this.supplierService = supplierService
    this.onEditSupplier = onEditSupplier
    this.onDeleteSupplier = onDeleteSupplier
    this.container = document.getElementById("suppliers-list")
  }

  async render() {
    this.container.innerHTML = this.createSkeletonLoading()

    try {
      const suppliers = await this.supplierService.getSuppliers()
      this.container.innerHTML = this.createSuppliersHtml(suppliers)
      this.setupEventListeners()
    } catch (error) {
      console.error("Error loading suppliers:", error)
      this.container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar proveedores: ${error.message}</p>
                    <button class="btn btn-secondary" id="retry-suppliers">Reintentar</button>
                </div>
            `
      document.getElementById("retry-suppliers")?.addEventListener("click", () => this.render())
    }
  }

  createSkeletonLoading() {
    return `
            <div class="card skeleton">
                <div class="skeleton-line" style="width: 70%; height: 24px; margin-bottom: 12px;"></div>
                <div class="skeleton-line" style="width: 100%; height: 16px; margin-bottom: 8px;"></div>
                <div class="skeleton-line" style="width: 100%; height: 16px; margin-bottom: 16px;"></div>
                <div style="display: flex; gap: 8px;">
                    <div class="skeleton-line" style="width: 80px; height: 36px;"></div>
                    <div class="skeleton-line" style="width: 80px; height: 36px;"></div>
                </div>
            </div>
        `.repeat(4)
  }

  createSuppliersHtml(suppliers) {
    if (suppliers.length === 0) {
      return `
                <div class="empty-state">
                    <i class="fas fa-truck fa-3x"></i>
                    <h3>No hay proveedores disponibles</h3>
                    <p>Aún no se han registrado proveedores en el sistema.</p>
                </div>
            `
    }

    return suppliers
      .map((supplier) => {
        const roles = this.getFormattedRoles(supplier.roles)

        return `
                <div class="card supplier-card">
                    <div class="card-header">
                        <h3>${supplier.username || "Nombre no disponible"}</h3>
                        <span class="supplier-badge">
                            <i class="fas fa-truck"></i> Proveedor
                        </span>
                    </div>
                    <div class="card-body">
                        <p><strong>Nombre:</strong> ${supplier.name || "No disponible"}</p>
                        <p><strong>Email:</strong> ${supplier.email || "No disponible"}</p>
                        <p><strong>Rol:</strong> ${roles}</p>
                        <p><strong>Dirección:</strong> ${supplier.address || "No disponible"}</p>
                        ${supplier.phone ? `<p><strong>Teléfono:</strong> ${supplier.phone}</p>` : ""}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-secondary edit-supplier" data-id="${supplier.id}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-danger delete-supplier" data-id="${supplier.id}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `
      })
      .join("")
  }

  getFormattedRoles(roles) {
    if (!roles || roles.length === 0) return "Sin rol asignado"

    const roleNames = {
      ADMIN: "Administrador",
      SUPPLIER: "Proveedor",
      CUSTOMER: "Cliente",
    }

    return roles.map((role) => roleNames[role] || role).join(", ")
  }

  setupEventListeners() {
    this.container.addEventListener("click", (e) => {
      const btn = e.target.closest("button")
      if (!btn) return

      const supplierId = btn.dataset.id
      if (!supplierId) return

      if (btn.classList.contains("edit-supplier")) {
        this.onEditSupplier(supplierId)
      } else if (btn.classList.contains("delete-supplier")) {
        this.onDeleteSupplier(supplierId)
      }
    })
  }
}

export default SupplierList;