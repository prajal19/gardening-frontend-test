'use client';

import { FaTimes } from 'react-icons/fa';

export default function WorkloadModal({ staff, onClose }) {
  const { workload } = staff;

  if (!workload) {
    return null;
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Workload for {staff.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="space-y-6">
          {/* Current Week Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Current Week Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Appointments</p>
                <p className="text-xl font-semibold">{workload.currentWeek.totalAppointments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-xl font-semibold">{workload.currentWeek.totalHours}</p>
              </div>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Daily Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {days.map(day => (
                <div key={day} className="bg-white border rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{day}</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-600">Appointments</p>
                      <p className="text-lg font-semibold">{workload.workloadByDay[day].count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Hours</p>
                      <p className="text-lg font-semibold">{workload.workloadByDay[day].hours.toFixed(1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="text-sm text-gray-600">
            <p>Week of: {new Date(workload.currentWeek.startDate).toLocaleDateString()} - {new Date(workload.currentWeek.endDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 