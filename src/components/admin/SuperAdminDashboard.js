'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '../../lib/api/apiClient';
import { useDashboard } from '../../contexts/DashboardContext';

const SuperAdminDashboard = () => {
  const { userData } = useDashboard();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/super-admin/tenants');
        setTenants(response.data.data || []);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setError('Failed to load tenants');
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleDeleteTenant = async (tenantId) => {
    if (!confirm('Are you sure you want to delete this tenant? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.delete(`/super-admin/tenants/${tenantId}`);
      setTenants(tenants.filter(tenant => tenant._id !== tenantId));
      setSuccess('Tenant deleted successfully');
    } catch (error) {
      console.error('Error deleting tenant:', error);
      setError('Failed to delete tenant');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      <p className="mb-6">Welcome, {userData?.name}! Here you can manage all tenants.</p>

      <div className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">All Tenants ({tenants.length})</h2>
        <Link href="/super-admin/tenants/new" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Create New Tenant
        </Link>
      </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Tenant Name</th>
                <th className="w-1/3 text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {tenants.map((tenant) => (
                <tr key={tenant._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-4">{tenant.name}</td>
                  <td className="py-3 px-4">{tenant.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        tenant.isActive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                                    <td className="py-3 px-4">
                    <div className="flex items-center space-x-4">
                      <Link href={`/super-admin/tenants/${tenant._id}`} className="text-indigo-600 hover:text-indigo-900">
                        View Details
                      </Link>
                      <button
                        onClick={() => handleDeleteTenant(tenant._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
