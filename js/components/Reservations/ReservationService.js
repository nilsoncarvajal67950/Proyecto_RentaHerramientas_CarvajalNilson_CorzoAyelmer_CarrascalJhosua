class ReservationService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getReservations() {
    const role = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    return this.apiService.request('/alkile/reservations', {
        method: "GET",
        headers: {
            "userId": userId,
            "role": role
        }
    });
}


  async createReservation(reservationData) {
    return this.apiService.request('api/alkile/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  }

  async cancelReservation(id) {
    return this.apiService.request(`/apiapi/alkile/reservations/${id}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'CANCELED' })
    });
  }
}

export default ReservationService;