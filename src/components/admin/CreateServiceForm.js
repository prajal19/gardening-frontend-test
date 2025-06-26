"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTenant } from '../../contexts/TenantContext';
import { useDashboard } from '../../contexts/DashboardContext';


// Helper to decode JWT and extract role
const getUserRoleFromToken = (token) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};

const CreateServiceForm = () => {
  const { userData } = useDashboard();
  const { tenant } = useTenant();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    duration: "",
    basePrice: "",
    priceUnit: "hourly",
    image: "",
    isActive: true,
    recurringOptions: {
      isRecurring: false,
      frequencies: [],
      discounts: {},
    },
    packages: [
      {
        name: "Basic",
        description: "",
        additionalFeatures: [""],
        priceMultiplier: 1,
      },
      {
        name: "Standard",
        description: "",
        additionalFeatures: [""],
        priceMultiplier: 1.3,
      },
      {
        name: "Premium",
        description: "",
        additionalFeatures: [""],
        priceMultiplier: 1.6,
      },
    ],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRecurringToggle = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      recurringOptions: { ...prev.recurringOptions, isRecurring: checked },
    }));
  };

  const handleFrequencyChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    const discounts = {};
    selected.forEach((freq) => (discounts[freq] = 0));
    setFormData((prev) => ({
      ...prev,
      recurringOptions: {
        ...prev.recurringOptions,
        frequencies: selected,
        discounts,
      },
    }));
  };

  const handleDiscountChange = (freq, value) => {
    setFormData((prev) => ({
      ...prev,
      recurringOptions: {
        ...prev.recurringOptions,
        discounts: {
          ...prev.recurringOptions.discounts,
          [freq]: parseFloat(value) || 0,
        },
      },
    }));
  };

  const handlePackageChange = (index, field, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[index][field] =
      field === "priceMultiplier" ? parseFloat(value) : value;
    setFormData({ ...formData, packages: updatedPackages });
  };

  const handleFeatureChange = (pkgIndex, featIndex, value) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures[featIndex] = value;
    setFormData({ ...formData, packages: updatedPackages });
  };

  const addFeatureField = (pkgIndex) => {
    const updatedPackages = [...formData.packages];
    updatedPackages[pkgIndex].additionalFeatures.push("");
    setFormData({ ...formData, packages: updatedPackages });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.description) {
    alert("Description is required.");
    return;
  }

  try {
    // Ensure we have tenant ID from either context or user data
    const tenantId = tenant?._id || userData?.tenantId;
    if (!tenantId) {
      throw new Error("Tenant ID is required");
    }

    const payload = {
      ...formData,
      tenantId: tenantId, // Explicitly set tenantId
      duration: parseInt(formData.duration),
      basePrice: parseFloat(formData.basePrice),
    };

    const res = await axios.post(
      "http://localhost:5000/api/v1/services",
      payload,
      {
        headers: {
          Authorization: `Bearer ${userData?.token}`,
          'X-Tenant-Subdomain': tenant?.subdomain,
        },
      }
    );
    
    alert("Service created successfully!");
    console.log(res.data);
  } catch (err) {
    console.error("Error creating service:", err.response?.data || err.message);
    alert(`Failed to create service: ${err.message}`);
  }
};

  // Restrict access if not admin or tenant admin
  if (!['admin', 'tenantAdmin'].includes(userData?.role)) {
    return (
      <div className="text-center mt-10 text-red-600 text-lg font-semibold">
        Access Denied. Admins only.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white shadow rounded space-y-6"
    >
      <h2 className="text-2xl font-bold">Create New Service</h2>

      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Service Name"
        required
        className="w-full p-2 border"
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        required
        className="w-full p-2 border"
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-2 border"
        required
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

      <input
        name="duration"
        value={formData.duration}
        onChange={handleChange}
        type="number"
        placeholder="Duration (mins)"
        className="w-full p-2 border"
      />

      <input
        name="basePrice"
        value={formData.basePrice}
        onChange={handleChange}
        type="number"
        placeholder="Base Price"
        className="w-full p-2 border"
      />

      <select
        name="priceUnit"
        value={formData.priceUnit}
        onChange={handleChange}
        className="w-full p-2 border"
      >
        <option value="hourly">Hourly</option>
        <option value="flat">Flat</option>
        <option value="per_sqft">Per Sqft</option>
      </select>

      <input
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image Filename (e.g., tree-service.jpg)"
        className="w-full p-2 border"
      />

      {/* Recurring Options */}
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.recurringOptions.isRecurring}
          onChange={handleRecurringToggle}
        />
        <span>Is Recurring?</span>
      </label>

      {formData.recurringOptions.isRecurring && (
        <>
          <label>Select Frequencies</label>
          <select
            multiple
            value={formData.recurringOptions.frequencies}
            onChange={handleFrequencyChange}
            className="w-full p-2 border"
          >
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Annually">Annually</option>
          </select>

          {formData.recurringOptions.frequencies.map((freq) => (
            <div key={freq}>
              <label>{freq} Discount (%)</label>
              <input
                type="number"
                value={formData.recurringOptions.discounts[freq]}
                onChange={(e) => handleDiscountChange(freq, e.target.value)}
                className="w-full p-2 border"
              />
            </div>
          ))}
        </>
      )}

      {/* Packages */}
      <h3 className="text-xl font-semibold">Service Packages</h3>
      {formData.packages.map((pkg, index) => (
        <div key={index} className="p-4 border rounded mb-4">
          <h4 className="font-medium mb-2">{pkg.name} Package</h4>

          <input
            value={pkg.description}
            onChange={(e) => handlePackageChange(index, "description", e.target.value)}
            placeholder="Package Description"
            className="w-full p-2 border mb-2"
          />

          <input
            type="number"
            value={pkg.priceMultiplier}
            onChange={(e) =>
              handlePackageChange(index, "priceMultiplier", e.target.value)
            }
            placeholder="Price Multiplier"
            className="w-full p-2 border mb-2"
          />

          <h5 className="font-medium">Features</h5>
          {pkg.additionalFeatures.map((feat, featIndex) => (
            <input
              key={featIndex}
              value={feat}
              onChange={(e) =>
                handleFeatureChange(index, featIndex, e.target.value)
              }
              placeholder={`Feature ${featIndex + 1}`}
              className="w-full p-2 border mb-2"
            />
          ))}

          <button
            type="button"
            onClick={() => addFeatureField(index)}
            className="text-sm text-blue-600 underline"
          >
            + Add Feature
          </button>
        </div>
      ))}

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
      >
        Create Service
      </button>
    </form>
  );
};

export default CreateServiceForm;
