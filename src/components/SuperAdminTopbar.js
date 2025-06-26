'use client';

import React from 'react';
import { Search, Bell, UserCircle, Menu } from 'lucide-react';
import SuperAdminThemeToggle from './SuperAdminThemeToggle'; // Updated import path

const SuperAdminTopbar = ({ onMenuClick }) => {
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
        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          <UserCircle size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
};

export default SuperAdminTopbar;
