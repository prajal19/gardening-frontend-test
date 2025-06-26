'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceForm from '@/components/admin/ServiceForm';

const NewServicePage = () => {
  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Service</h1>
        <p className="text-gray-600 mt-1">Add a new service to your landscaping business</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ServiceForm />
      </div>
    </AdminLayout>
  );
};

export default NewServicePage; 