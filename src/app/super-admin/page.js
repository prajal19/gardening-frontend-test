'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboard } from '../../contexts/DashboardContext';
import DashboardStats from '../../components/admin/DashboardStats';
import TenantManagement from '../../components/admin/TenantManagement';
import SystemSettings from '../../components/admin/SystemSettings';
import ActivityLogs from '../../components/admin/ActivityLogs';
import BillingManagement from '../../components/admin/BillingManagement';
import UserManagement from '../../components/admin/UserManagement';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiDollarSign, 
  FiDatabase, 
  FiActivity, 
  FiMenu,
  FiX
} from 'react-icons/fi';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { userData, isLoading } = useDashboard();

  useEffect(() => {
    if (!isLoading && (!userData || userData.role !== 'superAdmin')) {
      router.push('/login');
    }
  }, [userData, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userData || userData.role !== 'superAdmin') {
    return null;
  }

  // Render dashboard stats by default
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <DashboardStats />
    </div>
  );
}