import { create } from 'zustand';
import { services, appointments, estimates } from './data/mockData';

const useStore = create((set) => ({
  // Services
  services: services,

  createService: (service) =>
    set((state) => ({
      services: [
        ...state.services,
        {
          id: Math.max(0, ...state.services.map(s => s.id)) + 1,
          ...service
        }
      ]
    })),

  updateService: (id, updatedData) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === id ? { ...service, ...updatedData } : service
      )
    })),

  deleteService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id)
    })),

  // Appointments
  appointments: appointments,

  createAppointment: (appointment) =>
    set((state) => ({
      appointments: [
        ...state.appointments,
        {
          id: Math.max(0, ...state.appointments.map(a => a.id)) + 1,
          status: 'pending-estimate',
          ...appointment
        }
      ]
    })),

  updateAppointment: (id, updatedData) =>
    set((state) => ({
      appointments: state.appointments.map((appointment) =>
        appointment.id === id ? { ...appointment, ...updatedData } : appointment
      )
    })),

  // Estimates
  estimates: estimates,

  createEstimate: (estimate) =>
    set((state) => ({
      estimates: [
        ...state.estimates,
        {
          id: Math.max(0, ...state.estimates.map(e => e.id)) + 1,
          status: 'pending',
          createdAt: new Date().toISOString().split('T')[0],
          expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          ...estimate
        }
      ]
    })),

  updateEstimate: (id, updatedData) =>
    set((state) => ({
      estimates: state.estimates.map((estimate) =>
        estimate.id === id ? { ...estimate, ...updatedData } : estimate
      )
    })),

  // Current Booking (multi-step form data)
  currentBooking: {
    serviceId: null,
    selectedService: null,
    appointmentDate: null,
    startTime: null,
    endTime: null,
    frequency: 'one-time',
    customerId: null,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    notes: '',
    photos: []
  },

  updateCurrentBooking: (data) =>
    set((state) => ({
      currentBooking: { ...state.currentBooking, ...data }
    })),

  resetCurrentBooking: () =>
    set({
      currentBooking: {
        serviceId: null,
        selectedService: null,
        appointmentDate: null,
        startTime: null,
        endTime: null,
        frequency: 'one-time',
        customerId: null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        notes: '',
        photos: []
      }
    })
}));

export default useStore;
