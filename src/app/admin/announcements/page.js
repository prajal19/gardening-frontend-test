'use client';

import React from 'react';
import AnnouncementManager from '../../../components/admin/AnnouncementManager';
import AdminLayout from '@/components/admin/AdminLayout';

const AnnouncementsPage = () => {
  return (
   <AdminLayout>
     <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Announcements</h1>
      <AnnouncementManager />
    </div>
   </AdminLayout>
  );
};

export default AnnouncementsPage; 