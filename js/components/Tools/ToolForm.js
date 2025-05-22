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
        try {
            await Promise.all([this.loadCategories(), this.loadSuppliers()]);
            this.title.textContent = "Agregar Herramienta";
            document.getElementById("tool-id").value = "";
            this.form.reset();
            this.container.style.display = "block";
        } catch (error) {
            console.error("Error opening tool form:", error);
            window.showToast("Error al cargar formulario", "error");
        }
    }

    async openForEdit(toolId) {
        try {
            const [tool, categories, suppliers] = await Promise.all([
                this.toolService.getToolById(toolId),
                this.loadCategories(),
                this.loadSuppliers(),
            ]);

            if (!tool) {
                throw new Error("Herramienta no encontrada");
            }

            this.title.textContent = "Editar Herramienta";
            document.getElementById("tool-id").value = tool.id;
            document.getElementById("tool-name").value = tool.name || "";
            document.getElementById("tool-description").value =
                tool.description || "";
            document.getElementById("tool-daily-cost").value = tool.dailyCost || "0";
            document.getElementById("tool-stock").value = tool.stock || "0";
            document.getElementById("tool-category").value = tool.categoryId || "";
            document.getElementById("tool-supplier").value = tool.supplier?.id || "";

            this.container.style.display = "block";
        } catch (error) {
            console.error("Error loading tool for edit:", error);
            window.showToast(
                `Error al cargar herramienta: ${error.message}`,
                "error"
            );
        }
    }

    async loadCategories() {
        try {
            const categories = await this.categoryService.getCategories();
            const select = document.getElementById("tool-category");

            select.innerHTML =
                '<option value="">Seleccione categoría</option>' +
                categories
                    .map(
                        (category) =>
                            `<option value="${category.id}">${category.name}</option>`
                    )
                    .join("");

            return categories;
        } catch (error) {
            console.error("Error loading categories:", error);
            window.showToast("Error al cargar categorías", "error");
            return [];
        }
    }

    async loadSuppliers() {
        try {
            const suppliers = await this.supplierService.getSuppliers();
            const select = document.getElementById("tool-supplier");

            select.innerHTML =
                '<option value="">Seleccione proveedor</option>' +
                suppliers
                    .map(
                        (supplier) =>
                            `<option value="${supplier.id}">${supplier.company}</option>`
                    )
                    .join("");

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

            try {
                const toolData = this.getFormData();
                const toolId = document.getElementById("tool-id").value;

                if (toolId) {
                    await this.toolService.updateTool(toolId, toolData);
                    window.showToast("Herramienta actualizada correctamente", "success");
                } else {
                    await this.toolService.createTool(toolData);
                    window.showToast("Herramienta creada correctamente", "success");
                }

                this.container.style.display = "none";
                this.onSubmitSuccess();
            } catch (error) {
                console.error("Error saving tool:", error);
                window.showToast(
                    `Error al guardar herramienta: ${this.getErrorMessage(error)}`,
                    "error"
                );
            }
        });

        this.cancelBtn.addEventListener("click", () => {
            this.container.style.display = "none";
        });
    }

    getFormData() {
        const name = document.getElementById("tool-name").value.trim();
        const description = document
            .getElementById("tool-description")
            .value.trim();
        const dailyCost = parseFloat(
            document.getElementById("tool-daily-cost").value
        );
        const stock = parseInt(document.getElementById("tool-stock").value);
        const categoryId = document.getElementById("tool-category").value;
        const supplierId = document.getElementById("tool-supplier").value;

        if (!name) throw new Error("El nombre es requerido");
        if (!description) throw new Error("La descripción es requerida");
        if (isNaN(dailyCost) || dailyCost <= 0)
            throw new Error("El costo diario debe ser un número positivo");
        if (isNaN(stock) || stock < 0)
            throw new Error("El stock debe ser un número positivo o cero");
        if (!categoryId) throw new Error("Debe seleccionar una categoría");
        if (!supplierId) throw new Error("Debe seleccionar un proveedor");

        return {
            name,
            description,
            dailyCost,
            stock,
            category: { id: Number(categoryId) },
            supplier: { id: Number(supplierId) },
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
}

export default ToolForm;
