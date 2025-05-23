class ReservationService {
  constructor(apiService) {
    this.apiService = apiService;
  }

  async getReservations() {
    return this.apiService.request('api/alkile/reservations');
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