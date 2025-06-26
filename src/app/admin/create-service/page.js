'use client';

import React from 'react';
import CreateServiceForm from '../../../components/admin/CreateServiceForm'; // Or define the form inline

const CreateServicePage = () => {
  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      {/* <h1 className="text-2xl font-bold mb-4">Create New Service</h1> */}
      <CreateServiceForm />
    </div>
  );
};

export default CreateServicePage;
