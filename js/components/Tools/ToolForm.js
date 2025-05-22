class ToolForm {
    constructor(toolService, categoryService, supplierService, onSubmitSuccess) {
        this.toolService = toolService;
        this.categoryService = categoryService;
        this.supplierService = supplierService;
        this.onSubmitSuccess = onSubmitSuccess;
        this.form = document.getElementById("tool-form");
        this.container = document.getElementById("tool-form-container");
        this.title = document.getElementById("tool-form-title");
        this.cancelBtn = document.getElementById("cancel-tool");

        this.setupForm();
    }

    async openForCreate() {
        await Promise.all([
            this.loadCategories(),
            this.loadSuppliers()
        ]);
        this.title.textContent = "Agregar Herramienta";
        document.getElementById("tool-id").value = "";
        this.form.reset();
        this.container.style.display = "block";
    }

    async openForEdit(toolId) {
        try {
            const [tool, categories, suppliers] = await Promise.all([
                this.toolService.getToolById(toolId),
                this.loadCategories(),
                this.loadSuppliers()
            ]);

            this.title.textContent = "Editar Herramienta";
            document.getElementById("tool-id").value = tool.id;
            document.getElementById("tool-name").value = tool.name;
            document.getElementById("tool-description").value = tool.description;
            document.getElementById("tool-daily-cost").value = tool.dailyCost;
            document.getElementById("tool-stock").value = tool.stock;
            document.getElementById("tool-category").value = tool.categoryId;
            document.getElementById("tool-supplier").value = tool.supplier.id || "";

            this.container.style.display = "block";
        } catch (error) {
            console.error("Error loading tool for edit:", error);
            alert(`Error al cargar herramienta: ${error.message}`);
        }
    }

    async loadCategories() {
        try {
            const categories = await this.categoryService.getCategories();
            const select = document.getElementById("tool-category");

            select.innerHTML = '<option value="">Seleccione categoría</option>' +
                categories.map(category =>
                    `<option value="${category.id}">${category.name}</option>`
                ).join("");

            return categories;
        } catch (error) {
            console.error("Error loading categories:", error);
            return [];
        }
    }

    async loadSuppliers() {
        try {
            const suppliers = await this.supplierService.getSuppliers();
            const select = document.getElementById("tool-supplier");

            select.innerHTML = '<option value="">Seleccione proveedor</option>' +
                suppliers.map(supplier =>
                    `<option value="${supplier.id}">${supplier.company}</option>`
                ).join("");

            return suppliers;
        } catch (error) {
            console.error("Error loading suppliers:", error);
            window.showToast("Error al cargar proveedores", "error");
            return [];
        }
    }

    setupForm() {
        this.form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const toolData = this.getFormData();
            if (!toolData) return;

            try {
                const toolId = document.getElementById("tool-id").value;

                if (toolId) {
                    await this.toolService.updateTool(toolId, toolData);
                } else {
                    await this.toolService.createTool(toolData);
                }

                this.container.style.display = "none";
                this.onSubmitSuccess();
            } catch (error) {
                console.error("Error saving tool:", error);
                alert(`Error al guardar herramienta: ${error.message}`);
            }
        });

        this.cancelBtn.addEventListener("click", () => {
            this.container.style.display = "none";
        });
    }

    getFormData() {
        const toolId = document.getElementById("tool-id").value;
        const name = document.getElementById("tool-name").value.trim();
        const description = document.getElementById("tool-description").value.trim();
        const dailyCost = parseFloat(document.getElementById("tool-daily-cost").value);
        const stock = parseInt(document.getElementById("tool-stock").value);
        const categoryId = document.getElementById("tool-category").value;
        const supplierId = document.getElementById("tool-supplier").value;

        if (!name || !description || isNaN(dailyCost) || isNaN(stock) || !categoryId || categoryId === "" || !supplierId) {
            if (!categoryId) {
                alert("Debe seleccionar una categoría");
            } else {
                alert("Por favor complete todos los campos requeridos correctamente");
            }
            return null;
        }

        return {
            ...(toolId && { id: Number(toolId) }),
            name,
            description,
            dailyCost,
            stock,
            categoryId: Number(categoryId),
            ...(supplierId && { supplier: { id: Number(supplierId) } })
        };
    }
}

export default ToolForm;