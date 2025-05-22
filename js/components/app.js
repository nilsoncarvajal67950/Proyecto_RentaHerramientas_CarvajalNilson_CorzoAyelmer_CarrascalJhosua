
import Header from './Header.js';
import AuthService from '../services/AuthService.js';
import Login from './Auth/Login.js';
import ApiService from '../services/ApiService.js';
import ToolService from './Tools/ToolService.js';
import ToolList from './Tools/ToolList.js';
import ToolForm from './Tools/ToolForm.js';
import CategoryService from './Categories/CategoryService.js';
import CategoryList from './Categories/CategoryList.js';
import CategoryForm from './Categories/CategoryForm.js';
import ReservationService from './Reservations/ReservationService.js';
import ReservationList from './Reservations/ReservationList.js';
import ReservationForm from './Reservations/ReservationForm.js';
import SupplierService from './Suppliers/SupplierService.js';
import SupplierList from './Suppliers/SupplierList.js';
import SupplierForm from './Suppliers/SupplierForm.js';

class App {
  constructor() {
    this.apiService = new ApiService('http://localhost:8080/api');
    this.authService = new AuthService();
    this.toolService = new ToolService(this.apiService);
    this.categoryService = new CategoryService(this.apiService);
    this.reservationService = new ReservationService(this.apiService);
    this.supplierService = new SupplierService(this.apiService);


    this.header = new Header(this.authService);
    this.login = new Login(this.authService, this.handleAuthChange.bind(this));


    this.toolList = new ToolList(
      this.toolService,
      this.authService,
      this.categoryService,
      this.handleEditTool.bind(this),
      this.handleDeleteTool.bind(this),
      this.handleReserveTool.bind(this)
    );
    this.toolForm = new ToolForm(
      this.toolService,
      this.categoryService,
      this.supplierService,
      this.handleToolSubmitSuccess.bind(this)
    );


    this.categoryList = new CategoryList(
      this.categoryService,
      this.handleEditCategory.bind(this),
      this.handleDeleteCategory.bind(this)
    );
    this.categoryForm = new CategoryForm(
      this.categoryService,
      this.handleCategorySubmitSuccess.bind(this)
    );


    this.supplierList = new SupplierList(
      this.supplierService,
      this.handleEditSupplier.bind(this),
      this.handleDeleteSupplier.bind(this)
    );
    this.supplierForm = new SupplierForm(
      this.supplierService,
      this.handleSupplierSubmitSuccess.bind(this)
    );


    this.reservationList = new ReservationList(
      this.reservationService,
      this.cancelReservation.bind(this)
    );
    this.reservationForm = new ReservationForm(
      this.reservationService,
      this.toolService,
      this.handleReservationSubmitSuccess.bind(this)
    );

    this.init();
  }

  init() {
    this.header.render();
    this.setupPageNavigation();
    this.setupCategoryModal();
    this.setupSupplierModal();
    this.setupDashboardNavigation();
    this.setupReservationFilters();
    this.handleAuthChange();
  }

  setupPageNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = e.target.getAttribute('data-page');
        this.navigateTo(page);
      });
    });
  }

  setupDashboardNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.target.getAttribute('data-page');
        this.navigateTo(page);
      });
    });
  }

  setupReservationFilters() {
    document.querySelectorAll('.status-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.status-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        const status = e.target.getAttribute('data-status');
        this.reservationList.filterByStatus(status);
      });
    });
  }

  setupCategoryModal() {
    document.getElementById('manage-categories-btn')?.addEventListener('click', () => {
      document.getElementById('categories-modal').style.display = 'flex';
      this.categoryList.render();
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
      document.getElementById('categories-modal').style.display = 'none';
    });

    document.getElementById('add-category-btn').addEventListener('click', () => {
      this.categoryForm.openForCreate();
    });
  }

  setupSupplierModal() {
    document.getElementById('add-supplier-btn')?.addEventListener('click', () => {
      this.supplierForm.openForCreate();
    });
  }

  navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page).classList.add('active');

    if (page === 'login') {
      this.login.render();
    } else if (page === 'tools') {
      this.loadToolsPage();
    } else if (page === 'reservations') {
      this.loadReservationsPage();
    } else if (page === 'suppliers') {
      this.loadSuppliersPage();
    }
  }

  handleAuthChange() {
    const isAuthenticated = this.authService.isAuthenticated();
    this.header.updateAuthState(isAuthenticated);

    if (isAuthenticated) {
      this.loadToolsPage();
      this.loadReservationsPage();
      this.loadSuppliersPage();
      this.navigateTo('home');


      const userRole = this.authService.getUserRole();
      document.getElementById('manage-categories-btn').style.display =
        (userRole === 'ADMIN') ? 'block' : 'none';
    } else {
      this.navigateTo('login');
    }
  }

  loadToolsPage() {
    if (document.getElementById('tools').classList.contains('active')) {
      this.toolList.render();

      const addToolBtn = document.getElementById('add-tool-btn');
      const userRole = this.authService.getUserRole();

      addToolBtn.style.display = (userRole === 'ADMIN' || userRole === 'SUPPLIER')
        ? 'block'
        : 'none';

      addToolBtn.onclick = () => this.toolForm.openForCreate();


      this.categoryService.getCategories().then(categories => {
        const select = document.getElementById('category-filter');
        select.innerHTML = '<option value="">Todas las categorías</option>';

        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id;
          option.textContent = category.name;
          select.appendChild(option);
        });
      });


      document.getElementById('search-btn').addEventListener('click', () => {
        const searchTerm = document.getElementById('tool-search').value;
        const categoryId = document.getElementById('category-filter').value;
        this.toolList.filterTools(searchTerm, categoryId);
      });

      document.getElementById('tool-search').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const searchTerm = e.target.value;
          const categoryId = document.getElementById('category-filter').value;
          this.toolList.filterTools(searchTerm, categoryId);
        }
      });

      document.getElementById('category-filter').addEventListener('change', (e) => {
        const categoryId = e.target.value;
        const searchTerm = document.getElementById('tool-search').value;
        this.toolList.filterTools(searchTerm, categoryId);
      });
    }
  }

  loadReservationsPage() {
    if (document.getElementById('reservations').classList.contains('active')) {
      this.reservationList.render();

      const addReservationBtn = document.getElementById('add-reservation-btn');
      addReservationBtn.style.display = this.authService.getUserRole() === 'CUSTOMER'
        ? 'flex'
        : 'none';

      addReservationBtn.onclick = () => {
        this.reservationForm.loadTools().then(() => {
          document.getElementById('reservation-form-container').style.display = 'flex';
        });
      };
    }
  }

  loadSuppliersPage() {
    if (document.getElementById('suppliers').classList.contains('active')) {
      this.supplierList.render();

      const addSupplierBtn = document.getElementById('add-supplier-btn');
      const userRole = this.authService.getUserRole();

      addSupplierBtn.style.display = (userRole === 'ADMIN')
        ? 'block'
        : 'none';
    }
  }

  handleEditTool(toolId) {
    this.toolForm.openForEdit(toolId);
  }

  async handleDeleteTool(toolId) {
    try {
        if (confirm("¿Estás seguro de que deseas eliminar esta herramienta? Esto también eliminará todas las reservas asociadas.")) {
            await this.toolService.deleteTool(toolId);
            window.showToast("Herramienta eliminada correctamente", "success");
            this.toolList.render();
        }
    } catch (error) {
        console.error("Error deleting tool:", error);
        const errorMsg = error.message.includes('viola la llave foránea') 
            ? "No se puede eliminar porque tiene reservas asociadas" 
            : error.message;
        window.showToast(`Error al eliminar herramienta: ${errorMsg}`, "error");
    }
}

  handleReserveTool(toolId) {
    this.navigateTo('reservations');
    this.reservationForm.loadTools().then(() => {
      document.getElementById('reservation-tool').value = toolId;
      document.getElementById('reservation-form-container').style.display = 'flex';
    });
  }

  handleToolSubmitSuccess() {
    this.toolList.render();
    window.showToast('Herramienta guardada correctamente', 'success');
  }


  handleEditCategory(categoryId) {
    this.categoryForm.openForEdit(categoryId);
  }

  async handleDeleteCategory(categoryId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await this.categoryService.deleteCategory(categoryId);
        this.categoryList.render();
        this.toolList.render();
        window.showToast('Categoría eliminada correctamente', 'success');
      } catch (error) {
        console.error('Error deleting category:', error);
        window.showToast(`Error al eliminar categoría: ${error.message}`, 'error');
      }
    }
  }

  handleCategorySubmitSuccess() {
    this.categoryList.render();
    this.toolList.render();
    window.showToast('Categoría guardada correctamente', 'success');
  }


  handleEditSupplier(supplierId) {
    this.supplierForm.openForEdit(supplierId);
  }

  async handleDeleteSupplier(supplierId) {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      try {
        await this.supplierService.deleteSupplier(supplierId);
        this.supplierList.render();
        window.showToast('Proveedor eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error deleting supplier:', error);
        window.showToast(`Error al eliminar proveedor: ${error.message}`, 'error');
      }
    }
  }

  handleSupplierSubmitSuccess() {
    this.supplierList.render();
    window.showToast('Proveedor guardado correctamente', 'success');
  }


  async cancelReservation(id) {
    return this.apiService.request(`/alkile/reservations/${id}/cancel`, {
        method: 'PUT'
    });
}

  handleReservationSubmitSuccess() {
    this.reservationList.render();
    this.toolList.render();
    window.showToast('Reserva creada correctamente', 'success');
  }
}

export default App;