'use client';

import { useEffect, useState } from 'react';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  HardHat,
  ClipboardList,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import CustomerLayout from '../../../../components/customer/CustomerLayout';

export default function EstimateDetailPage({ params }) {
  const [estimate, setEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchEstimate = async () => {
      const token = localStorage.getItem('authToken');
      const { id } = params;

      if (!token) {
        setErrorMsg('Unauthorized: No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/api/v1/estimates/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setEstimate(data.data);
        } else {
          setErrorMsg(data.message || 'Failed to fetch estimate details.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setErrorMsg('Something went wrong while fetching estimate details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstimate();
  }, [params]);

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <CustomerLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Loading estimate details...</p>
        </div>
      </CustomerLayout>
    );
  }

  if (errorMsg) {
    return (
      <CustomerLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMsg}</p>
              </div>
            </div>
          </div>
          <Link href="/customers/estimates" className="mt-4 inline-flex items-center text-emerald-600 hover:text-emerald-800">
            <ArrowLeft className="mr-1" size={16} />
            Back to Estimates
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  if (!estimate) {
    return (
      <CustomerLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-50 mb-4">
              <ClipboardList className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Estimate not found</h3>
            <p className="text-gray-500 mb-6">The requested estimate could not be found.</p>
            <Link href="/customers/estimates" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center">
              <ArrowLeft className="mr-1" size={16} />
              Back to Estimates
            </Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/customers/estimates" className="inline-flex items-center text-emerald-600 hover:text-emerald-800">
            <ArrowLeft className="mr-1" size={16} />
            Back to Estimates
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Estimate Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="bg-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                    #
                  </span>
                  Estimate {estimate.estimateNumber}
                </h1>
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Calendar className="mr-1" size={14} />
                  <span>Created: {formatDate(estimate.createdAt)}</span>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(estimate.status)}`}>
                  {estimate.status}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Property and Customer Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Property Details */}
              <div className="bg-emerald-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                  <Home className="mr-2" size={18} />
                  Property Details
                </h2>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="text-gray-500 w-32">Property Size:</span>
                    <span className="text-gray-700 font-medium">{estimate.property?.size} sq ft</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Details:</span>
                    <span className="text-gray-700">{estimate.property?.details || 'N/A'}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="text-gray-500 w-32">Address:</span>
                    <div>
                      <p className="text-gray-700">{estimate.property?.address?.street}</p>
                      <p className="text-gray-700">{estimate.property?.address?.city}, {estimate.property?.address?.state}</p>
                      <p className="text-gray-700">{estimate.property?.address?.zipCode}</p>
                    </div>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Access Info:</span>
                    <span className="text-gray-700">{estimate.accessInfo || 'Standard access'}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2" size={18} />
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="text-gray-500 w-32">Name:</span>
                    <span className="text-gray-700 font-medium">{estimate.customer?.user?.name || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Email:</span>
                    <span className="text-gray-700">{estimate.customer?.user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-32">Phone:</span>
                    <span className="text-gray-700">{estimate.customer?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget and Deposit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* <div className="bg-emerald-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center">
                  <DollarSign className="mr-2" size={18} />
                  Budget Information
                </h2>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Minimum Budget</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">₹{estimate.budget?.min}</p>
                  </div>
                  <div className="h-px bg-gray-200 flex-1 mx-4"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Maximum Budget</p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">₹{estimate.budget?.max}</p>
                  </div>
                </div>
              </div> */}
{/* 
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="mr-2" size={18} />
                  Deposit Information
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-700">
                      <span className="font-medium">Deposit Required:</span> {estimate.deposit?.required ? 'Yes' : 'No'}
                    </p>
                    {estimate.deposit?.required && (
                      <p className="text-gray-700 mt-1">
                        <span className="font-medium">Amount:</span> ₹{estimate.deposit?.amount || 'To be determined'}
                      </p>
                    )}
                  </div>
                </div>
              </div> */}
            </div>

            {/* Services Section */}
            {estimate.services && estimate.services.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <HardHat className="mr-2" size={18} />
                  Requested Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {estimate.services.map((service) => (
                    <div key={service._id} className="border rounded-lg p-4 hover:bg-emerald-50 transition-colors">
                      <h3 className="font-medium text-gray-900">{service.service?.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{service.service?.description}</p>
                      <div className="mt-3 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Base Price:</span> ₹{service.service?.basePrice || 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Section */}
            {estimate.notes && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{estimate.notes}</p>
                </div>
              </div>
            )}

            {/* Timeline Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Estimate Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600">
                      <Calendar size={16} />
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">Estimate Created</h3>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(estimate.createdAt)}</p>
                    </div>
                  </div>

                  {estimate.updatedAt && (
                    <div className="relative pl-10">
                      <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
                        <Clock size={16} />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="font-medium text-gray-900">Last Updated</h3>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(estimate.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                Download PDF
              </button>
              {/* <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                Approve Estimate
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}