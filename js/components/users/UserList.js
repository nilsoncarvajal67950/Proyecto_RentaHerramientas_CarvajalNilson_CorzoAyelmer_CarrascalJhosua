class UserList {
    constructor(userService, onEditUser, onDeleteUser) {
        this.userService = userService;
        this.onEditUser = onEditUser;
        this.onDeleteUser = onDeleteUser;
        this.container = document.getElementById('users-list');
    }

    async render() {
        this.container.innerHTML = this.createSkeletonLoading();
        
        try {
            const users = await this.userService.getUsers();
            this.container.innerHTML = this.createUsersHtml(users);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading users:', error);
            this.container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar usuarios: ${error.message}</p>
                    <button class="btn btn-secondary" id="retry-users">Reintentar</button>
                </div>
            `;
            document.getElementById('retry-users').addEventListener('click', () => this.render());
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

    createUsersHtml(users) {
        if (users.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-truck fa-3x"></i>
                    <h3>No hay usuarios disponibles</h3>
                    <p>Aún no se han registrado usuarios en el sistema.</p>
                </div>
            `;
        }

        return users.map(user => `
            <div class="card user-card">
                <h3>${user.name}</h3>
                ${user.description ? `<p class="user-description">${user.description}</p>` : ''}
                <div class="user-details">
                    ${user.email ? `<p><i class="fas fa-envelope"></i> ${user.email}</p>` : ''}
                    ${user.phone ? `<p><i class="fas fa-phone"></i> ${user.phone}</p>` : ''}
                    ${user.address ? `<p><i class="fas fa-map-marker-alt"></i> ${user.address}</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary edit-user" data-id="${user.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-danger delete-user" data-id="${user.id}">
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

            const userId = btn.dataset.id;
            if (btn.classList.contains('edit-user')) {
                this.onEditUser(userId);
            } else if (btn.classList.contains('delete-user')) {
                if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
                    this.onDeleteUser(userId);
                }
            }
        });
    }
}

export default UserList;