"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDashboard } from "../../contexts/DashboardContext";
import { useRouter } from 'next/navigation';

const ServiceForm = () => {
  const router = useRouter();
  const { userData, isLoading } = useDashboard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const API_URL=process.env.NEXT_PUBLIC_API_BASE_URL;
  // Add state for existing service names to check for duplicates
  const [existingServices, setExistingServices] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "60", // Default value to avoid empty string issues
    basePrice: "",
    priceUnit: "hourly",
    isActive: true,
    recurringOptions: {
      isRecurring: false,
      frequencies: [],
      discounts: {},
    },
    packages: [
      {
        name: "Basic",
        description: "Basic package with essential services",
        additionalFeatures: ["Standard service"],
        priceMultiplier: 1,
      },
      {
        name: "Standard",
        description: "Standard package with additional features",
        additionalFeatures: ["Standard service", "Additional support"],
        priceMultiplier: 1.3,
      },
      {
        name: "Premium",
        description: "Premium package with all features included",
        additionalFeatures: ["Standard service", "Additional support", "Premium features"],
        priceMultiplier: 1.6,
      },
    ],
  });

  // Fetch existing service names on component mount
  // useEffect(() => {
  //   const fetchServices = async () => {
  //     if (userData?.token) {
  //       try {
  //         const response = await axios.get(`${API_URL}/services`, {
  //           headers: {
  //             Authorization: `Bearer ${userData.token}`,
  //           }
  //         });
  //         // Extract service names for duplicate checking
  //         const serviceNames = response.data.data.map(service => service.name);
  //         setExistingServices(serviceNames);
  //       } catch (error) {
  //         console.error("Error fetching services:", error);
  //       }
  //     }
  //   };
    
  //   fetchServices();
  // }, [userData]);



  // Update the useEffect for fetching services
// useEffect(() => {
//   const fetchServices = async () => {
//     if (!userData?.token || !userData?.tenantId?._id) return;

//     try {
//       const response = await axios.get(`${API_URL}/services`, {
//         headers: { Authorization: `Bearer ${userData.token}` },
//         params: {
//           tenantId: userData.tenantId._id,
//           // Add other params as needed
//         }
//       });
      
//       const services = response.data?.data || [];
//       setExistingServices(services.map(service => service.name));
//     } catch (error) {
//       console.error("Error fetching services:", error);
//     }
//   };
  
