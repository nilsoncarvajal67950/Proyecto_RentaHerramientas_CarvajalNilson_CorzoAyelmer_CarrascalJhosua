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

      // AÑADE ESTE CÓDIGO DE LOGGING AQUÍ
      console.log("Submitting reservation:", reservationData);
      try {
        const response = await this.reservationService.createReservation(
          reservationData
        );
        console.log("Reservation created:", response);

        this.container.style.display = "none";
        this.onSubmitSuccess();
      } catch (error) {
        console.error("Full error details:", error);
        alert(`Error creating reservation: ${error.message}`);
      }
    });

    this.cancelBtn.addEventListener("click", () => {
      this.container.style.display = "none";
    });
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
