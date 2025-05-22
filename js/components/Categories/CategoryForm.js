class CategoryForm {
  constructor(categoryService, onSubmitSuccess) {
    this.categoryService = categoryService;
    this.onSubmitSuccess = onSubmitSuccess;
    this.form = document.getElementById('category-form');
    this.container = document.getElementById('category-form-container');
    this.title = document.getElementById('category-form-title');
    this.cancelBtn = document.getElementById('cancel-category');
    
    this.setupForm();
  }

  openForCreate() {
    this.title.textContent = 'Agregar Nueva Categoría';
    document.getElementById('category-id').value = '';
    this.form.reset();
    this.container.style.display = 'block';
  }

  async openForEdit(categoryId) {
    try {
      const category = await this.categoryService.getCategoryById(categoryId);
      
      this.title.textContent = 'Editar Categoría';
      document.getElementById('category-id').value = category.id;
      document.getElementById('category-name').value = category.name;
      document.getElementById('category-description').value = category.description || '';
      
      this.container.style.display = 'block';
    } catch (error) {
      console.error('Error loading category for edit:', error);
      alert(`Error al cargar categoría: ${error.message}`);
    }
  }

  setupForm() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const categoryData = this.getFormData();
      if (!categoryData) return;
      
      try {
        const categoryId = document.getElementById('category-id').value;
        
        if (categoryId) {
          await this.categoryService.updateCategory(categoryId, categoryData);
        } else {
          await this.categoryService.createCategory(categoryData);
        }
        
        this.container.style.display = 'none';
        this.onSubmitSuccess();
      } catch (error) {
        console.error('Error saving category:', error);
        alert(`Error al guardar categoría: ${error.message}`);
      }
    });

    this.cancelBtn.addEventListener('click', () => {
      this.container.style.display = 'none';
    });
  }

  getFormData() {
    const categoryId = document.getElementById('category-id').value;
    const name = document.getElementById('category-name').value.trim();
    const description = document.getElementById('category-description').value.trim();

    if (!name) {
      alert('El nombre de la categoría es requerido');
      return null;
    }

    return {
      ...(categoryId && { id: categoryId }),
      name,
      description
    };
  }
}

export default CategoryForm;