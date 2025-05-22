class ReservationService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getReservations() {
    return this.apiService.request('/alkile/reservations');
  }

  async createReservation(reservationData) {
    return this.apiService.request('/alkile/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData)
    });
  }

  async cancelReservation(id) {
    return this.apiService.request(`/alkile/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'CANCELED' })
    });
  }
}

export default ReservationService;