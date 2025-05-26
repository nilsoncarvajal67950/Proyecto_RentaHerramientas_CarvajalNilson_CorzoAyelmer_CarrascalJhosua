class ReservationList {
    constructor(reservationService, onCancelReservation) {
        this.reservationService = reservationService;
        this.onCancelReservation = onCancelReservation;
        this.container = document.getElementById('reservations-container');
        this.allReservations = []; 
    }

    async render() {
        try {
            window.showLoading(true);
            const reservations = await this.reservationService.getReservations();
            this.allReservations = reservations;
            this.container.innerHTML = this.createReservationsHtml(reservations);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading reservations:', error);
            this.container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error al cargar reservas: ${error.message}</p>
                    <button class="btn btn-secondary" id="retry-reservations">Reintentar</button>
                </div>
            `;
            document.getElementById('retry-reservations')?.addEventListener('click', () => this.render());
        } finally {
            window.showLoading(false);
        }
    }

    filterByStatus(status) {
        if (status === 'all') {
            this.container.innerHTML = this.createReservationsHtml(this.allReservations);
        } else {
            const filtered = this.allReservations.filter(res => res.status === status);
            this.container.innerHTML = this.createReservationsHtml(filtered);
        }
        this.setupEventListeners();
    }

    createReservationsHtml(reservations) {
    if (reservations.length === 0) {
        return `
            <div class="empty-state">
                <i class="fas fa-calendar-times fa-3x"></i>
                <h3>No tienes reservas</h3>
                <p>No se encontraron reservas que coincidan con los criterios de búsqueda.</p>
            </div>
        `;
    }

    return reservations.map(reservation => {
        const startDate = new Date(reservation.startDate).toLocaleDateString();
        const endDate = new Date(reservation.endDate).toLocaleDateString();

        let actionsHtml = '';
        if (reservation.status === 'PENDING') {
            actionsHtml += `
                <button class="btn btn-danger cancel-reservation" data-id="${reservation.id}">
                    <i class="fas fa-times"></i> Cancelar
                </button>
            `;
        }

        // Agregar botón de generar factura si está confirmada o completada
        if (reservation.status === 'CONFIRMED' || reservation.status === 'COMPLETED') {
            actionsHtml += `
                <button class="btn btn-success generate-invoice" data-id="${reservation.id}">
                    <i class="fas fa-file-invoice-dollar"></i> Generar Factura
                </button>
            `;
        }

        return `
            <div class="reservation-item">
                <div class="reservation-status status-${reservation.status.toLowerCase()}">
                    ${this.getStatusText(reservation.status)}
                </div>
                <h3>Reserva #${reservation.id}</h3>
                <p><strong>Herramienta:</strong> ID ${reservation.toolId}</p>
                <p><strong>Fecha de inicio:</strong> ${startDate}</p>
                <p><strong>Fecha de fin:</strong> ${endDate}</p>
                <div class="card-actions">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }).join('');
}

    getStatusText(status) {
        switch(status) {
            case 'PENDING': return 'Pendiente';
            case 'CONFIRMED': return 'Confirmada';
            case 'CANCELED': return 'Cancelada';
            case 'COMPLETED': return 'Completada';
            default: return status;
        }
    }

    setupEventListeners() {
    this.container.addEventListener('click', (e) => {
        const btnCancel = e.target.closest('.cancel-reservation');
        if (btnCancel) {
            const reservationId = btnCancel.dataset.id;
            this.onCancelReservation(reservationId);
        }

        const btnInvoice = e.target.closest('.generate-invoice');
        if (btnInvoice) {
            const reservationId = btnInvoice.dataset.id;
            window.open(`/api/payments/receipt/reservation/${reservationId}`, '_blank');
        }
    });
}
}

export default ReservationList;