'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Button from '../../../../components/ui/Button';
import { useDashboard } from '@/contexts/DashboardContext';
import { toast } from 'react-toastify';

const NewAppointmentPage = () => {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { userData } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  const [formData, setFormData] = useState({
    customer: '',
    service: '',
    packageType: 'Standard',
    date: '',
    timeSlot: {
      startTime: '',
      endTime: ''
    },
    duration: 60,
    status: 'Scheduled',
    recurringType: 'One-time',
    crew: {
      assignedTo: [],
      leadProfessional: ''
    },
    notes: {
      customer: '',
      professional: '',
      internal: ''
    },
    payment: {
      status: 'Pending',
      amount: '',
      paymentMethod: 'Credit Card'
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesRes = await axios.get(`${API_URL}/services`, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        setServices(servicesRes.data);

        // Fetch customers
        const customersRes = await axios.get(`${API_URL}/customers`, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        setCustomers(customersRes.data);

        // Fetch professionals
        const professionalsRes = await axios.get(`${API_URL}/professionals`, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        setProfessionals(professionalsRes.data);
      } catch (error) {
        toast.error('Failed to load data');
      }
    };

    if (userData?.token) {
      fetchData();
    }
  }, [userData]);

  const handleServiceChange = async (serviceId) => {
    setFormData(prev => ({ ...prev, service: serviceId }));
    if (formData.date) {
      try {
        const response = await axios.get(
          `${API_URL}/appointments/availability?date=${formData.date}&serviceId=${serviceId}`,
          {
            headers: { Authorization: `Bearer ${userData.token}` }
          }
        );
        setAvailableTimeSlots(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch available time slots');
      }
    }
  };

  const handleDateChange = async (date) => {
    setFormData(prev => ({ ...prev, date }));
    if (formData.service) {
      try {
        const response = await axios.get(
          `${API_URL}/appointments/availability?date=${date}&serviceId=${formData.service}`,
          {
            headers: { Authorization: `Bearer ${userData.token}` }
          }
        );
        setAvailableTimeSlots(response.data.data);
      } catch (error) {
        toast.error('Failed to fetch available time slots');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API_URL}/appointments`,
        formData,
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      );
      toast.success('Appointment created successfully');
      router.push('/admin/appointments');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Appointment</h1>
          <p className="text-gray-600 mt-1">Schedule a new service appointment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          {/* Customer Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer</label>
            <select
              value={formData.customer}
              onChange={(e) => setFormData(prev => ({ ...prev, customer: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                <option key={customer._id} value={customer._id}>
                  {customer.user.name} - {customer.address?.street}
                </option>
              ))}
            </select>
          </div>

          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Service</label>
            <select
              value={formData.service}
              onChange={(e) => handleServiceChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select a service</option>
              {services.map(service => (
                <option key={service._id} value={service._id}>
                  {service.name} - ${service.price}
                </option>
              ))}
            </select>
          </div>

          {/* Package Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Package Type</label>
            <select
              value={formData.packageType}
              onChange={(e) => setFormData(prev => ({ ...prev, packageType: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
          </div>

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Available Time Slots</label>
            <select
              value={formData.timeSlot.startTime}
              onChange={(e) => {
                const [startTime, endTime] = e.target.value.split('-');
                setFormData(prev => ({
                  ...prev,
                  timeSlot: { startTime, endTime }
                }));
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            >
              <option value="">Select a time slot</option>
              {availableTimeSlots.map((slot, index) => (
                <option key={index} value={`${slot.start}-${slot.end}`}>
                  {slot.start} - {slot.end}
                </option>
              ))}
            </select>
          </div>

          {/* Recurring Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Recurring Type</label>
            <select
              value={formData.recurringType}
              onChange={(e) => setFormData(prev => ({ ...prev, recurringType: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="One-time">One-time</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Annually">Annually</option>
            </select>
          </div>

          {/* Crew Assignment */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Lead Professional</label>
            <select
              value={formData.crew.leadProfessional}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                crew: { ...prev.crew, leadProfessional: e.target.value }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="">Select lead professional</option>
              {professionals.map(professional => (
                <option key={professional._id} value={professional._id}>
                  {professional.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Team Members</label>
            <select
              multiple
              value={formData.crew.assignedTo}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                crew: {
                  ...prev.crew,
                  assignedTo: Array.from(e.target.selectedOptions, option => option.value)
                }
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              {professionals.map(professional => (
                <option key={professional._id} value={professional._id}>
                  {professional.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer Notes</label>
              <textarea
                value={formData.notes.customer}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notes: { ...prev.notes, customer: e.target.value }
                }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Professional Notes</label>
              <textarea
                value={formData.notes.professional}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notes: { ...prev.notes, professional: e.target.value }
                }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Internal Notes</label>
              <textarea
                value={formData.notes.internal}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  notes: { ...prev.notes, internal: e.target.value }
                }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                value={formData.payment.status}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  payment: { ...prev.payment, status: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={formData.payment.amount}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  payment: { ...prev.payment, amount: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              <select
                value={formData.payment.paymentMethod}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  payment: { ...prev.payment, paymentMethod: e.target.value }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Cash">Cash</option>
                <option value="Check">Check</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Appointment'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default NewAppointmentPage; 