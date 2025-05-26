import Header from "./Header.js";
import AuthService from "../services/AuthService.js";
import Login from "./Auth/Login.js";
import Register from "./Auth/Register.js";
import ApiService from "../services/ApiService.js";
import ToolService from "./Tools/ToolService.js";
import ToolList from "./Tools/ToolList.js";
import ToolForm from "./Tools/ToolForm.js";
import CategoryService from "./Categories/CategoryService.js";
import CategoryList from "./Categories/CategoryList.js";
import CategoryForm from "./Categories/CategoryForm.js";
import ReservationService from "./Reservations/ReservationService.js";
import ReservationList from "./Reservations/ReservationList.js";
import ReservationForm from "./Reservations/ReservationForm.js";
import CustomerService from "./Customers/CustomerService.js";
import CustomerList from "./Customers/CustomerList.js";
import CustomerForm from "./Customers/CustomerForm.js";
import SupplierService from "./Suppliers/SupplierService.js";
import SupplierList from "./Suppliers/SupplierList.js";
import SupplierForm from "./Suppliers/SupplierForm.js";

window.API_BASE_URL = "http://localhost:8080";

class App {
  constructor() {
    // 1. Initialize API and Auth services first
    this.apiService = new ApiService("http://localhost:8080/");
    this.authService = new AuthService();
    
    // 2. Initialize all business services
    this.toolService = new ToolService(this.apiService);
    this.categoryService = new CategoryService(this.apiService);
    this.reservationService = new ReservationService(this.apiService);
    this.customerService = new CustomerService(this.apiService);
    this.supplierService = new SupplierService(this.apiService);

    // 3. Initialize header and auth components
    this.header = new Header(this.authService);
    this.login = new Login(this.authService, this.handleAuthChange.bind(this));
    this.register = new Register(
      this.authService,
      this.handleAuthChange.bind(this),
      this.navigateTo.bind(this)
    );

    // 4. Initialize forms (which depend on services)
    this.toolForm = new ToolForm(
      this.toolService,
      this.categoryService,
      this.supplierService,
      this.handleToolSubmitSuccess.bind(this)
    );

    this.categoryForm = new CategoryForm(
      this.categoryService,
      this.handleCategorySubmitSuccess.bind(this)
    );

    this.supplierForm = new SupplierForm(
      this.supplierService,
      this.handleSupplierSubmitSuccess.bind(this)
    );

    this.customerForm = new CustomerForm(
      this.customerService,
      this.handleCustomerSubmitSuccess.bind(this)
    );

    this.reservationForm = new ReservationForm(
      this.reservationService,
      this.toolService,
      this.handleReservationSubmitSuccess.bind(this)
    );

    // 5. Initialize lists (which depend on forms and services)
    this.toolList = new ToolList(
      this.toolService,
      this.authService,
      this.categoryService,
      this.handleEditTool.bind(this),
      this.handleDeleteTool.bind(this),
      this.handleReserveTool.bind(this)
    );

    this.categoryList = new CategoryList(
      this.categoryService,
      this.handleEditCategory.bind(this),
      this.handleDeleteCategory.bind(this)
    );

    this.supplierList = new SupplierList(
      this.supplierService,
      this.handleEditSupplier.bind(this),
      this.handleDeleteSupplier.bind(this)
    );

    this.customerList = new CustomerList(
      this.customerService,
      this.handleEditCustomer.bind(this),
      this.handleDeleteCustomer.bind(this)
    );

    this.reservationList = new ReservationList(
      this.reservationService,
      this.cancelReservation.bind(this)
    );

    // 6. Initialize the app
    this.init();
  }

  init() {
    this.header.render();
    this.setupPageNavigation();
    this.setupCategoryModal();
    this.setupCustomerModal();
    this.setupDashboardNavigation();
    this.setupReservationFilters();
    this.handleAuthChange();
  }

