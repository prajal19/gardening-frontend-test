'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit3, BarChart2, Users, HardDrive, FileText, DollarSign, ShieldCheck, AlertTriangle } from 'lucide-react';
import apiClient from '../../../../lib/api/apiClient';

const StatCard = ({ title, value, icon: Icon, subValue, bgColor = 'bg-white dark:bg-gray-800' }) => (
  <div className={`p-4 rounded-lg shadow-md ${bgColor}`}>
    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
      {Icon && <Icon size={18} className="mr-2" />} 
      <h3 className="text-sm font-medium">{title}</h3>
    </div>
    <p className="text-2xl font-semibold text-gray-800 dark:text-white">{value}</p>
    {subValue && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subValue}</p>}
  </div>
);

const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
                ${isActive 
                  ? 'bg-green-500 text-white dark:bg-green-600'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
  >
    {label}
  </button>
);

export default function TenantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId;
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);

    useEffect(() => {
    if (tenantId) {
      const fetchTenant = async () => {
        try {
          setLoading(true);
          const response = await apiClient.get(`/super-admin/tenants/${tenantId}`);
          setTenant(response.data.data);
        } catch (error) {
          console.error('Error fetching tenant:', error);
          setError('Failed to load tenant details');
        } finally {
          setLoading(false);
        }
      };

      fetchTenant();
    }
  }, [tenantId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  if (!tenant) {
    return (
      <div className="text-center py-10">
        <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Tenant Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The tenant with ID '{tenantId}' could not be found.</p>
        <Link href="/super-admin/tenants" legacyBehavior>
          <a className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg mx-auto w-fit">
            <ArrowLeft size={18} className="mr-2" /> Back to Tenant List
          </a>
        </Link>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Tenant Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
          <p className="text-gray-800 dark:text-white">{tenant.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
          <p className="text-gray-800 dark:text-white">{tenant.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-gray-800 dark:text-white">{tenant.isActive ? 'Active' : 'Inactive'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Subdomain</p>
          <p className="text-gray-800 dark:text-white">{tenant.subdomain || 'Not set'}</p>
        </div>
      </div>
    </div>
  );

  const renderUsageMetrics = () => (
    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Usage Metrics</h4>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Detailed usage metrics will be available here soon.</p>
    </div>
  );

  const renderUsers = () => (
    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">User Management</h4>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Tenant user management will be available here soon.</p>
    </div>
  );

  const renderStorage = () => (
    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Storage Details</h4>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Tenant storage information will be available here soon.</p>
    </div>
  );

  const renderPlanBilling = () => (
    <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Plan & Billing</h4>
      <p className="text-gray-500 dark:text-gray-400 mt-2">Tenant subscription and billing details will be available here soon.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <button 
            onClick={() => router.push('/super-admin/tenants')}
            className="mb-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Tenant List
          </button>
          <div className="flex items-center">
            {/* Assuming logoUrl may not exist yet */}
            {/* {tenant.logoUrl && <img src={tenant.logoUrl} alt={`${tenant.name} logo`} className="w-16 h-16 rounded-md mr-4 bg-gray-200 dark:bg-gray-700 object-contain"/>} */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{tenant.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">ID: {tenant._id}</p>
            </div>
          </div>
        </div>
                <Link href={`/super-admin/tenants/${tenant._id}/edit`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg text-sm">
            <Edit3 size={16} className="mr-2" /> Edit Tenant
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700 pb-2 mb-6">
        <TabButton label="Overview" isActive={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
        <TabButton label="Usage Metrics" isActive={activeTab === 'usage'} onClick={() => setActiveTab('usage')} />
        <TabButton label="Users" isActive={activeTab === 'users'} onClick={() => setActiveTab('users')} />
        <TabButton label="Storage" isActive={activeTab === 'storage'} onClick={() => setActiveTab('storage')} />
        <TabButton label="Plan & Billing" isActive={activeTab === 'billing'} onClick={() => setActiveTab('billing')} />
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-0 sm:p-2 rounded-lg">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'usage' && renderUsageMetrics()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'storage' && renderStorage()}
        {activeTab === 'billing' && renderPlanBilling()}
      </div>
    </div>
  );
}
