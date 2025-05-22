class CategoryList {
  constructor(categoryService, onEditCategory, onDeleteCategory) {
    this.categoryService = categoryService;
    this.onEditCategory = onEditCategory;
    this.onDeleteCategory = onDeleteCategory;
    this.container = document.getElementById('categories-list');
  }

  async render() {
    try {
      const categories = await this.categoryService.getCategories();
      this.container.innerHTML = this.createCategoriesHtml(categories);
      this.setupEventListeners();
    } catch (error) {
      console.error('Error loading categories:', error);
      this.container.innerHTML = `<p class="error">Error al cargar categorías: ${error.message}</p>`;
    }
  }

  createCategoriesHtml(categories) {
    if (categories.length === 0) {
      return '<p>No hay categorías disponibles.</p>';
    }

    return categories.map(category => `
      <div class="category-card">
        <h4>${category.name}</h4>
        ${category.description ? `<p>${category.description}</p>` : ''}
        <div class="card-actions">
          <button class="btn btn-secondary edit-category" data-id="${category.id}">Editar</button>
          <button class="btn btn-secondary delete-category" data-id="${category.id}">Eliminar</button>
        </div>
      </div>
    `).join('');
  }

  setupEventListeners() {
    this.container.addEventListener('click', (e) => {
      const categoryId = e.target.closest('button')?.dataset?.id;
      if (!categoryId) return;

      if (e.target.classList.contains('edit-category')) {
        this.onEditCategory(categoryId);
      } else if (e.target.classList.contains('delete-category')) {
        this.onDeleteCategory(categoryId);
      }
    });
  }
}

export default CategoryList;