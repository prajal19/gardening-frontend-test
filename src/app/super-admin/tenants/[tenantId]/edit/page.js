'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import apiClient from '../../../../../lib/api/apiClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const EditTenantPage = () => {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;

  const [formData, setFormData] = useState({ name: '', email: '', isActive: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (tenantId) {
      const fetchTenant = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/super-admin/tenants/${tenantId}`);
          const tenantData = response.data.data;
          setFormData({
            name: tenantData.name || '',
            email: tenantData.email || '',
            subdomain: tenantData.subdomain || '',
            plan: tenantData.plan || 'basic',
            status: tenantData.status || 'active',
            address: tenantData.address || '',
            phone: tenantData.phone || '',
            website: tenantData.website || '',
            description: tenantData.description || ''
          });
        } catch (error) {
          console.error('Error fetching tenant:', error);
          setError('Failed to load tenant details');
        } finally {
          setLoading(false);
        }
      };
      fetchTenant();
    }
  }, [tenantId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiClient.put(`/super-admin/tenants/${tenantId}`, formData);
      setSuccess('Tenant updated successfully!');
      setTimeout(() => router.push(`/super-admin/tenants/${tenantId}`), 1500);
    } catch (error) {
      console.error('Error updating tenant:', error);
      setError(error.response?.data?.message || 'Failed to update tenant');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
        <Link href={`/super-admin/tenants/${tenantId}`} className="mb-4 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800">
            <ArrowLeft size={18} className="mr-1" />
            Back to Tenant Details
        </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Tenant: {formData.name}</h1>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tenant Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Contact Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="isActive" className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">Active</span>
          </label>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTenantPage;

