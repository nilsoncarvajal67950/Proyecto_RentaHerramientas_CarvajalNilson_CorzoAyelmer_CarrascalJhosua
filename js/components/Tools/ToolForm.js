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
        this.imagePreview = document.getElementById("current-images-preview");
        this.fileInput = document.getElementById("tool-images");
        this.dropZone = document.getElementById("drop-zone");
        this.setupForm();
    }

    async openForCreate() {
        try {
            await Promise.all([this.loadCategories(), this.loadSuppliers()]);
            this.title.textContent = "Agregar Herramienta";
            document.getElementById("tool-id").value = "";
            this.form.reset();
            this.imagePreview.innerHTML = '';
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
            document.getElementById("tool-description").value = tool.description || "";
            document.getElementById("tool-daily-cost").value = tool.dailyCost || "0";
            document.getElementById("tool-stock").value = tool.stock || "0";
            document.getElementById("tool-category").value = tool.categoryId || "";

            if (tool.supplier?.id) {
                document.getElementById("tool-supplier").value = tool.supplier.id;
            }

            // Mostrar la imagen actual
            this.imagePreview.innerHTML = '';
            if (tool.imageUrl) {
                const img = document.createElement('img');
                img.src = tool.imageUrl;
                img.alt = 'Imagen actual';
                img.className = 'preview-image';
                this.imagePreview.appendChild(img);
            }

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
        // Configurar drag and drop
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        
        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('drag-over');
        });

        this.dropZone.addEventListener('dragleave', () => {
            this.dropZone.classList.remove('drag-over');
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('drag-over');
            if (e.dataTransfer.files.length) {
                this.fileInput.files = e.dataTransfer.files;
                this.updateImagePreview();
            }
        });

        this.fileInput.addEventListener('change', () => this.updateImagePreview());

        // Configurar envío del formulario
        this.form.addEventListener("submit", async (e) => {
            e.preventDefault();

            try {
                const formData = this.getFormData();
                const toolId = document.getElementById("tool-id").value;

                if (toolId) {
                    await this.toolService.updateToolWithImages(toolId, formData);
                    window.showToast("Herramienta actualizada correctamente", "success");
                } else {
                    await this.toolService.createToolWithImages(formData);
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

    updateImagePreview() {
        this.imagePreview.innerHTML = '';
        const files = this.fileInput.files;
        
        if (files.length > 0) {
            Array.from(files).forEach(file => {
                if (!file.type.match('image.*')) {
                    window.showToast("Solo se permiten archivos de imagen", "error");
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.className = 'preview-image';
                    this.imagePreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    getFormData() {
    const name = document.getElementById("tool-name").value.trim();
    const description = document.getElementById("tool-description").value.trim();
    const dailyCost = parseFloat(document.getElementById("tool-daily-cost").value);
    const stock = parseInt(document.getElementById("tool-stock").value);
    const categoryId = document.getElementById("tool-category").value;
    const supplierId = document.getElementById("tool-supplier").value;
    const toolId = document.getElementById("tool-id").value;

    if (!name) throw new Error("El nombre es requerido");
    if (!description) throw new Error("La descripción es requerida");
    if (isNaN(dailyCost) || dailyCost <= 0)
        throw new Error("El costo diario debe ser un número positivo");
    if (isNaN(stock) || stock < 0)
        throw new Error("El stock debe ser un número positivo o cero");
    if (!categoryId) throw new Error("Debe seleccionar una categoría");

    // Crear objeto tool con la estructura que espera el backend
    const toolData = {
        name,
        description,
        dailyCost,
        stock,
        category: { id: categoryId }, // Enviar como objeto category con id
        supplier: supplierId ? { id: supplierId } : null, // Enviar como objeto supplier si existe
        id: toolId || null
    };

    const formData = new FormData();
    formData.append("tool", JSON.stringify(toolData));

    // Adjuntar imágenes
    const files = this.fileInput.files;
    if (files.length > 0) {
        Array.from(files).forEach((file, index) => {
            formData.append("images", file);
        });
    }

    return formData;
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