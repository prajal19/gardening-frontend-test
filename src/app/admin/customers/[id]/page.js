'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Button from '../../../../components/ui/Button';
import { useDashboard } from '@/contexts/DashboardContext';
import { motion } from 'framer-motion';
import Link from 'next/link';


const CustomerDetailsPage = ({ params }) => {
  const { id } = params;
  const { userData } = useDashboard();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        if (!userData?.token) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${API_URL}/customers/${id}`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch customer');
        }

        const data = await response.json();
        console.log(data)
        setCustomer(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, userData?.token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="mt-4"
            onClick={() => router.push('/admin/customers')}
          >
            Back to Customers
          </Button>
        </div>
      </AdminLayout>
    );
  }

  if (!customer) {
    return (
      <AdminLayout>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">Customer not found</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="mt-4"
            onClick={() => router.push('/admin/customers')}
          >
            Back to Customers
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Details</h1>
          <p className="text-gray-600 mt-1">View and manage customer information</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <Button 
            variant="secondary"
            onClick={() => router.push('/admin/customers')}
          >
            Back to Customers
          </Button>
          <Link href={`/admin/customers/${id}/edit`}>
            <Button variant="primary">
              Edit Customer
            </Button>
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow overflow-hidden rounded-lg"
      >
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-2xl font-medium text-emerald-800">
                {customer.user?.name?.charAt(0) || '?'}
              </span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {customer.user?.name || 'No name'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Customer since: {new Date(customer.customerSince).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {/* Basic Info */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.user?.email || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{customer.user?.phone || 'N/A'}</dd>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Address</h4>
              {customer.address ? (
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Street</dt>
                    <dd className="mt-1 text-sm text-gray-900">{customer.address?.street}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City/State/Zip</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Country</dt>
                    <dd className="mt-1 text-sm text-gray-900">{customer.address.country}</dd>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No address information available</p>
              )}
            </div>

            {/* Property Details */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Property Details</h4>
              {customer.propertyDetails ? (
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Size (sq ft)</dt>
                    <dd className="mt-1 text-sm text-gray-900">{customer.propertyDetails.size || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Features</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <ul className="list-disc pl-5">
                        {customer.propertyDetails.features?.hasFrontYard && <li>Front yard</li>}
                        {customer.propertyDetails.features?.hasBackYard && <li>Back yard</li>}
                        {customer.propertyDetails.features?.hasTrees && <li>Trees</li>}
                        {customer.propertyDetails.features?.hasGarden && <li>Garden</li>}
                        {customer.propertyDetails.features?.hasSprinklerSystem && <li>Sprinkler system</li>}
                      </ul>
                    </dd>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No property details available</p>
              )}
            </div>

            {/* Preferences */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Preferences</h4>
              {customer.servicePreferences || customer.notificationPreferences ? (
                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Preferred Time</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {customer.servicePreferences?.preferredTimeOfDay || 'Any'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Notification Preferences</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {customer.notificationPreferences?.email && 'Email '}
                      {customer.notificationPreferences?.sms && 'SMS'}
                      {!customer.notificationPreferences?.email && !customer.notificationPreferences?.sms && 'None'}
                    </dd>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No preference information available</p>
              )}
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Appointments</h4>
          {customer.appointments?.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customer.appointments.map((appointment) => (
                    <tr key={appointment._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {appointment.service?.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No appointments found</p>
          )}
        </div>

{/*Estimates Section */}
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Estimates</h4>
          {customer.estimates?.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estimate Number
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {customer.estimates.map((estimate) => (
                    <tr key={estimate._id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {(estimate.estimateNumber).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {estimate.service?.name || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          estimate.status === 'completed' ? 'bg-green-100 text-green-800' :
                          estimate.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {estimate.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No estimates found</p>
          )}
        </div>


      </motion.div>
    </AdminLayout>
  );
};

export default CustomerDetailsPage;