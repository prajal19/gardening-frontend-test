"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDashboard } from "@/contexts/DashboardContext";
import AdminLayout from "../../../components/admin/AdminLayout";

const EstimatesTable = () => {
  const { userData } = useDashboard();
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingEstimate, setEditingEstimate] = useState(null);
  const [viewingEstimate, setViewingEstimate] = useState(null);
  const [availableServices, setAvailableServices] = useState([]);
  const [formData, setFormData] = useState({
    services: [],
    budget: { min: 0, max: 0 },
    status: "pending",
    notes: ""
  });

  // Fetch estimates AND services from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch estimates
        const estimatesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/estimates`,
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        setEstimates(estimatesResponse.data.data);

        // Fetch services
        const servicesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/services`,
          {
            headers: {
              Authorization: `Bearer ${userData?.token}`,
            },
          }
        );
        setAvailableServices(servicesResponse.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.token) {
      fetchData();
    }
  }, [userData]);

  const handleEdit = (estimate) => {
    setEditingEstimate(estimate);
    setFormData({
      services: estimate.services.map(service => ({
        service: service.service || { name: "", price: 0 },
        price: service.price || 0,
        quantity: service.quantity || 1
      })),
      status: estimate.status || "pending",
      notes: estimate.notes || "",
      budget: estimate.budget || { min: 0, max: 0 }
    });
  };

  const handleBudgetChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      budget: {
        ...prev.budget,
        [field]: Number(value)
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    setFormData(prev => {
      const updatedServices = [...prev.services];
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: field === "price" || field === "quantity" ? Number(value) : value
      };
      return { ...prev, services: updatedServices };
    });
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [
        ...prev.services,
        { service: { name: "", price: 0 }, price: 0, quantity: 1 }
      ]
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        services: formData.services.map(service => ({
          service: {
            _id: service.service._id,
            name: service.service.name
          },
          price: service.price,
          quantity: service.quantity
        })),
        status: formData.status,
        notes: formData.notes,
        budget: formData.budget
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/estimates/${editingEstimate._id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      const updatedEstimate = {
        ...response.data.data,
        customer: editingEstimate.customer
      };

      setEstimates(prev => 
        prev.map(est => 
          est._id === editingEstimate._id ? updatedEstimate : est
        )
      );
      
      setEditingEstimate(null);
    } catch (error) {
      console.error("Error updating estimate:", error);
      alert("Failed to update estimate. Please check console for details.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Estimates Management</h1>
        </div>
        
        {/* Estimates Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-green-600">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estimate #</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Services</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Budget Range</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estimates.map((estimate) => (
                  <tr key={estimate._id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{estimate.estimateNumber || estimate._id.substring(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-medium">
                            {estimate.customer?.user?.name?.charAt(0) || 'C'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{estimate.customer?.user?.name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{estimate.customer?.user?.email || "N/A"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {estimate.services?.length || 0} services
                      </div>
                      {/* <div className="text-sm text-gray-500">
                        ${estimate.services?.reduce((total, service) => total + (service.price || 0) * (service.quantity || 1), 0)?.toFixed(2) || "0.00"}
                      </div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {estimate.budget ? `$${estimate.budget.min} - $${estimate.budget.max}` : "Not specified"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
  // estimate.status === "Requested" ? "bg-blue-100 text-blue-800" :
  estimate.status === "In Review" ? "bg-yellow-100 text-yellow-800" :
  estimate.status === "Prepared" ? "bg-indigo-100 text-indigo-800" :
  estimate.status === "Sent" ? "bg-purple-100 text-purple-800" :
  estimate.status === "Approved" ? "bg-green-100 text-green-800" :
  estimate.status === "Declined" ? "bg-red-100 text-red-800" :
  estimate.status === "Expired" ? "bg-gray-100 text-gray-800" :
  "bg-gray-200 text-gray-700"
}`}>
  {estimate.status}
</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setViewingEstimate(estimate)}
                        className="text-green-600 hover:text-green-900 mr-4"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEdit(estimate)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* View Modal */}
        {viewingEstimate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold text-gray-900">
                  Estimate Details #{viewingEstimate.estimateNumber || viewingEstimate._id.substring(0, 8)}
                </h2>
                <button 
                  onClick={() => setViewingEstimate(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-800 mb-3">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-gray-900">{viewingEstimate.customer?.user?.name || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-900">{viewingEstimate.customer?.user?.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-900">{viewingEstimate.customer?.phone || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-green-800 mb-3">Estimate Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date Created</p>
                        <p className="text-gray-900">{formatDate(viewingEstimate.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          viewingEstimate.status === "approved" ? "bg-green-100 text-green-800" :
                          viewingEstimate.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {viewingEstimate.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Budget Range</p>
                        <p className="text-gray-900">
                          {viewingEstimate.budget ? `$${viewingEstimate.budget.min} - $${viewingEstimate.budget.max}` : "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photos Section */}
                {viewingEstimate.photos?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-green-800 mb-3">Property Photos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {viewingEstimate.photos.map((photo, index) => (
                        <div key={photo._id || index} className="relative group rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={photo.url}
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                          />
                          {photo.caption && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                              {photo.caption}
                            </div>
                          )}
                          <a 
                            href={photo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black bg-opacity-30 transition-opacity"
                            title="View full size"
                          >
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Services</h3>
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-green-600">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Service</th>
                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Unit Price</th> */}
                          <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Quantity</th>
                          {/* <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Total</th> */}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {viewingEstimate.services?.map((service, index) => (
                          <tr key={index} className="hover:bg-green-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {service.service?.name || "N/A"}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${service.service?.basePrice|| "0.00"}
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {service.quantity || 1}
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              ${((service.price || 0) * (service.quantity || 1)).toFixed(2)}
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                      {/* <tfoot className="bg-green-50">
                        <tr>
                          <td colSpan="3" className="px-6 py-4 text-right text-sm font-medium text-gray-700">Subtotal</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                            ${viewingEstimate.services?.reduce((total, service) => total + (service.price || 0) * (service.quantity || 1), 0)?.toFixed(2) || "0.00"}
                          </td>
                        </tr>
                      </tfoot> */}
                    </table>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-green-800 mb-2">Notes</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    {viewingEstimate.notes || "No notes available"}
                  </div>
                </div>

                <div className="flex justify-end border-t pt-4">
                  <button
                    onClick={() => setViewingEstimate(null)}
                    className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Close Estimate
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingEstimate && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center border-b px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Edit Estimate #{editingEstimate._id.substring(0, 8)}
                </h2>
                <button 
                  onClick={() => setEditingEstimate(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                {/* Customer Information */}
                <div className="mb-6 bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingEstimate.customer?.user?.name || "N/A"}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                      <input
                        type="text"
                        value={editingEstimate.customer?.user?.email || "N/A"}
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md cursor-not-allowed"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Services Section */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium text-green-800">Services</h3>
                    <button
                      type="button"
                      onClick={addService}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                    >
                      + Add Service
                    </button>
                  </div>
                  
                  {formData.services.map((service, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-200 rounded-lg relative bg-white">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                        <select
                          value={service.service?._id || ""}
                          onChange={(e) => {
                            const selectedService = availableServices.find(s => s._id === e.target.value);
                            handleServiceChange(index, "service", {
                              _id: selectedService?._id,
                              name: selectedService?.name,
                              price: selectedService?.price || 0
                            });
                            if (selectedService) {
                              handleServiceChange(index, "price", selectedService.price || 0);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          required
                        >
                          <option value="">Select a service</option>
                          {availableServices.map((serviceOption) => (
                            <option key={serviceOption._id} value={serviceOption._id}>
                              {serviceOption.name} (${serviceOption.price})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                        <input
                          type="number"
                          value={service.price || 0}
                          onChange={(e) => handleServiceChange(index, "price", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Price"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={service.quantity || 1}
                          onChange={(e) => handleServiceChange(index, "quantity", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Quantity"
                          min="1"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeService(index)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors w-full"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Budget Section */}
                <div className="mb-6 bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-green-800 mb-3">Budget Range</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum ($)</label>
                      <input
                        type="number"
                        value={formData.budget?.min || 0}
                        onChange={(e) => handleBudgetChange("min", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Minimum budget"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maximum ($)</label>
                      <input
                        type="number"
                        value={formData.budget?.max || 0}
                        onChange={(e) => handleBudgetChange("max", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Maximum budget"
                        min={formData.budget?.min || 0}
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Status and Notes */}
               {/* Status and Notes */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
    <select
      name="status"
      value={formData.status}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      required
    >
      <option value="In Review">In Review</option>
      <option value="Prepared">Prepared</option>
      <option value="Sent">Sent</option>
      <option value="Approved">Approved</option>
      <option value="Declined">Declined</option>
      <option value="Expired">Expired</option>
    </select>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
    <textarea
      name="notes"
      value={formData.notes}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      rows="3"
      placeholder="Add any additional notes here..."
    />
  </div>
</div>

                <div className="flex justify-end space-x-3 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingEstimate(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default EstimatesTable;