//   fetchServices();
// }, [userData, API_URL]);

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        setFormErrors({
          ...formErrors,
          image: "Please select an image file (JPEG, PNG)",
        });
        return;
      }
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors({
          ...formErrors,
          image: "File size must be less than 2MB",
        });
        return;
      }

      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setFormErrors({ ...formErrors, image: "" });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    // Service Name validation
    const nameErrors = [];
    const serviceName = formData.name.trim();
    const MAX_SERVICE_NAME_LENGTH = 100;
    // Allow alphanumeric, spaces, hyphens, and ampersands.
    const VALID_SERVICE_NAME_REGEX = /^[a-zA-Z0-9\s\-&]+$/;

    if (!serviceName) {
      nameErrors.push("Service name is required.");
    } else {
      if (serviceName.length > MAX_SERVICE_NAME_LENGTH) {
        nameErrors.push(`Service name cannot exceed ${MAX_SERVICE_NAME_LENGTH} characters.`);
      }
      if (!VALID_SERVICE_NAME_REGEX.test(serviceName)) {
        nameErrors.push("Service name can only contain letters, numbers, spaces, hyphens (-), and ampersands (&).");
      } else {
        // Check if the name consists only of numbers if it passed the general character validation
        const ONLY_NUMBERS_REGEX = /^\d+$/;
        if (ONLY_NUMBERS_REGEX.test(serviceName)) {
          nameErrors.push("Service name cannot consist only of numbers.");
        }
      }
      // Check for duplicate service name (only if name is not empty)
      if (existingServices.includes(serviceName)) {
         nameErrors.push("A service with this name already exists.");
      }
    }

    if (nameErrors.length > 0) {
      errors.name = nameErrors.join(" ");
    }
    
    // Check for empty required fields (continued for other fields)
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.category) errors.category = "Category is required";
    // The duplicate service name check is now part of the combined nameErrors logic.
    
    // Validate numeric fields
    if (!formData.basePrice || isNaN(formData.basePrice) || parseFloat(formData.basePrice) <= 0) {
      errors.basePrice = "Valid base price greater than 0 is required";
    }
    
    if (formData.duration && (isNaN(formData.duration) || parseInt(formData.duration) <= 0)) {
      errors.duration = "Duration must be a positive number";
    }
    
    // Validate package fields
    const packageErrors = [];
    formData.packages.forEach((pkg, idx) => {
      if (!pkg.description.trim()) {
        packageErrors.push(`Package ${pkg.name} requires a description`);
      }
      if (pkg.additionalFeatures.some(feat => !feat.trim())) {
        packageErrors.push(`Package ${pkg.name} has empty features.`);
      }

      // Check for duplicate features within the same package (case-insensitive)
      const featuresInPackage = pkg.additionalFeatures.map(f => f.trim().toLowerCase());
      const uniqueFeaturesInPackage = new Set(featuresInPackage);
      if (featuresInPackage.length !== uniqueFeaturesInPackage.size) {
        const seenFeatures = new Set();
        let firstDuplicateOriginalCase = '';
        for (const originalFeature of pkg.additionalFeatures) {
          const processedFeature = originalFeature.trim().toLowerCase();
          if (seenFeatures.has(processedFeature)) {
            firstDuplicateOriginalCase = originalFeature.trim();
            break;
          }
          seenFeatures.add(processedFeature);
        }
        packageErrors.push(`Package ${pkg.name} has a duplicate feature: "${firstDuplicateOriginalCase}".`);
      }

      // Check feature character limits
      const MAX_FEATURE_LENGTH = 75;
      pkg.additionalFeatures.forEach(feature => {
        if (feature.trim().length > MAX_FEATURE_LENGTH) {
          packageErrors.push(`Package ${pkg.name}: Feature "${feature.trim().substring(0, 20)}..." exceeds ${MAX_FEATURE_LENGTH} characters.`);
        }
      });

      if (isNaN(pkg.priceMultiplier) || parseFloat(pkg.priceMultiplier) < 1) {
        packageErrors.push(`Package ${pkg.name} price multiplier must be at least 1`);
      }
    });
    
    if (packageErrors.length > 0) {
      errors.packages = packageErrors;
    }

    // Validate service image
    if (!selectedFile) {
      errors.image = "Service image is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    setFormData(newFormData);

    if (name === "name") {
      const nameErrors = [];
      const serviceName = newFormData.name.trim();
      const MAX_SERVICE_NAME_LENGTH = 100;
      const VALID_SERVICE_NAME_REGEX = /^[a-zA-Z0-9\s\-&]+$/;
      const ONLY_NUMBERS_REGEX = /^\d+$/;

      if (!serviceName) {
        nameErrors.push("Service name is required.");
      } else {
        if (serviceName.length > MAX_SERVICE_NAME_LENGTH) {
          nameErrors.push(`Service name cannot exceed ${MAX_SERVICE_NAME_LENGTH} characters.`);
        }
        if (!VALID_SERVICE_NAME_REGEX.test(serviceName)) {
          nameErrors.push("Service name can only contain letters, numbers, spaces, hyphens (-), and ampersands (&).");
        } else {
          if (ONLY_NUMBERS_REGEX.test(serviceName)) {
            nameErrors.push("Service name cannot consist only of numbers.");
          }
        }
        if (existingServices.includes(serviceName)) {
          nameErrors.push("A service with this name already exists.");
        }
      }
      setFormErrors(prevErrors => ({
        ...prevErrors,
        name: nameErrors.length > 0 ? nameErrors.join(" ") : "",
      }));
    } else if (formErrors[name]) {
      // Clear error for other fields when user makes changes
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // Handle recurring options toggle
  const handleRecurringToggle = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      recurringOptions: { 
        ...prev.recurringOptions, 
        isRecurring: checked,
        // Reset frequencies if toggling off
        frequencies: checked ? prev.recurringOptions.frequencies : [],
        // Reset discounts if toggling off
        discounts: checked ? prev.recurringOptions.discounts : {},
      },
    }));
  };

  // Handle frequency selection
  const handleFrequencyChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    const currentDiscounts = { ...formData.recurringOptions.discounts };
    
    // Add new frequencies with default discount
    const updatedDiscounts = {};
    selected.forEach((freq) => {
      // Preserve existing discount values or set default
      updatedDiscounts[freq] = currentDiscounts[freq] !== undefined ? currentDiscounts[freq] : 0;
    });
    
    setFormData((prev) => ({
      ...prev,
      recurringOptions: {
        ...prev.recurringOptions,
        frequencies: selected,
        discounts: updatedDiscounts,
      },
    }));
  };

  // Handle discount changes
  const handleDiscountChange = (freq, value) => {
    // Ensure discount is between 0 and 100
    const discount = Math.min(Math.max(parseFloat(value) || 0, 0), 100);
    
    setFormData((prev) => ({
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
      field === "priceMultiplier" ? parseFloat(value) || 1 : value;
    setFormData({ ...formData, packages: updatedPackages });
    
    // Clear package errors when changes are made
    if (formErrors.packages) {
      setFormErrors({
        ...formErrors,
        packages: null,
      });
    }
  };

  // Handle package feature changes
  const handleFeatureChange = (pkgIndex, featIndex, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures[featIndex] = value;
    setFormData({ ...formData, packages: updatedPackages });
    
    // Clear package errors when changes are made
    if (formErrors.packages) {
      setFormErrors({
        ...formErrors,
        packages: null,
      });
    }
  };

  // Add new feature field to package
  const addFeatureField = (pkgIndex) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures.push("");
    setFormData({ ...formData, packages: updatedPackages });
  };

  // Remove feature field from package
  const removeFeatureField = (pkgIndex, featIndex) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures.splice(featIndex, 1);
    setFormData({ ...formData, packages: updatedPackages });
  };

  // Form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  if (!userData?.tenantId?._id) {
    setFormErrors({ submit: "You must be associated with a tenant to create services" });
    return;
  }

  setIsSubmitting(true);
  setSuccessMessage("");
  setFormErrors({});

   try {
    const serviceData = {
      ...formData,
      tenantId: userData.tenantId._id, // Add tenantId to the service
      duration: parseInt(formData.duration),
      basePrice: parseFloat(formData.basePrice),
      packages: formData.packages.map(pkg => ({
        ...pkg,
        priceMultiplier: parseFloat(pkg.priceMultiplier)
      }))
    };

    const res = await axios.post(`${API_URL}/services`, serviceData, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
        'Content-Type': 'application/json'
      }
    });

    const serviceId = res.data?.data?._id || res.data?._id;
    if (!serviceId) throw new Error("Service ID not found");

    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      await axios.put(`${API_URL}/services/${serviceId}/photo`, formData, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    }

    setSuccessMessage("Service created successfully!");
    router.push('/admin/services');
  } catch (err) {
    const errorMessage = err.response?.data?.error || 
                       err.response?.data?.message || 
                       err.message || 
                       "Failed to create service";

    setFormErrors(prev => ({
      ...prev,
      submit: errorMessage,
      ...(errorMessage.toLowerCase().includes('duplicate') && {
        name: "A service with this name already exists"
      }
    )}));
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

 if (userData?.role !== "tenantAdmin" || !userData?.tenantId) {
  return (
    <div className="text-center mt-10 text-red-600 text-lg font-semibold">
      {!userData?.tenantId
        ? "You must be associated with a tenant to create services"
        : "Access Denied. Tenant Admins only."}
    </div>
  );
}

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Create New Service
        </h2>

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
        
        {/* Display package validation errors if any */}
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
              maxLength="100"
              className={`w-full px-3 py-2 border ${
                formErrors.name ? "border-red-500" : "border-gray-300"
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
                formErrors.category ? "border-red-500" : "border-gray-300"
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
                formErrors.duration ? "border-red-500" : "border-gray-300"
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
                  formErrors.basePrice ? "border-red-500" : "border-gray-300"
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

        {/* File Upload */}
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
              {selectedFile ? selectedFile.name : "No file chosen"}
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
              formErrors.description ? "border-red-500" : "border-gray-300"
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
                      handlePackageChange(index, "description", e.target.value)
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
                      handlePackageChange(index, "priceMultiplier", e.target.value)
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
                          type="text"
                          value={feat}
                          maxLength="75"
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

        <div className="flex justify-end pt-4 border-t">
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
                Creating...
              </span>
            ) : (
              "Create Service"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;