'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTenant } from '../../contexts/TenantContext';
import apiClient from '../../lib/api/apiClient';

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { tenant, getTenantApiClient } = useTenant();

  useEffect(() => {
    const fetchActiveAnnouncement = async () => {
      try {
        console.log('🔍 Fetching announcement for tenant:', tenant?.subdomain);
        // Use tenant-specific API client
        const tenantApiClient = getTenantApiClient();
        const response = await tenantApiClient.get('/announcements/active');
        
        console.log('📢 Announcement response:', response.data);
        
        if (response.data?.data) {
          setAnnouncement(response.data.data);
          setTimeout(() => {
            setIsVisible(true);
          }, 300);
          
          if (response.data.data.displayDuration) {
            setTimeout(() => {
              handleDismiss();
            }, response.data.data.displayDuration * 1000);
          }
        } else {
          console.log('❌ No active announcement found');
        }
      } catch (error) {
        console.error('❌ Error fetching announcement:', error);
      }
    };

    // Only fetch if we have a tenant context
    if (tenant) {
      fetchActiveAnnouncement();
    } else {
      console.log('⚠️ No tenant context available');
    }
  }, [tenant, getTenantApiClient]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 10000);
    setIsVisible(false);
  };

  if (!announcement || !isVisible) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{announcement.title}</h3>
            <p className="text-sm opacity-90">{announcement.message}</p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-3 p-1 rounded-full hover:bg-green-500 transition-colors duration-200"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default AnnouncementBanner;