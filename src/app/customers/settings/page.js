// 'use client'; // Add this at the top to mark the component as a Client Component

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';  // Use this for navigation in App Directory
// import { toast } from 'react-toastify';
// import CustomerLayout from "../../../components/customer/CustomerLayout";

// export default function SettingsPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'USA',
//     size: '',
//     hasFrontYard: true,
//     hasBackYard: true,
//     hasTrees: false,
//     hasGarden: false,
//     hasSprinklerSystem: false,
//     preferredDays: [],
//     preferredTimeOfDay: 'Any',
//     emailNotification: true,
//     smsNotification: false,
//     reminderDaysBefore: 1,
//     notes: ''
//   });

//   // Example: Fetch the customer data on page load to populate the form (optional)
//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       const response = await fetch('/api/v1/customer/data');  // Modify to your actual API route to get customer data
//       if (response.ok) {
//         const data = await response.json();
//         setFormData(data);  // Set the form data to the current customer data
//       }
//     };

//     fetchCustomerData();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prevState) => ({
//       ...prevState,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch(`/api/v1/customer/update/${formData._id}`, {
//         method: 'PUT',
//         body: JSON.stringify(formData),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update customer details');
//       }

//       toast.success('Customer details updated successfully!');
//       router.push('/profile');  // Redirect to the profile page after update
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <CustomerLayout>
//       <div className="max-w-7xl mx-auto p-4">
//         <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Address Fields */}
//           <div>
//             <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
//             <input
//               type="text"
//               id="street"
//               name="street"
//               value={formData.street}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div>
//             <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
//             <input
//               type="text"
//               id="city"
//               name="city"
//               value={formData.city}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div>
//             <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
//             <input
//               type="text"
//               id="state"
//               name="state"
//               value={formData.state}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div>
//             <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
//             <input
//               type="text"
//               id="zipCode"
//               name="zipCode"
//               value={formData.zipCode}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           <div>
//             <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
//             <input
//               type="text"
//               id="country"
//               name="country"
//               value={formData.country}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Property Details */}
//           <div>
//             <label htmlFor="size" className="block text-sm font-medium text-gray-700">Property Size (sq ft)</label>
//             <input
//               type="number"
//               id="size"
//               name="size"
//               value={formData.size}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Service Preferences */}
//           <div>
//             <label htmlFor="preferredDays" className="block text-sm font-medium text-gray-700">Preferred Days</label>
//             <select
//               multiple
//               name="preferredDays"
//               id="preferredDays"
//               value={formData.preferredDays}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             >
//               {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
//                 <option key={day} value={day}>{day}</option>
//               ))}
//             </select>
//           </div>

//           {/* Notification Preferences */}
//           <div>
//             <label htmlFor="emailNotification" className="block text-sm font-medium text-gray-700">Email Notifications</label>
//             <input
//               type="checkbox"
//               id="emailNotification"
//               name="emailNotification"
//               checked={formData.emailNotification}
//               onChange={handleChange}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label htmlFor="smsNotification" className="block text-sm font-medium text-gray-700">SMS Notifications</label>
//             <input
//               type="checkbox"
//               id="smsNotification"
//               name="smsNotification"
//               checked={formData.smsNotification}
//               onChange={handleChange}
//               className="mt-1"
//             />
//           </div>

//           <div>
//             <label htmlFor="reminderDaysBefore" className="block text-sm font-medium text-gray-700">Reminder Days Before</label>
//             <input
//               type="number"
//               id="reminderDaysBefore"
//               name="reminderDaysBefore"
//               value={formData.reminderDaysBefore}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//           </div>

//           {/* Notes */}
//           <div>
//             <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
//             <textarea
//               id="notes"
//               name="notes"
//               value={formData.notes}
//               onChange={handleChange}
//               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
//             ></textarea>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
//           >
//             Save Changes
//           </button>
//         </form>
//       </div>
//     </CustomerLayout>
//   );
// }

// import React from 'react'

// export default function SettingsPage() {
//   return (
//     <div>
//       <h1>Settings Page</h1>
//     </div>
//   )
// }





"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import CustomerLayout from "../../../components/customer/CustomerLayout";
import axios from "axios";

import {
  User,
  Mail,
  Lock,
  Phone,
  Home,
  Globe,
  Bell,
  BellOff,
  CreditCard,
  Shield,
  LogOut,
  CheckCircle,
  XCircle
} from "lucide-react";

const Settings = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Apt 4B',
    city: 'New York',
    country: 'United States',
    notifications: true,
    twoFactor: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getToken = () => {
    return localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    
    try {
      // Simulate API call
      await axios.put('http://localhost:5000/api/v1/users/update-profile', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    router.push('/login');
  };

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
            <p className="mt-1 text-sm text-gray-600">Manage your profile, security, and preferences</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${activeTab === 'profile' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <User className="mr-3 h-5 w-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${activeTab === 'security' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${activeTab === 'notifications' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium ${activeTab === 'billing' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  Billing
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {successMessage && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="ml-3 text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex items-center">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <p className="ml-3 text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
                  <p className="mt-1 text-sm text-gray-600">Update your personal details</p>
                </div>
                <div className="px-6 py-5">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full name
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'} rounded-md shadow-sm`}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'} rounded-md shadow-sm`}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'} rounded-md shadow-sm`}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                          Address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Home className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="address"
                            id="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'} rounded-md shadow-sm`}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="city"
                            id="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`block w-full pl-3 pr-3 py-2 border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'} rounded-md shadow-sm`}
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Globe className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="country"
                            id="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`block w-full pl-10 pr-3 py-2 border ${isEditing ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' : 'border-transparent bg-gray-50'} rounded-md shadow-sm`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                      {!isEditing ? (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setSuccessMessage('');
                              setErrorMessage('');
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Save Changes
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                  <p className="mt-1 text-sm text-gray-600">Manage your account security</p>
                </div>
                <div className="px-6 py-5 divide-y divide-gray-200">
                  <div className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-500">Update your account password</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                  <div className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs font-medium mr-3 px-2.5 py-0.5 rounded ${formData.twoFactor ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {formData.twoFactor ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({...prev, twoFactor: !prev.twoFactor}))}
                          className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${formData.twoFactor ? 'border-transparent bg-red-100 text-red-700 hover:bg-red-200' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                          {formData.twoFactor ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
                        <p className="text-sm text-gray-500">View and manage your active login sessions</p>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                  <p className="mt-1 text-sm text-gray-600">Manage how you receive notifications</p>
                </div>
                <div className="px-6 py-5">
                  <form>
                    <div className="space-y-5">
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            name="email-notifications"
                            type="checkbox"
                            checked={formData.notifications}
                            onChange={() => setFormData(prev => ({...prev, notifications: !prev.notifications}))}
                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="email-notifications" className="font-medium text-gray-700">
                            Email notifications
                          </label>
                          <p className="text-gray-500">Receive important updates via email</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="sms-notifications"
                            name="sms-notifications"
                            type="checkbox"
                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="sms-notifications" className="font-medium text-gray-700">
                            SMS notifications
                          </label>
                          <p className="text-gray-500">Get text message alerts for urgent matters</p>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="app-notifications"
                            name="app-notifications"
                            type="checkbox"
                            className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded"
                            defaultChecked
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="app-notifications" className="font-medium text-gray-700">
                            In-app notifications
                          </label>
                          <p className="text-gray-500">See notifications when logged into the platform</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="px-6 py-5 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
                  <p className="mt-1 text-sm text-gray-600">Manage your payment methods and billing history</p>
                </div>
                <div className="px-6 py-5 divide-y divide-gray-200">
                  <div className="py-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Methods</h4>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Visa ending in 4242</div>
                          <div className="text-sm text-gray-500">Expires 04/2025</div>
                        </div>
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Add Payment Method
                    </button>
                  </div>
                  <div className="py-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Billing History</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="relative px-3 py-2">
                              <span className="sr-only">Invoice</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              May 15, 2023
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                              Premium Service Package
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                              $89.00
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" className="text-green-600 hover:text-green-900">Download</a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                              Apr 15, 2023
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                              Standard Service Package
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-900">
                              $49.00
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-sm">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" className="text-green-600 hover:text-green-900">Download</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Settings;
