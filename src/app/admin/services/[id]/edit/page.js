'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTenant } from '@/contexts/TenantContext';
import { useRouter } from 'next/navigation';

const EditServiceForm = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const { userData, isLoading: userLoading } = useDashboard();
  const { tenant, isLoading: tenantLoading } = useTenant();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [serviceTenantId, setServiceTenantId] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    duration: '60',
    basePrice: '',
    priceUnit: 'hourly',
    isActive: true,
    recurringOptions: {
      isRecurring: false,
      frequencies: [],
      discounts: {},
    },
    packages: [
      {
        name: 'Basic',
        description: 'Basic package with essential services',
        additionalFeatures: ['Standard service'],
        priceMultiplier: 1,
      },
      {
        name: 'Standard',
        description: 'Standard package with additional features',
        additionalFeatures: ['Standard service', 'Additional support'],
        priceMultiplier: 1.3,
      },
      {
        name: 'Premium',
        description: 'Premium package with all features included',
        additionalFeatures: ['Standard service', 'Additional support', 'Premium features'],
        priceMultiplier: 1.6,
      },
    ],
  });

  // Fetch service data
  useEffect(() => {
    const fetchService = async () => {
      if (!userData?.token) return;
      
      try {
        const response = await axios.get(`${API_URL}/services/${id}`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            'X-Tenant-Subdomain': tenant?.subdomain,
          }
        });
        
        const service = response.data.data;
        setServiceTenantId(service.tenantId);
        
        // Validate tenant ownership
        if (userData.role === 'tenantAdmin' && 
            tenant?._id && 
            service.tenantId !== tenant._id) {
          router.push('/admin/services');
          return;
        }

        setFormData({
          name: service.name,
          description: service.description,
          category: service.category,
          duration: service.duration.toString(),
          basePrice: service.basePrice.toString(),
          priceUnit: service.priceUnit || 'hourly',
          isActive: service.isActive,
          recurringOptions: service.recurringOptions || {
            isRecurring: false,
            frequencies: [],
            discounts: {},
          },
          packages: service.packages || [
            {
              name: 'Basic',
              description: 'Basic package with essential services',
              additionalFeatures: ['Standard service'],
              priceMultiplier: 1,
            },
            {
              name: 'Standard',
              description: 'Standard package with additional features',
              additionalFeatures: ['Standard service', 'Additional support'],
              priceMultiplier: 1.3,
            },
            {
              name: 'Premium',
              description: 'Premium package with all features included',
              additionalFeatures: ['Standard service', 'Additional support', 'Premium features'],
              priceMultiplier: 1.6,
            },
          ],
        });

        if (service.image?.url) {
          setPreview(service.image.url);
        }
      } catch (error) {
        console.error('Error fetching service:', error);
        router.push('/admin/services');
      }
    };
    
    if (!userLoading && !tenantLoading) {
      fetchService();
    }
  }, [id, userData, userLoading, tenant, tenantLoading]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setFormErrors({
          ...formErrors,
          image: 'Please select an image file (JPEG, PNG)',
        });
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          image: 'File size must be less than 2MB',
        });
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setFormErrors({ ...formErrors, image: '' });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Service name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    
    if (!formData.basePrice || isNaN(formData.basePrice) || parseFloat(formData.basePrice) <= 0) {
      errors.basePrice = 'Valid base price greater than 0 is required';
    }
    
    if (formData.duration && (isNaN(formData.duration) || parseInt(formData.duration) <= 0)) {
      errors.duration = 'Duration must be a positive number';
    }
    
    const packageErrors = [];
    formData.packages.forEach((pkg, idx) => {
      if (!pkg.description.trim()) {
        packageErrors.push(`Package ${pkg.name} requires a description`);
      }
      if (pkg.additionalFeatures.some(feat => !feat.trim())) {
        packageErrors.push(`Package ${pkg.name} has empty features`);
      }
      if (isNaN(pkg.priceMultiplier) || parseFloat(pkg.priceMultiplier) < 1) {
        packageErrors.push(`Package ${pkg.name} price multiplier must be at least 1`);
      }
    });
    
    if (packageErrors.length > 0) {
      errors.packages = packageErrors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  // Handle recurring options
  const handleRecurringToggle = (e) => {
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      recurringOptions: { 
        ...prev.recurringOptions, 
        isRecurring: checked,
        frequencies: checked ? prev.recurringOptions.frequencies : [],
        discounts: checked ? prev.recurringOptions.discounts : {},
      },
    }));
  };

  const handleFrequencyChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    const currentDiscounts = { ...formData.recurringOptions.discounts };
    
    const updatedDiscounts = {};
    selected.forEach(freq => {
      updatedDiscounts[freq] = currentDiscounts[freq] !== undefined ? currentDiscounts[freq] : 0;
    });
    
    setFormData(prev => ({
      ...prev,
      recurringOptions: {
        ...prev.recurringOptions,
        frequencies: selected,
        discounts: updatedDiscounts,
      },
    }));
  };

  const handleDiscountChange = (freq, value) => {
    const discount = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    
    setFormData(prev => ({
      ...prev,
      recurringOptions: {
        ...prev.recurringOptions,
        discounts: {
          ...prev.recurringOptions.discounts,
          [freq]: discount,
        },
      },
    }));
  };

  // Handle package changes
  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index][field] =
      field === 'priceMultiplier' ? parseFloat(value) || 1 : value;
    setFormData({ ...formData, packages: updatedPackages });
    
    if (formErrors.packages) {
      setFormErrors({
        ...formErrors,
        packages: null,
      });
    }
  };

  const handleFeatureChange = (pkgIndex, featIndex, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures[featIndex] = value;
    setFormData({ ...formData, packages: updatedPackages });
    
    if (formErrors.packages) {
      setFormErrors({
        ...formErrors,
        packages: null,
      });
    }
  };

  const addFeatureField = (pkgIndex) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures.push('');
    setFormData({ ...formData, packages: updatedPackages });
  };

  const removeFeatureField = (pkgIndex, featIndex) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures.splice(featIndex, 1);
    setFormData({ ...formData, packages: updatedPackages });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSuccessMessage('');
    setFormErrors({});

    try {
      const headers = {
        Authorization: `Bearer ${userData?.token}`,
      };

      if (tenant?.subdomain) {
        headers['X-Tenant-Subdomain'] = tenant.subdomain;
      }

      // Update service data
      const res = await axios.put(
        `${API_URL}/services/${id}`,
        {
          ...formData,
          duration: parseInt(formData.duration) || 60,
          basePrice: parseFloat(formData.basePrice),
          packages: formData.packages.map(pkg => ({
            ...pkg,
            priceMultiplier: parseFloat(pkg.priceMultiplier) || 1,
            additionalFeatures: pkg.additionalFeatures.filter(feature => feature.trim() !== '')
          }))
        },
        { headers }
      );

      // Upload image if selected
      if (selectedFile) {
        const formDataPhoto = new FormData();
        formDataPhoto.append('file', selectedFile);
        
        await axios.put(
          `${API_URL}/services/${id}/photo`,
          formDataPhoto,
          {
            headers: {
              ...headers,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      setSuccessMessage('Service updated successfully!');
      setTimeout(() => {
        router.push('/admin/services');
      }, 1500);
    } catch (err) {
      console.error('Error updating service:', err);
      
      let errorMessage = 'Failed to update service';
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = "You don't have permission to edit this service";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      setFormErrors(prev => ({
        ...prev,
        submit: errorMessage,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleDelete = async () => {
  //   if (!confirm('Are you sure you want to delete this service? This action cannot be undone.')) return;

  //   try {
  //     const headers = {
  //       Authorization: `Bearer ${userData?.token}`,
  //     };

  //     if (tenant?.subdomain) {
  //       headers['X-Tenant-Subdomain'] = tenant.subdomain;
  //     }

  //     await axios.delete(`${API_URL}/services/${id}`, { headers });
  //     router.push('/admin/services');
  //   } catch (err) {
  //     console.error('Error deleting service:', err);
  //     setFormErrors({
  //       ...formErrors,
  //       submit: 'Failed to delete service',
  //     });
  //   }
  // };

  // Check access before rendering
  if (userLoading || tenantLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // Check user role
  if (!['admin', 'tenantAdmin'].includes(userData?.role)) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg font-semibold">
        Access Denied. Admins only.
      </div>
    );
  }

  // For tenant admins, check if they own this service
  if (userData.role === 'tenantAdmin' && 
      tenant?._id && 
      serviceTenantId && 
      tenant._id !== serviceTenantId) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg font-semibold">
        Access Denied. You can only edit your tenant's services.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        <div className="flex justify-between items-center border-b pb-2">
          <h2 className="text-2xl font-bold text-gray-800">Edit Service</h2>
          {/* <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Service
          </button> */}
        </div>

        {successMessage && (
          <div className="p-4 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        {formErrors.submit && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            {formErrors.submit}
          </div>
        )}
        
        {formErrors.packages && (
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            <p className="font-semibold">Please fix the following issues:</p>
            <ul className="list-disc pl-5 mt-1">
              {formErrors.packages.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                formErrors.category ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
              <option value="">Select Category</option>
              <option value="Lawn Maintenance">Lawn Maintenance</option>
              <option value="Gardening">Gardening</option>
              <option value="Tree Service">Tree Service</option>
              <option value="Landscaping Design">Landscaping Design</option>
              <option value="Irrigation">Irrigation</option>
              <option value="Seasonal">Seasonal</option>
              <option value="Other">Other</option>
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border ${
                formErrors.duration ? 'border-red-500' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {formErrors.duration && (
              <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
            )}
          </div>

          {/* Base Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                $
              </span>
              <input
                name="basePrice"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.basePrice}
                onChange={handleChange}
                required
                className={`w-full pl-8 pr-3 py-2 border ${
                  formErrors.basePrice ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              />
            </div>
            {formErrors.basePrice && (
              <p className="mt-1 text-sm text-red-600">{formErrors.basePrice}</p>
            )}
          </div>

          {/* Price Unit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pricing Unit
            </label>
            <select
              name="priceUnit"
              value={formData.priceUnit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="hourly">Hourly</option>
              <option value="flat">Flat Rate</option>
              <option value="per_sqft">Per Square Foot</option>
            </select>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Active Service
            </label>
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Service Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                className="px-4 py-2 bg-green-600 text-white rounded-md cursor-pointer hover:bg-green-700 transition-colors"
              >
                Choose File
              </label>
            </div>
            <span className="text-sm text-gray-500">
              {selectedFile ? selectedFile.name : 'No file chosen'}
            </span>
          </div>
          {formErrors.image && (
            <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
          )}
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Service preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className={`w-full px-3 py-2 border ${
              formErrors.description ? 'border-red-500' : 'border-gray-300'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
          )}
        </div>

        {/* Recurring Options */}
        <div className="border-t pt-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={formData.recurringOptions.isRecurring}
              onChange={handleRecurringToggle}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm font-medium text-gray-700">
              Recurring Service
            </label>
          </div>

          {formData.recurringOptions.isRecurring && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Frequencies
                </label>
                <select
                  multiple
                  value={formData.recurringOptions.frequencies}
                  onChange={handleFrequencyChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="One-time">One-time</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annually">Annually</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Hold Ctrl/Cmd to select multiple options
                </p>
              </div>

              {formData.recurringOptions.frequencies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    Frequency Discounts (%)
                  </h4>
                  {formData.recurringOptions.frequencies.map((freq) => (
                    <div key={freq} className="grid grid-cols-3 gap-4 items-center">
                      <label className="text-sm text-gray-700">{freq}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.recurringOptions.discounts[freq] || 0}
                        onChange={(e) => handleDiscountChange(freq, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-500">% discount</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Packages */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Service Packages
          </h3>
          <div className="space-y-6">
            {formData.packages.map((pkg, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 space-y-3"
              >
                <h4 className="font-medium text-gray-800">{pkg.name} Package</h4>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={pkg.description}
                    onChange={(e) =>
                      handlePackageChange(index, 'description', e.target.value)
                    }
                    rows="2"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Price Multiplier <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={pkg.priceMultiplier}
                    onChange={(e) =>
                      handlePackageChange(index, 'priceMultiplier', e.target.value)
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Must be 1.0 or greater (1.0 = base price, 2.0 = double the base price)
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm text-gray-700">
                      Features <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addFeatureField(index)}
                      className="text-xs text-green-600 hover:text-green-800"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {pkg.additionalFeatures.map((feat, featIndex) => (
                      <div key={featIndex} className="flex items-center space-x-2">
                        <input
                          value={feat}
                          onChange={(e) =>
                            handleFeatureChange(index, featIndex, e.target.value)
                          }
                          required
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {pkg.additionalFeatures.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeatureField(index, featIndex)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <button
            type="button"
            onClick={() => router.push('/admin/services')}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </span>
            ) : (
              'Update Service'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditServiceForm;