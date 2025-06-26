'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, UserCircle, Menu, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import SuperAdminThemeToggle from './SuperAdminThemeToggle';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDashboard } from '@/contexts/DashboardContext';

const SuperAdminTopbar = ({ onMenuClick }) => {
  const router = useRouter();
  const { userData, logout } = useDashboard();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    router.push('/login');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <button className="lg:hidden mr-4" onClick={onMenuClick}>
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="search" 
            placeholder="Search tenants, settings..." 
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-64 md:w-96 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <SuperAdminThemeToggle />
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <Bell size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="flex items-center space-x-1 focus:outline-none p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Open user menu"
          >
            {userData?.profileImage ? (
              <img 
                src={userData.profileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                <UserCircle size={24} />
              </div>
            )}
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-10 border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userData?.name || 'Super Admin'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userData?.email || 'superadmin@example.com'}
                </p>
              </div>
              
              <div className="py-1">
                <Link 
                  href="/super-admin" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                  Profile
                </Link>
                
                <Link 
                  href="/admin/settings" 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4 mr-3 text-gray-500 dark:text-gray-400" />
                  Settings
                </Link>
                <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SuperAdminTopbar;