  setupPageNavigation() {
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = e.target.getAttribute("data-page");
        this.navigateTo(page);
      });
    });
  }

  setupDashboardNavigation() {
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const page = e.target.getAttribute("data-page");
        this.navigateTo(page);
      });
    });
  }

  setupReservationFilters() {
    document.querySelectorAll(".status-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".status-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        const status = e.target.getAttribute("data-status");
        this.reservationList.filterByStatus(status);
      });
    });
  }

  setupCategoryModal() {
    const manageCategoriesBtn = document.getElementById("manage-categories-btn");
    if (manageCategoriesBtn) {
      manageCategoriesBtn.addEventListener("click", () => {
        document.getElementById("categories-modal").style.display = "flex";
        this.categoryList.render();
      });
    }

    const closeModal = document.querySelector(".close-modal");
    if (closeModal) {
      closeModal.addEventListener("click", () => {
        document.getElementById("categories-modal").style.display = "none";
      });
    }

    const addCategoryBtn = document.getElementById("add-category-btn");
    if (addCategoryBtn) {
      addCategoryBtn.addEventListener("click", () => {
        this.categoryForm.openForCreate();
      });
    }
  }

  setupCustomerModal() {
    const addCustomerBtn = document.getElementById("add-customer-btn");
    if (addCustomerBtn) {
      addCustomerBtn.addEventListener("click", () => {
        this.customerForm.openForCreate();
      });
    }
  }

  navigateTo(page) {
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.remove("active"));
    
    const targetPage = document.getElementById(page);
    if (targetPage) {
      targetPage.classList.add("active");
    }

    if (page === "login") {
      this.login.render();
    } else if (page === "registro") {
      this.register.render();
    } else if (page === "tools") {
      this.loadToolsPage();
    } else if (page === "reservations") {
      this.loadReservationsPage();
    } else if (page === "suppliers") {
      this.loadSuppliersPage();
    } else if (page === "customers") {
      this.loadCustomersPage();
    }
  }

  updateMenuVisibility(role) {
    const toolsMenu = document.getElementById("menu-tools");
    const reservationsMenu = document.getElementById("menu-reservations");
    const suppliersMenu = document.getElementById("menu-suppliers");

    if (toolsMenu) toolsMenu.style.display = "block";
    if (reservationsMenu) reservationsMenu.style.display = "block";

    if (role === "CUSTOMER") {
      if (suppliersMenu) suppliersMenu.style.display = "none";
    } else {
      if (suppliersMenu) suppliersMenu.style.display = "block";
    }
  }

  handleAuthChange() {
    const isAuthenticated = this.authService.isAuthenticated();
    this.header.updateAuthState(isAuthenticated);

    if (isAuthenticated) {
      const userRole = this.authService.getUserRole();
      this.updateMenuVisibility(userRole);
      this.navigateTo("home");
    } else {
      this.navigateTo("login");
    }
  }

  loadToolsPage() {
    if (document.getElementById("tools").classList.contains("active")) {
      this.toolList.render();

      const categoryBtn = document.getElementById("manage-categories-btn");
      const addToolBtn = document.getElementById("add-tool-btn");
      const userRole = this.authService.getUserRole();

      if (addToolBtn) {
        addToolBtn.style.display =
          userRole === "ADMIN" || userRole === "SUPPLIER" ? "block" : "none";
        addToolBtn.onclick = () => this.toolForm.openForCreate();
      }
      
      if (categoryBtn) {
        categoryBtn.style.display =
          userRole === "ADMIN" || userRole === "SUPPLIER" ? "block" : "none";
        categoryBtn.onclick = () => {
          document.getElementById("categories-modal").style.display = "flex";
          this.categoryList.render();
        };
      }

      this.categoryService.getCategories().then((categories) => {
        const select = document.getElementById("category-filter");
        if (select) {
          select.innerHTML = '<option value="">Todas las categorías</option>';
          categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.name;
            select.appendChild(option);
          });
        }
      });

      const searchBtn = document.getElementById("search-btn");
      if (searchBtn) {
        searchBtn.addEventListener("click", () => {
          const searchTerm = document.getElementById("tool-search").value;
          const categoryId = document.getElementById("category-filter").value;
          this.toolList.filterTools(searchTerm, categoryId);
        });
      }

      const toolSearch = document.getElementById("tool-search");
      if (toolSearch) {
        toolSearch.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            const searchTerm = e.target.value;
            const categoryId = document.getElementById("category-filter").value;
            this.toolList.filterTools(searchTerm, categoryId);
          }
        });
      }

      const categoryFilter = document.getElementById("category-filter");
      if (categoryFilter) {
        categoryFilter.addEventListener("change", (e) => {
          const categoryId = e.target.value;
          const searchTerm = document.getElementById("tool-search").value;
          this.toolList.filterTools(searchTerm, categoryId);
        });
      }
    }
  }

  loadReservationsPage() {
    if (document.getElementById("reservations").classList.contains("active")) {
      this.reservationList.render();

      const addReservationBtn = document.getElementById("add-reservation-btn");
      if (addReservationBtn) {
        addReservationBtn.style.display =
          this.authService.getUserRole() === "CUSTOMER" ? "flex" : "none";

        addReservationBtn.onclick = () => {
          this.reservationForm.loadTools().then(() => {
            document.getElementById("reservation-form-container").style.display =
              "flex";
          });
        };
      }
    }
  }

  loadSuppliersPage() {
    if (document.getElementById("suppliers").classList.contains("active")) {
      this.supplierList.render();
      const addSupplierBtn = document.getElementById("add-supplier-btn");
      const userRole = this.authService.getUserRole();
      if (addSupplierBtn) {
        addSupplierBtn.style.display = userRole === "ADMIN" ? "block" : "none";
        addSupplierBtn.onclick = () => this.supplierForm.openForCreate();
      }
    }
  }

  loadCustomersPage() {
    if (document.getElementById("customers").classList.contains("active")) {
      this.customerList.render();

      const addCustomerBtn = document.getElementById("add-customer-btn");
      const userRole = this.authService.getUserRole();

      if (addCustomerBtn) {
        addCustomerBtn.style.display = userRole === "ADMIN" ? "block" : "none";
        addCustomerBtn.onclick = () => this.customerForm.openForCreate();
      }
    }
  }

  // Handler methods
  handleEditTool(toolId) {
    this.toolForm.openForEdit(toolId);
  }

  async handleDeleteTool(toolId) {
    try {
      if (
        confirm(
          "¿Estás seguro de que deseas eliminar esta herramienta? Esto también eliminará todas las reservas asociadas."
        )
      ) {
        await this.toolService.deleteTool(toolId);
        window.showToast("Herramienta eliminada correctamente", "success");
        this.toolList.render();
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
      const errorMsg = error.message.includes("viola la llave foránea")
        ? "No se puede eliminar porque tiene reservas asociadas"
        : error.message;
      window.showToast(`Error al eliminar herramienta: ${errorMsg}`, "error");
    }
  }

  handleReserveTool(toolId) {
    this.reservationForm.loadTools().then(() => {
      document.getElementById("reservation-form-container").style.display =
        "flex";
      if (toolId) {
        document.getElementById("reservation-tool").value = toolId;
      }
    });
  }

  handleToolSubmitSuccess() {
    this.toolList.render();
    window.showToast("Herramienta guardada correctamente", "success");
  }

  handleEditCategory(categoryId) {
    this.categoryForm.openForEdit(categoryId);
  }

  async handleDeleteCategory(categoryId) {
    if (confirm("¿Estás seguro de que deseas eliminar esta categoría?")) {
      try {
        await this.categoryService.deleteCategory(categoryId);
        this.categoryList.render();
        this.toolList.render();
        window.showToast("Categoría eliminada correctamente", "success");
      } catch (error) {
        console.error("Error deleting category:", error);
        window.showToast(
          `Error al eliminar categoría: ${error.message}`,
          "error"
        );
      }
    }
  }

  handleCategorySubmitSuccess() {
    this.categoryList.render();
    this.toolList.render();
    window.showToast("Categoría guardada correctamente", "success");
  }

  handleEditSupplier(supplierId) {
    this.supplierForm.openForEdit(supplierId);
  }

  async handleDeleteSupplier(supplierId) {
    if (confirm("¿Estás seguro de eliminar este proveedor?")) {
      try {
        await this.supplierService.deleteSupplier(supplierId);
        window.showToast("Proveedor eliminado correctamente", "success");
        this.supplierList.render();
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        window.showToast(
          `Error al eliminar proveedor: ${error.message}`,
          "error"
        );
      }
    }
  }

  handleSupplierSubmitSuccess() {
    this.supplierList.render();
    window.showToast("Proveedor guardado correctamente", "success");
  }

  handleEditCustomer(customerId) {
    this.customerForm.openForEdit(customerId);
  }

  async handleDeleteCustomer(customerId) {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await this.customerService.deleteCustomer(customerId);
        window.showToast("Usuario eliminado correctamente", "success");
        this.customerList.render();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        window.showToast(
          `Error al eliminar usuario: ${error.message}`,
          "error"
        );
      }
    }
  }

  handleCustomerSubmitSuccess() {
    this.customerList.render();
    window.showToast("Usuario guardado correctamente", "success");
  }

  async cancelReservation(id) {
    try {
      await this.apiService.request(`api/alkile/reservations/${id}/cancel`, {
        method: "PUT",
      });
      window.showToast("Reserva cancelada correctamente", "success");
      this.reservationList.render();
    } catch (error) {
      console.error("Error canceling reservation:", error);
      window.showToast(`Error al cancelar reserva: ${error.message}`, "error");
    }
  }

  handleReservationSubmitSuccess() {
    this.reservationList.render();
    this.toolList.render();
    window.showToast("Reserva creada correctamente", "success");
  }
}

export default App;