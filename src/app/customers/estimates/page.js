'use client';

import { useEffect, useState } from 'react';
import { Clock, Home, MapPin, DollarSign, Calendar, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import CustomerLayout from '../../../components/customer/CustomerLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import Link  from 'next/link';

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const { userData, isLoading } = useDashboard();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

 useEffect(() => {
  const fetchEstimates = async () => {
    if (!userData || !userData.token) {
      setErrorMsg('Unauthorized: No token found. Please log in.');
      setLoading(false);
      return;
    }

    const token = userData.token;

    try {
      const res = await fetch(`${API_URL}/estimates/my-estimates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setEstimates(data.data);
      } else {
        setErrorMsg(data.message || 'Failed to fetch estimates.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setErrorMsg('Something went wrong while fetching estimates.');
    } finally {
      setLoading(false);
    }
  };

  // Only fetch when userData is ready and not loading
  if (!isLoading) {
    fetchEstimates();
  }
}, [userData, isLoading]); // <-- Add these dependencies


  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <div className="bg-emerald-100 p-3 rounded-lg mr-4">
            <Home className="text-emerald-600" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Estimates</h1>
            <p className="text-gray-500">View all your property service estimates</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" size={32}></div>
            <p className="text-gray-600">Loading your estimates...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            </div>
          </div>
        ) : estimates.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 mb-4">
              <Home className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No estimates found</h3>
            <p className="text-gray-500 mb-6">You don't have any estimates yet.</p>
            {/* <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg bg-green-600 hover:bg-green-700 transition-colors">
              Request New Estimate
            </button> */}
           <Link href="/create-estimate">
  <motion.button 
    className="bg-white text-green-700 border border-green-600 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors duration-300 w-48"
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.98 }}
  >
    Request Estimate
  </motion.button>
</Link>
            {/* href="/create-estimate" */}
          </div>
        ) : (
          <div className="space-y-6">
            {estimates.map((estimate) => (
              <div key={estimate._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        <span className="bg-emerald-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                          #
                        </span>
                        Estimate {estimate.estimateNumber}
                      </h2>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="mr-1" size={14} />
                        <span>Created: {new Date(estimate.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(estimate.status)}`}>
                        {estimate.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Property Details */}
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h3 className="font-medium text-emerald-800 mb-3 flex items-center">
                        <Home className="mr-2" size={16} />
                        Property Details
                      </h3>
                      <ul className="space-y-2 text-sm">
                        <li className="flex">
                          <span className="text-gray-500 w-24">Size:</span>
                          <span className="text-gray-700 font-medium">{estimate.property?.size} sq ft</span>
                        </li>
                        {/* <li className="flex">
                          <span className="text-gray-500 w-24">Details:</span>
                          <span className="text-gray-700">{estimate.property?.details || 'N/A'}</span>
                        </li> */}
                        <li className="flex">
                          <span className="text-gray-500 w-24">Address:</span>
                          <div>
                            <p className="text-gray-700">{estimate.property?.address?.street}</p>
                            <p className="text-gray-700">{estimate.property?.address?.city}, {estimate.property?.address?.state} {estimate.property?.address?.zipCode}</p>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Budget & Other Info */}
                    <div className="space-y-4">
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <h3 className="font-medium text-emerald-800 mb-3 flex items-center">
                          <DollarSign className="mr-2" size={16} />
                          Budget Range
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Minimum</p>
                            <p className="text-lg font-bold text-emerald-600">${estimate.budget?.min}</p>
                          </div>
                          <div className="h-px bg-gray-200 flex-1 mx-4"></div>
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Maximum</p>
                            <p className="text-lg font-bold text-emerald-600">${estimate.budget?.max}</p>
                          </div>
                        </div>
                      </div>

                      {/* <div className="grid grid-cols-2 gap-4">
                        <div className="bg-emerald-50 rounded-lg p-4">
                          <h3 className="font-medium text-emerald-800 mb-1 text-sm flex items-center">
                            <CheckCircle className="mr-1" size={14} />
                            Deposit
                          </h3>
                          <p className="text-gray-700">
                            {estimate.deposit?.required ? 'Required' : 'Not Required'}
                          </p>
                        </div>

                        <div className="bg-emerald-50 rounded-lg p-4">
                          <h3 className="font-medium text-emerald-800 mb-1 text-sm flex items-center">
                            <MapPin className="mr-1" size={14} />
                            Access
                          </h3>
                          <p className="text-gray-700">
                            {estimate.accessInfo || 'Standard'}
                          </p>
                        </div>
                      </div> */}
                    </div>
                  </div>

                  {/* Services Section */}
                  {estimate.services && estimate.services.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium text-emerald-800 mb-3 border-b pb-2">Requested Services</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {estimate.services.map((s) => (
                          <div key={s._id} className="border rounded-lg p-3 hover:bg-emerald-50 transition-colors">
                            <h4 className="font-medium text-gray-900">{s.service?.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{s.service?.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Quantity:{s.quantity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Photos Section */}
{estimate.photos && estimate.photos.length > 0 && (
  <div className="mt-6">
    <h3 className="font-medium text-emerald-800 mb-3 border-b pb-2">Photos</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {estimate.photos.map((photo) => (
        <div key={photo._id} className="rounded overflow-hidden shadow-sm border border-gray-200">
          <img
            src={photo.url}
            alt={photo.caption || "Estimate photo"}
            className="w-full h-32 object-cover"
          />
          {photo.caption && (
            <p className="text-xs text-gray-500 p-1">{photo.caption}</p>
          )}
        </div>
      ))}
    </div>
  </div>
)}


                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                    {/* <button
    onClick={() => router.push(`/customers/estimates/${estimate._id}`)}
    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
  >
    View Full Details
  </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}