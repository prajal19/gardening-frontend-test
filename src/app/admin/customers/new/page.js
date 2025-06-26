// app/admin/customers/new/page.js
'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import CreateCustomerForm from '@/components/admin/CreateCustomerForm';

const NewCustomerPage = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Customer</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the customer details below. An email will be sent to the customer to set their password.
        </p>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <CreateCustomerForm />
      </div>
    </AdminLayout>
  );
};

export default NewCustomerPage;