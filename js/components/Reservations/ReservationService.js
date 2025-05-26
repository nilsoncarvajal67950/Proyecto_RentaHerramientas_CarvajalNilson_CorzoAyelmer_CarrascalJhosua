class ReservationService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getReservations() {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    return this.apiService.request("api/alkile/reservations", {
        method: "GET",
        headers: {
            "userId": userId,
            "role": role,
            "Content-Type": "application/json"
        }
    });
}

 async createReservation(reservationData) {
    return this.apiService.request('api/alkile/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData) // Send exactly what we formatted
    });
}

  async cancelReservation(id) {
    return this.apiService.request(`api/alkile/reservations/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ status: "CANCELED" }),
    });
  }
}

export default ReservationService;
