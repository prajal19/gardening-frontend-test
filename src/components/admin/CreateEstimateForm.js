"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useStore from '../../lib/store';
import axios from 'axios';
import { useDashboard } from '../../contexts/DashboardContext';
import { useTenant } from '../../contexts/TenantContext';

const CreateEstimateForm = ({ appointmentId }) => {
  const router = useRouter();
  const { appointments } = useStore();
  const { userData } = useDashboard();
  const { tenant } = useTenant();
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const appointment = appointmentId
    ? appointments.find(app => app.id === parseInt(appointmentId))
    : null;

  const [formData, setFormData] = useState({
    appointmentId: appointment?.id || '',
    services: [],
    property: {
      address: {
        street: appointment?.property?.address?.street || '',
        city: appointment?.property?.address?.city || '',
        state: appointment?.property?.address?.state || '',
        zipCode: appointment?.property?.address?.zipCode || ''
      },
      size: appointment?.property?.size || '',
      details: appointment?.property?.details || ''
    },
    budget: {
      min: 0,
      max: 0
    },
    accessInfo: appointment?.accessInfo || '',
    customerNotes: appointment?.notes || '',
    photos: []
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setPhotoPreviews([...photoPreviews, ...previews]);
    setPhotos([...photos, ...files]);
  };

  const removePhoto = (index) => {
    const newPhotos = [...photos];
    const newPreviews = [...photoPreviews];
    URL.revokeObjectURL(newPreviews[index].preview);
    newPhotos.splice(index, 1);
    newPreviews.splice(index, 1);
    setPhotos(newPhotos);
    setPhotoPreviews(newPreviews);
  };

  const uploadPhotos = async (estimateId) => {
    if (photos.length === 0) return;
    setUploadingPhotos(true);
    try {
      const formData = new FormData();
      photos.forEach(photo => formData.append('photos', photo));
      const res = await axios.post(
        `${API_URL}/estimates/${estimateId}/photos`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${userData?.token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return res.data;
    } catch (err) {
      console.error('Error uploading photos:', err);
      throw err;
    } finally {
      setUploadingPhotos(false);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      if (!tenant?._id) return;

      try {
        const res = await axios.get(`${API_URL}/services`, {
          headers: {
            Authorization: `Bearer ${userData?.token}`
          },
          params: {
            tenant: tenant._id
          }
        });
        const serviceList = res.data.data;
        setServices(serviceList);
        setLoadingServices(false);

        if (appointment) {
          const selectedService = serviceList.find(s => s._id === appointment.serviceId);
          if (selectedService) {
            setFormData(prev => ({
              ...prev,
              services: [{
                service: selectedService._id,
                quantity: 1
              }]
            }));
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setLoadingServices(false);
        setError('Failed to load services. Please try again.');
      }
    };

    if (userData?.token) {
      fetchServices();
    }
  }, [appointment, userData?.token, tenant]);

  useEffect(() => {
    return () => {
      photoPreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [photoPreviews]);

  const handleServiceChange = (index, serviceId) => {
    const updated = [...formData.services];
    updated[index] = {
      service: serviceId,
      quantity: updated[index]?.quantity || 1
    };
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const updateServiceQuantity = (index, value) => {
    const updated = [...formData.services];
    updated[index] = {
      ...updated[index],
      quantity: parseInt(value) || 1
    };
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const addServiceLine = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { service: '', quantity: 1 }]
    }));
  };

  const removeServiceLine = (index) => {
    const updated = [...formData.services];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, services: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.services.length === 0 || formData.services.some(s => !s.service)) {
      setError('Please add at least one valid service');
      setIsSubmitting(false);
      return;
    }

    if (!tenant?._id) {
      setError('Tenant information is not available. Please refresh the page.');
      setIsSubmitting(false);
      return;
    }
    
    const requestData = {
      tenantId: tenant._id,
      services: formData.services.map(s => ({
        service: s.service,
        quantity: parseInt(s.quantity)
      })),
      property: {
        address: formData.property.address,
        size: formData.property.size,
        details: formData.property.details
      },
      customerNotes: formData.customerNotes,
      budget: formData.budget,
      accessInfo: formData.accessInfo
    };

    try {
      console.log('Submitting estimate request:', requestData);
      
      const res = await axios.post(
        `${API_URL}/estimates/request`,
        requestData,
        { 
          headers: { 
            Authorization: `Bearer ${userData?.token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Estimate created:', res.data);
      
      const estimateId = res.data.data._id;
      if (photos.length > 0) await uploadPhotos(estimateId);
      router.push('/customers/estimates');
    } catch (err) {
      console.error('Error creating estimate:', err);
      console.error('Error response data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Failed to create estimate. Please try again.';
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData?.token) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-5 sm:px-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Request Estimate</h2>
          <p className="text-green-100 mt-1 text-sm sm:text-base">
            {appointmentId ? 'Based on your appointment' : 'Create a new estimate'}
          </p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 sm:mb-6 rounded-r">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 font-medium text-sm sm:text-base">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Services Section */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <Card.Header className="bg-gray-50 px-4 py-3 sm:px-5 sm:py-4 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Services Needed
                </h3>
              </Card.Header>
              <Card.Content className="p-4 sm:p-5">
                {formData.services.map((service, index) => (
                  <div key={index} className="grid grid-cols-1 gap-3 mb-4 items-end sm:grid-cols-5">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                      <select
                        value={service.service || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        onChange={(e) => handleServiceChange(index, e.target.value)}
                        required
                      >
                        <option value="">Select service</option>
                        {services.map(s => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        value={service.quantity}
                        onChange={(e) => updateServiceQuantity(index, e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex items-end h-full sm:col-span-1 justify-end sm:justify-start">
                      {formData.services.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 flex items-center text-xs sm:text-sm"
                          onClick={() => removeServiceLine(index)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addServiceLine}
                  variant="secondary"
                  className="mt-2 w-full sm:w-auto min-w-[180px] px-4 py-2 text-sm sm:text-base transition-all duration-200 hover:shadow-md flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Service</span>
                </Button>
              </Card.Content>
            </Card>

            {/* Property Details Section */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <Card.Header className="bg-gray-50 px-4 py-3 sm:px-5 sm:py-4 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Property Details
                </h3>
              </Card.Header>
              <Card.Content className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      placeholder="123 Main St"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      value={formData.property.address?.street}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        property: {
                          ...prev.property,
                          address: { ...prev.property.address, street: e.target.value }
                        }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      value={formData.property.address?.city}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        property: {
                          ...prev.property,
                          address: { ...prev.property.address, city: e.target.value }
                        }
                      }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="NY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      value={formData.property.address?.state}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        property: {
                          ...prev.property,
                          address: { ...prev.property.address, state: e.target.value }
                        }
                      }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      placeholder="10001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                      value={formData.property.address?.zipCode}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        property: {
                          ...prev.property,
                          address: { ...prev.property.address, zipCode: e.target.value }
                        }
                      }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Size (sq ft)</label>
                  <input
                    type="number"
                    placeholder="1500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                    value={formData.property.size}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      property: { ...prev.property, size: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Property Details</label>
                  <textarea
                    placeholder="Describe the property condition, special features, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 min-h-[100px] text-sm sm:text-base"
                    value={formData.property.details}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      property: { ...prev.property, details: e.target.value }
                    }))}
                  />
                </div>
              </Card.Content>
            </Card>

            {/* Budget Section */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <Card.Header className="bg-gray-50 px-4 py-3 sm:px-5 sm:py-4 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Budget Range
                </h3>
              </Card.Header>
              <Card.Content className="p-4 sm:p-5">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum ($)</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm sm:text-base">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        value={formData.budget.min}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          budget: { ...prev.budget, min: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum ($)</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm sm:text-base">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        value={formData.budget.max}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          budget: { ...prev.budget, max: parseFloat(e.target.value) || 0 }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Photos Section */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <Card.Header className="bg-gray-50 px-4 py-3 sm:px-5 sm:py-4 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Property Photos
                </h3>
              </Card.Header>
              <Card.Content className="p-4 sm:p-5">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 hover:border-green-400 transition-colors duration-200">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    multiple
                    accept="image/*"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 text-sm sm:text-base"
                  >
                    Select Photos
                  </label>
                  <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
                    JPEG or PNG, max 5MB each
                  </p>
                </div>

                {photoPreviews.length > 0 && (
                  <div className="mt-4 sm:mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 sm:mb-3">Selected Photos ({photoPreviews.length})</h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {photoPreviews.map((preview, index) => (
                        <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200">
                          <img
                            src={preview.preview}
                            alt={`Preview ${index}`}
                            className="w-full h-24 sm:h-32 object-cover"
                          />
                          <button
                            type="button"
                            className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={() => removePhoto(index)}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Content>
            </Card>

            {/* Access & Notes Section */}
            <Card className="border border-gray-200 rounded-lg overflow-hidden">
              <Card.Header className="bg-gray-50 px-4 py-3 sm:px-5 sm:py-4 border-b">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Access & Notes
                </h3>
              </Card.Header>
              <Card.Content className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Access Information</label>
                  <textarea
                    placeholder="Gate codes, parking instructions, special access requirements..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 min-h-[100px] text-sm sm:text-base"
                    value={formData.accessInfo}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessInfo: e.target.value }))}
                  />
                </div>
              </Card.Content>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/customer')}
                disabled={isSubmitting || uploadingPhotos}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || uploadingPhotos}
                className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base"
              >
                {isSubmitting || uploadingPhotos ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Request Estimate
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEstimateForm;