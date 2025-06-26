'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const RecurringAppointmentModal = ({ appointment, onClose, onUpdate }) => {
  const [recurringDetails, setRecurringDetails] = useState({
    frequency: appointment.recurringDetails?.frequency || 'weekly',
    interval: appointment.recurringDetails?.interval || 1,
    endDate: appointment.recurringDetails?.endDate || '',
    daysOfWeek: appointment.recurringDetails?.daysOfWeek || [],
    occurrences: appointment.recurringDetails?.occurrences || 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/appointments/${appointment.id}/recurring`,
        recurringDetails,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      toast.success('Recurring appointment settings updated successfully');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update recurring appointment settings');
    }
  };

  const handleDayToggle = (day) => {
    setRecurringDetails(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recurring Appointment Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Frequency</label>
            <select
              value={recurringDetails.frequency}
              onChange={(e) => setRecurringDetails(prev => ({ ...prev, frequency: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Interval</label>
            <input
              type="number"
              min="1"
              value={recurringDetails.interval}
              onChange={(e) => setRecurringDetails(prev => ({ ...prev, interval: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {recurringDetails.frequency === 'weekly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week</label>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(index)}
                    className={`p-2 rounded-md text-sm font-medium ${
                      recurringDetails.daysOfWeek.includes(index)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              value={recurringDetails.endDate}
              onChange={(e) => setRecurringDetails(prev => ({ ...prev, endDate: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Occurrences</label>
            <input
              type="number"
              min="0"
              value={recurringDetails.occurrences}
              onChange={(e) => setRecurringDetails(prev => ({ ...prev, occurrences: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <p className="mt-1 text-sm text-gray-500">Set to 0 for unlimited occurrences</p>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecurringAppointmentModal; 