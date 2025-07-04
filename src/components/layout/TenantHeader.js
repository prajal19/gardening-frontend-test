'use client';

import React, { useState, useRef, useEffect } from 'react';
import {usePathname, useRouter } from 'next/navigation';
import { useTenant } from '../../contexts/TenantContext';
import { useDashboard } from '../../contexts/DashboardContext';
import Link from 'next/link';
import { 
  User, LogOut, Settings, ChevronDown, ChevronRight 
} from 'lucide-react';

export default function TenantHeader() {
  const { tenantConfig, isLoading, error, isClient } = useTenant();
  const { userData, logout } = useDashboard();
    const [scrolled, setScrolled] = useState(false);
     const pathname = usePathname();
     const router = useRouter();
     const [activeNavItem, setActiveNavItem] = useState('/');
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

   useEffect(() => {
    setActiveNavItem(pathname);
    
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  // Helper function to get dashboard path based on role
  const getDashboardPath = (role) => {
    switch(role) {
      case 'admin':
        return '/admin';
      case 'professional':
        return '/professional';
      case 'customer':
        return '/customers';
        case 'tenantAdmin':
        return '/admin';
      default:
        return '/';
    }
  };



  const handleBookNowClick = (e) => {
    e.preventDefault();
    const token = userData?.token;
    const role = userData?.role || '';
    if (token && role === 'customer') {
      router.push('/booking');
    } else {
      router.push('/login?redirect=/booking');
    }
  };

  // Show loading state until client-side hydration is complete
  if (!isClient || isLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="animate-pulse bg-gray-200 h-8 w-48 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  if (error) {
    return (
      <header className="bg-red-50 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-red-800">
              <strong>Error:</strong> {error}
            </div>
            <Link 
              href={process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'http://localhost:3000'}
              className="text-red-600 hover:text-red-800 underline"
            >
              Go to Main Site
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // If no tenant config, show default header
  if (!tenantConfig) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Landscaping Services
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/services" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Services
              </Link>
              <Link 
                href="/gallery" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Gallery
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </Link>
            </nav>

 
           
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              {/* <Link
                href="/signup"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Up
              </Link> */}

<div className="hidden md:block">
  <button
    onClick={handleBookNowClick}
    className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
  >
    Book Now
  </button>
</div>
              

              
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Tenant Branding */}
          <div className="flex items-center space-x-4">
            {tenantConfig?.logo && (
              <img 
                src={tenantConfig.logo} 
                alt={`${tenantConfig.name} logo`}
                className="h-8 w-auto"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {tenantConfig?.name || 'Landscaping Services'}
              </h1>
              {tenantConfig?.businessPhone && (
                <p className="text-sm text-gray-500">
                  {tenantConfig.businessPhone}
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Services
            </Link>
            <Link 
              href="/gallery" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Gallery
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>
          </nav>




          {/* <div className="hidden md:block">
                <button
                  onClick={handleBookNowClick}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    scrolled || pathname !== '/' 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-white text-green-700 hover:bg-green-50'
                  }`}
                >
                  Book Now
                </button>
              </div> */}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
           <div className="hidden md:block">
  <button
    onClick={handleBookNowClick}
    className="px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
  >
    Book Now
  </button>
</div>
            {userData ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none p-2 rounded-full hover:bg-gray-100"
                  aria-label="Open user menu"
                >
                  {userData.profileImage ? (
                    <img 
                      src={userData.profileImage} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userData?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{userData.email || ''}</p>
                    </div>
                    
                    <div className="py-1">
                      <Link 
                        href={getDashboardPath(userData?.role)} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="w-4 h-4 mr-3 text-gray-500" />
                        Profile
                      </Link>
                      <Link 
                        href={`${getDashboardPath(userData?.role)}/settings`} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-500" />
                        Settings
                      </Link>
                      <div className="h-px bg-gray-100 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                

              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}