import apiClient from './apiClient';

export const bookingApi = {
  // Booking Management
  createBooking: async (bookingData) => {
    const response = await apiClient.post('/bookings', bookingData);
    return response.data;
  },

  getBooking: async (id) => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await apiClient.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  cancelBooking: async (id, reason) => {
    const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  rescheduleBooking: async (id, newDateTime) => {
    const response = await apiClient.post(`/bookings/${id}/reschedule`, newDateTime);
    return response.data;
  },

  // Availability Management
  getAvailability: async (params) => {
    const response = await apiClient.get('/bookings/availability', { params });
    return response.data;
  },

  checkTimeSlotAvailability: async (date, timeSlot, serviceId) => {
    const response = await apiClient.get('/bookings/check-availability', {
      params: { date, timeSlot, serviceId }
    });
    return response.data;
  },

  // Recurring Bookings
  createRecurringBooking: async (recurringData) => {
    const response = await apiClient.post('/bookings/recurring', recurringData);
    return response.data;
  },

  updateRecurringBooking: async (id, recurringData) => {
    const response = await apiClient.put(`/bookings/recurring/${id}`, recurringData);
    return response.data;
  },

  // Booking Confirmation
  confirmBooking: async (id, confirmationData) => {
    const response = await apiClient.post(`/bookings/${id}/confirm`, confirmationData);
    return response.data;
  },

  // Booking Notifications
  sendBookingReminder: async (id) => {
    const response = await apiClient.post(`/bookings/${id}/reminder`);
    return response.data;
  },

  // Booking Analytics
  getBookingAnalytics: async (dateRange) => {
    const response = await apiClient.get('/bookings/analytics', {
      params: dateRange
    });
    return response.data;
  },

  // Customer Bookings
  getCustomerBookings: async (customerId, params = {}) => {
    const response = await apiClient.get(`/customers/${customerId}/bookings`, { params });
    return response.data;
  },

  // Property Bookings
  getPropertyBookings: async (propertyId, params = {}) => {
    const response = await apiClient.get(`/properties/${propertyId}/bookings`, { params });
    return response.data;
  }
};
