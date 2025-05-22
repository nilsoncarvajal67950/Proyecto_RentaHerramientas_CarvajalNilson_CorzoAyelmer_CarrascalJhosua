
class SupplierList {
    constructor(supplierService, onEditSupplier, onDeleteSupplier) {
        this.supplierService = supplierService;
        this.onEditSupplier = onEditSupplier;
        this.onDeleteSupplier = onDeleteSupplier;
        this.container = document.getElementById('suppliers-list');
    }

    async render() {

        this.container.innerHTML = this.createSkeletonLoading();

        try {
            const suppliers = await this.supplierService.getSuppliers();
            this.container.innerHTML = this.createSuppliersHtml(suppliers);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading suppliers:', error);
            this.container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar proveedores: ${error.message}</p>
                    <button class="btn btn-secondary" id="retry-suppliers">Reintentar</button>
                </div>
            `;
            document.getElementById('retry-suppliers').addEventListener('click', () => this.render());
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
        `.repeat(4);
    }

    createSuppliersHtml(suppliers) {
    if (suppliers.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-truck fa-3x"></i>
                <h3>No hay proveedores disponibles</h3>
                <p>Aún no se han registrado proveedores en el sistema.</p>
            </div>
        `;
    }

    return suppliers.map(supplier => `
        <div class="card supplier-card">
            <h3>${supplier.company}</h3>
            <div class="supplier-details">
                <p><i class="fas fa-id-card"></i> RFC: ${supplier.taxId}</p>
                <p><i class="fas fa-star"></i> Rating: ${supplier.rating ? supplier.rating.toFixed(1) : 'No evaluado'}</p>
                <p><i class="fas fa-user"></i> ID Usuario: ${supplier.userId}</p>
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
    `).join('');
}

    setupEventListeners() {
        this.container.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;

            const supplierId = btn.dataset.id;
            if (btn.classList.contains('edit-supplier')) {
                this.onEditSupplier(supplierId);
            } else if (btn.classList.contains('delete-supplier')) {
                if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
                    this.onDeleteSupplier(supplierId);
                }
            }
        });
    }
}

export default SupplierList;