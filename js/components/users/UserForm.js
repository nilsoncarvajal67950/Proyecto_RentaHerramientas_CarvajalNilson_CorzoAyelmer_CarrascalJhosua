class UserForm {
  constructor(userService, onSubmitSuccess) {
    this.userService = userService;
    this.onSubmitSuccess = onSubmitSuccess;
    this.form = document.getElementById('user-form');
    this.container = document.getElementById('user-form-container');
    this.title = document.getElementById('user-form-title');
    this.cancelBtn = document.getElementById('cancel-user');
    
    this.setupForm();
  }

  openForCreate() {
    this.container.style.display = 'block';
    this.title.textContent = 'Agregar Usuario';
    this.form.reset();
    document.getElementById('user-id').value = '';
  }

  async openForEdit(userId) {
    try {
      const user = await this.userService.getUserById(userId);
      
      this.title.textContent = 'Editar Usuario';
      document.getElementById('user-id').value = user.id;
      document.getElementById('user-taxId').value = user.taxId;
      document.getElementById('user-company').value = user.company;
      document.getElementById('user-userId').value = user.userId;
      document.getElementById('user-rating').value = user.rating || '';
      
      this.container.style.display = 'block';
    } catch (error) {
      console.error('Error loading user for edit:', error);
      alert(`Error al cargar usuario: ${error.message}`);
    }
  }

  setupForm() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const userData = this.getFormData();
      if (!userData) return;
      
      try {
        const userId = document.getElementById('user-id').value;
        
        if (userId) {
          await this.userService.updateUser(userId, userData);
        } else {
          await this.userService.createUser(userData);
        }
        
        this.container.style.display = 'none';
        this.onSubmitSuccess();
      } catch (error) {
        console.error('Error saving user:', error);
        alert(`Error al guardar usuario: ${error.message}`);
      }
    });

    this.cancelBtn.addEventListener('click', () => {
      this.container.style.display = 'none';
    });
  }

  getFormData() {
    const taxId = document.getElementById('user-taxId').value.trim();
    const company = document.getElementById('user-company').value.trim();
    const userId = document.getElementById('user-userId').value.trim();
    const rating = document.getElementById('user-rating').value.trim();

    if (!taxId || !company || !userId) {
      alert('Tax ID, Company name y User ID son campos requeridos');
      return null;
    }

    return {
      taxId,
      company,
      userId: Number(userId),
      ...(rating && { rating: Number(rating) })
    };
  }
}

export default UserForm;