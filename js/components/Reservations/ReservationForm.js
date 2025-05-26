class ReservationForm {
  constructor(reservationService, toolService, onSubmitSuccess) {
    this.reservationService = reservationService;
    this.toolService = toolService;
    this.onSubmitSuccess = onSubmitSuccess;
    this.form = document.getElementById("reservation-form");
    this.container = document.getElementById("reservation-form-container");
    this.cancelBtn = document.getElementById("cancel-reservation");

    this.setupForm();
    this.setupDateValidation();
  }

  async loadTools() {
    try {
      const tools = await this.toolService.getTools();
      const select = document.getElementById("reservation-tool");
      if (!select) {
        throw new Error("No se encontró el elemento reservation-tool");
      }

      const options = tools
        .filter((tool) => tool.stock > 0)
        .map(
          (tool) => `
                <option value="${tool.id}">
                    ${tool.name} - $${tool.dailyCost.toFixed(2)}/día
                </option>
            `
        )
        .join("");

      select.innerHTML = options;
    } catch (error) {
      console.error("Error loading tools:", error);
      window.showToast(
        `Error al cargar herramientas: ${error.message}`,
        "error"
      );
    }
  }

  setupForm() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const reservationData = this.getFormData();
      if (!reservationData) return;

      try {
        const response = await this.reservationService.createReservation(reservationData);
        
        // Después de crear la reserva, mostrar el botón de factura
        this.showInvoiceButton(response.id);
        
        this.container.style.display = "none";
        this.onSubmitSuccess();
      } catch (error) {
        console.error("Error creating reservation:", error);
        window.showToast(`Error al crear reserva: ${error.message}`, "error");
      }
    });

    this.cancelBtn.addEventListener("click", () => {
      this.container.style.display = "none";
    });
  }

  showInvoiceButton(reservationId) {
    const invoiceBtn = document.createElement('button');
    invoiceBtn.className = 'btn invoice-btn';
    invoiceBtn.innerHTML = '<i class="fas fa-file-invoice-dollar"></i> Factura';
    invoiceBtn.onclick = () => this.downloadInvoice(reservationId);
    
    // Agrega el botón al contenedor de reservas
    document.getElementById('reservations-container').appendChild(invoiceBtn);
  }

  async downloadInvoice(reservationId) {
    try {
      // Llama al endpoint del backend para generar la factura
      const response = await fetch(`/api/payments/receipt/reservation/${reservationId}`);
      
      if (!response.ok) {
        throw new Error('Error al generar la factura');
      }
      
      // Crea un blob con la respuesta y descarga el PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura_reserva_${reservationId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading invoice:', error);
      window.showToast('Error al descargar la factura', 'error');
    }
  }

  setupDateValidation() {
    const startDateInput = document.getElementById("reservation-start-date");
    const endDateInput = document.getElementById("reservation-end-date");

    const today = new Date().toISOString().split("T")[0];
    startDateInput.min = today;
    endDateInput.min = today;

    startDateInput.addEventListener("change", () => {
      endDateInput.min = startDateInput.value;
    });
  }

  getFormData() {
    const toolId = parseInt(document.getElementById("reservation-tool").value);
    const startDateInput = document.getElementById("reservation-start-date").value;
    const endDateInput = document.getElementById("reservation-end-date").value;
    const customerId = parseInt(localStorage.getItem("userId"));

    if (!toolId || !startDateInput || !endDateInput) {
        alert("Por favor complete todos los campos");
        return null;
    }

    const startDate = new Date(startDateInput);
    const endDate = new Date(endDateInput);

    if (startDate > endDate) {
        alert("La fecha de fin debe ser posterior a la fecha de inicio");
        return null;
    }

    return {
        toolId: toolId,
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        customerId: customerId,
        status: "PENDING"
    };
}
}

export default ReservationForm;
