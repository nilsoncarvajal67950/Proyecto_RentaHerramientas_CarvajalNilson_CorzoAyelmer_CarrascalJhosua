class ToolList {
  constructor(
    toolService,
    authService,
    categoryService,
    onEditTool,
    onDeleteTool,
    onReserveTool
  ) {
    this.toolService = toolService;
    this.authService = authService;
    this.categoryService = categoryService;
    this.onEditTool = onEditTool;
    this.onDeleteTool = onDeleteTool;
    this.onReserveTool = onReserveTool;
    this.container = document.getElementById("tools-container");
    this.allTools = [];
    this.categories = [];
  }

  async render() {
    try {
      window.showLoading(true);

      const [tools, categories] = await Promise.all([
        this.toolService.getTools(),
        this.categoryService.getCategories(),
      ]);

      this.allTools = tools.filter((tool) => tool.categoryId != null);

      this.container.innerHTML = this.createToolsHtml(
        this.allTools,
        categories
      );
      this.setupEventListeners();
    } catch (error) {
      console.error("Error loading tools:", error);
      this.container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error al cargar herramientas: ${error.message}</p>
                <button class="btn btn-secondary" id="retry-tools">Reintentar</button>
            </div>
        `;
      document
        .getElementById("retry-tools")
        ?.addEventListener("click", () => this.render());
    } finally {
      window.showLoading(false);
    }
  }

  filterTools(searchTerm = "", categoryId = "") {
    let filteredTools = [...this.allTools];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTools = filteredTools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(term) ||
          tool.description.toLowerCase().includes(term)
      );
    }

    if (categoryId) {
      filteredTools = filteredTools.filter(
        (tool) => tool.categoryId == categoryId
      );
    }

    this.container.innerHTML = this.createToolsHtml(filteredTools, this.categories);
    this.setupEventListeners();
  }

  createToolsHtml(tools, categories) {
    if (tools.length === 0) {
      return `
            <div class="empty-state">
                <i class="fas fa-tools fa-3x"></i>
                <h3>No hay herramientas disponibles</h3>
                <p>Aún no se han registrado herramientas en el sistema.</p>
            </div>
        `;
    }

    // Usamos un Map para buscar rápido por categoryId
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

    return tools
      .map((tool) => {
        const categoria = tool.categoryId && categoryMap.get(tool.categoryId);

        return `
        <div class="card tool-card">
            <h3>${tool.name}</h3>
            <p class="tool-description">${tool.description}</p>

            <div class="tool-details">
                <p><i class="fas fa-dollar-sign"></i> Costo diario: $${
                  tool.dailyCost?.toFixed(2) || "0.00"
                }</p>
                <p><i class="fas fa-boxes"></i> Stock: ${tool.stock || 0}</p>
                <p><i class="fas fa-tag"></i> Categoría: ${
                  categoria ? categoria.name : "Categoría no encontrada"
                }</p>
                ${
                  tool.supplier
                    ? `<p><i class="fas fa-truck"></i> Proveedor: ${
                        tool.supplier.company || "Sin proveedor"
                      }</p>`
                    : ""
                }
            </div>

            <div class="card-actions">
                <button class="btn btn-secondary edit-tool" data-id="${
                  tool.id
                }">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-danger delete-tool" data-id="${tool.id}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
        `;
      })
      .join("");
  }

  setupEventListeners() {
    this.container.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const toolId = btn.dataset.id;
      if (!toolId) return;

      if (btn.classList.contains("edit-tool")) {
        this.onEditTool(toolId);
      } else if (btn.classList.contains("delete-tool")) {
        this.onDeleteTool(toolId);
      } else if (btn.classList.contains("reserve-tool")) {
        this.onReserveTool(toolId);
      }
    });
  }
}

export default ToolList;
