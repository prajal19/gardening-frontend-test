'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import GalleryManager from '../../../components/admin/GalleryManager';

export default function GalleryPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Gallery Management</h1>
        </div>
        <GalleryManager />
      </div>
    </AdminLayout>
  );
} 