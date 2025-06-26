'use client';

import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import useStore from '../../lib/store';
import { useDashboard } from '../../contexts/DashboardContext';
import axios from 'axios';

const CustomerDetails = ({ onNext, onBack }) => {
  const { currentBooking, updateCurrentBooking } = useStore();
  const { userData, isLoading } = useDashboard();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    propertyDetails: [{
      name: 'Property 1',
      propertyAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA'
      },
      size: '',
      images: [],
      features: {
        hasFrontYard: true,
        hasBackYard: true,
        hasTrees: false,
        hasGarden: false,
        hasSprinklerSystem: false
      },
      accessInstructions: ''
    }],
    notificationPreferences: {
      email: true,
      sms: false
    },
    notes: ''
  });

  const [customerData, setCustomerData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);

  useEffect(() => {
    if (isLoading || !userData?.token) return;

    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/customers/me`, {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        const customer = response.data.data;
        setCustomerData(customer);
        
        // Use propertyDetails directly from the API response
        const propertyDetails = customer.propertyDetails || [{
          name: 'Property 1',
          propertyAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          },
          size: '',
          images: [],
          features: {
            hasFrontYard: true,
            hasBackYard: true,
            hasTrees: false,
            hasGarden: false,
            hasSprinklerSystem: false
          },
          accessInstructions: ''
        }];

        setFormData({
          address: customer.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          },
          propertyDetails,
          notificationPreferences: customer.notificationPreferences || {
            email: true,
            sms: false
          },
          notes: currentBooking.notes || ''
        });
      } catch (error) {
        console.error('Failed to fetch customer details:', error);
      }
    };

    fetchCustomerDetails();
  }, [userData, isLoading]);

  const handlePropertyImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const uploadFormData = new FormData();
  files.forEach(file => uploadFormData.append('images', file)); // Keep 'images' as field name

  try {
    setIsUploading(true);
    setUploadProgress(0);
    
    const response = await axios.post(
      `${API_URL}/customers/${customerData._id}/propertyDetails/${activePropertyIndex}/images`,
      uploadFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userData.token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      }
    );

    setFormData(prev => {
      const updatedPropertyDetails = [...prev.propertyDetails];
      updatedPropertyDetails[activePropertyIndex].images = response.data.data;
      return { ...prev, propertyDetails: updatedPropertyDetails };
    });
  } catch (error) {
    console.error('Upload failed:', error);
    alert('Image upload failed: ' + (error.response?.data?.message || error.message));
  } finally {
    setIsUploading(false);
  }
};

 const handleDeleteImage = async (imageId) => {
  if (!confirm('Are you sure you want to delete this image?')) return;

  try {
    const response = await axios.delete(
      `${API_URL}/customers/${customerData._id}/propertyDetails/${activePropertyIndex}/images/${imageId}`,
      { headers: { Authorization: `Bearer ${userData.token}` } }
    );

    // Update state with the response data if needed, or just filter locally
    setFormData(prev => {
      const updatedPropertyDetails = [...prev.propertyDetails];
      updatedPropertyDetails[activePropertyIndex].images = 
        updatedPropertyDetails[activePropertyIndex].images.filter(img => img._id !== imageId);
      return { ...prev, propertyDetails: updatedPropertyDetails };
    });
  } catch (error) {
    console.error('Delete error:', error);
    alert('Failed to delete image. Please try again.');
  }
};

  const handleInputChange = (path, value) => {
    setFormData(prev => ({
      ...prev,
      [path]: value
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handlePropertyChange = (index, field, value) => {
    setFormData(prev => {
      const updatedPropertyDetails = [...prev.propertyDetails];
      // Ensure the property exists
      if (!updatedPropertyDetails[index]) {
        updatedPropertyDetails[index] = {
          name: '',
          propertyAddress: {},
          size: '',
          images: [],
          features: {},
          accessInstructions: ''
        };
      }
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (!updatedPropertyDetails[index][parent]) {
          updatedPropertyDetails[index][parent] = {};
        }
        updatedPropertyDetails[index][parent][child] = value;
      } else {
        updatedPropertyDetails[index][field] = value;
      }
      return { ...prev, propertyDetails: updatedPropertyDetails };
    });
  };

  const addNewProperty = () => {
    setFormData(prev => ({
      ...prev,
      propertyDetails: [
        ...prev.propertyDetails,
        {
          name: `Property ${prev.propertyDetails.length + 1}`,
          propertyAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
          },
          size: '',
          images: [],
          features: {
            hasFrontYard: true,
            hasBackYard: true,
            hasTrees: false,
            hasGarden: false,
            hasSprinklerSystem: false
          },
          accessInstructions: ''
        }
      ]
    }));
    setActivePropertyIndex(formData.propertyDetails.length);
  };

  const removeProperty = (index) => {
    if (formData.propertyDetails.length <= 1) {
      alert('You must have at least one property');
      return;
    }
    
    setFormData(prev => {
      const updatedPropertyDetails = [...prev.propertyDetails];
      updatedPropertyDetails.splice(index, 1);
      return { ...prev, propertyDetails: updatedPropertyDetails };
    });
    
    if (index === activePropertyIndex) {
      setActivePropertyIndex(Math.max(0, activePropertyIndex - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        address: formData.address,
        propertyDetails: formData.propertyDetails,
        notificationPreferences: formData.notificationPreferences,
        notes: formData.notes
      };

      await axios.put(
        `${API_URL}/customers/me`,
        dataToSend,
        { headers: { Authorization: `Bearer ${userData.token}` } }
      );

      updateCurrentBooking({
        ...currentBooking,
        propertyDetails: formData.propertyDetails,
        notes: formData.notes
      });
      
      onNext();
    } catch (error) {
      console.error('Failed to save customer details:', error);
      alert('Failed to save details. Please try again.');
    }
  };

  if (!customerData) return <div>Loading...</div>;

  const currentProperty = formData.propertyDetails[activePropertyIndex];

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Customer Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                value={customerData.user.name}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-md"
                value={customerData.user.email}
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-md"
                value={customerData.user.phone || ''}
                disabled
              />
            </div>

            {/* User's Personal Address */}
            <h3 className="text-lg font-medium mt-4">Your Address</h3>
            {['street', 'city', 'state', 'zipCode'].map((field) => (
              <div key={`personal-${field}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={formData.address[field] || ''}
                  onChange={(e) => handleNestedChange('address', field, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Properties Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Properties ({formData.propertyDetails.length})
              </h3>
              <button
                type="button"
                onClick={addNewProperty}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded"
              >
                + Add Property
              </button>
            </div>

            {/* Property Navigation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.propertyDetails.map((property, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActivePropertyIndex(index)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index === activePropertyIndex
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {property.name}
                </button>
              ))}
            </div>

            {/* Current Property Form */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">
                  {currentProperty?.name || ''} Details
                </h4>
                {formData.propertyDetails.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProperty(activePropertyIndex)}
                    className="text-sm text-red-600"
                  >
                    Remove Property
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md"
                  value={currentProperty?.name}
                  onChange={(e) => handlePropertyChange(
                    activePropertyIndex,
                    'name',
                    e.target.value
                  )}
                />
              </div>

              <h4 className="text-md font-medium">Property Address</h4>
              {['street', 'city', 'state', 'zipCode'].map((field) => (
                <div key={`property-${field}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace(/([A-Z])/g, ' $1')}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-md"
                    value={currentProperty?.propertyAddress[field] || ''}
                    onChange={(e) => handlePropertyChange(
                      activePropertyIndex,
                      `propertyAddress.${field}`,
                      e.target.value
                    )}
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size (sq ft)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded-md"
                  value={currentProperty?.size || ''}
                  onChange={(e) => handlePropertyChange(
                    activePropertyIndex,
                    'size',
                    e.target.value
                  )}
                />
              </div>

              {/* Property Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Images (Multiple)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePropertyImageUpload}
                  disabled={isUploading}
                  multiple
                  className="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                {isUploading && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Current Images Gallery */}
              {currentProperty?.images?.length > 0 && (
  <div className="mt-4">
    <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {currentProperty?.images.map((image) => (
        <div key={image._id || image.url} className="relative group">
          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
            <img 
              src={image.url}
              alt="Property" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          <button
            type="button"
            onClick={() => handleDeleteImage(image._id)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  </div>
)}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Instructions</label>
                <textarea
                  className="w-full px-4 py-2 border rounded-md"
                  value={currentProperty?.accessInstructions || ''}
                  onChange={(e) => handlePropertyChange(
                    activePropertyIndex,
                    'accessInstructions',
                    e.target.value
                  )}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Features</label>
                {Object.keys(currentProperty?.features || {}).map((feature) => (

                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={currentProperty?.features[feature]}
                      onChange={(e) => handlePropertyChange(
                        activePropertyIndex,
                        `features.${feature}`,
                        e.target.checked
                      )}
                      className="h-4 w-4 text-green-600 mr-2"
                    />
                    <span className="capitalize">
                      {feature.replace(/([A-Z])/g, ' $1').replace('has ', '')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            {['email', 'sms'].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notificationPreferences[type]}
                  onChange={(e) => handleNestedChange(
                    'notificationPreferences',
                    type,
                    e.target.checked
                  )}
                  className="h-4 w-4 text-green-600 mr-2"
                />
                <span className="capitalize">{type}</span>
              </label>
            ))}
          </div>

          {/* Special Instructions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Special Instructions</h3>
            <textarea
              className="w-full px-4 py-2 border rounded-md"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back to Scheduling
          </Button>
          <Button type="submit">
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CustomerDetails;