'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import { useTenant } from '@/contexts/TenantContext';
import { toast } from 'react-hot-toast';
import { Trash2, Image } from 'lucide-react';

const SettingsPage = () => {
  const { userData } = useDashboard();
  const [activeTab, setActiveTab] = useState('general');
  const { tenant, tenantConfig, isLoading: tenantLoading } = useTenant();
  const [isLoading, setIsLoading] = useState(true);
  
  // Tenant Info State
  const [tenantInfo, setTenantInfo] = useState({
    name: '',
    subdomain: '',
    email: '',
    phone: '',
    address: '',
    owner: null,
    settings: {
      logo: '',
      themeColor: '',
      timezone: 'UTC'
    },
    subscription: {
      plan: 'none',
      status: 'trialing',
      startDate: '',
      endDate: ''
    }
  });

  // Hero Image State
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('/images/landscaping-image.png');
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Logo State
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [currentLogo, setCurrentLogo] = useState('');
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [isLogoDeleting, setIsLogoDeleting] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  // Fetch data on component mount
  useEffect(() => {
    if (!tenantLoading) {
      fetchData();
    }
  }, [tenantLoading]);

  const fetchData = async () => {
    try {
      await Promise.all([
        fetchTenantInfo(),
        fetchCurrentHeroImage(),
        fetchCurrentLogo()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTenantInfo = async () => {
    try {
      if (!tenant?.subdomain) {
        throw new Error('Tenant context not available');
      }

      const response = await fetch(`${API_URL}/tenant/info`, {
        headers: {
          'X-Tenant-Subdomain': tenant.subdomain,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tenant info');
      }

      const data = await response.json();
      if (data.success) {
        setTenantInfo(prev => ({
          ...prev,
          name: data.data?.name || tenantConfig?.name || '',
          subdomain: data.data?.subdomain || tenant?.subdomain || '',
          email: data.data?.email || tenantConfig?.businessEmail || '',
          phone: data.data?.phone || tenantConfig?.businessPhone || '',
          address: data.data?.address || '',
          owner: data.data?.owner || null,
          settings: {
            logo: data.data?.settings?.logo || tenantConfig?.logo || '',
            themeColor: data.data?.settings?.themeColor || '',
            timezone: data.data?.settings?.timezone || 'UTC'
          },
          subscription: {
            plan: data.data?.subscription?.plan || 'none',
            status: data.data?.subscription?.status || 'trialing',
            startDate: data.data?.subscription?.startDate || '',
            endDate: data.data?.subscription?.endDate || ''
          }
        }));
        
        // Set current logo from tenant info
        if (data.data?.settings?.logo || tenantConfig?.logo) {
          setCurrentLogo(data.data?.settings?.logo || tenantConfig?.logo);
        }
      }
    } catch (error) {
      console.error('Error fetching tenant info:', error);
      throw error;
    }
  };

  const fetchCurrentHeroImage = async () => {
    try {
      const response = await fetch(`${API_URL}/hero-image`, {
        headers: {
          'X-Tenant-Subdomain': tenant?.subdomain || '',
          Authorization: `Bearer ${userData.token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data?.url) {
        setCurrentImage(data.data.url);
      }
    } catch (error) {
      console.error('Error fetching hero image:', error);
    }
  };

  const fetchCurrentLogo = async () => {
    try {
      // Logo is part of tenant info, so we don't need a separate API call
      // It's already handled in fetchTenantInfo
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const handleTenantInfoChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setTenantInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setTenantInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSaveTenantInfo = async () => {
    if (!tenant?.subdomain) {
      toast.error('Tenant context not available');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/tenant/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-Subdomain': tenant.subdomain,
          Authorization: `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          name: tenantInfo.name,
          email: tenantInfo.email,
          phone: tenantInfo.phone,
          address: tenantInfo.address,
          settings: tenantInfo.settings,
          subscription: tenantInfo.subscription
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save tenant info');
      }

      toast.success('Business information saved successfully');
      fetchTenantInfo();
    } catch (error) {
      console.error('Error saving tenant info:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageUpload = async () => {
    if (!tenant?.subdomain) {
      toast.error('Tenant context not available');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch(`${API_URL}/hero-image`, {
        method: 'PUT',
        headers: {
          'X-Tenant-Subdomain': tenant.subdomain,
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update hero image');
      }

      setCurrentImage(data.data.url);
      toast.success('Hero image updated successfully');
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Error uploading hero image:', error);
      toast.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteHeroImage = async () => {
    if (!tenant?.subdomain) {
      toast.error('Tenant context not available');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/hero-image`, {
        method: 'DELETE',
        headers: {
          'X-Tenant-Subdomain': tenant.subdomain,
          Authorization: `Bearer ${userData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete hero image');
      }

      setCurrentImage('/images/landscaping-image.png');
      toast.success('Hero image deleted successfully');
    } catch (error) {
      console.error('Error deleting hero image:', error);
      toast.error(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleHeroImageDelete = () => {
    if (currentImage === '/images/landscaping-image.png') {
      toast.error('Cannot delete the default image');
      return;
    }

    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <Trash2 className="h-10 w-10 text-red-600" />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Delete Hero Image</p>
              <p className="mt-1 text-sm text-gray-500">
                Are you sure you want to delete the current hero image? This will restore the default image.
              </p>
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                deleteHeroImage();
              }}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleLogoFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }

      setSelectedLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = async () => {
    if (!tenant?.subdomain) {
      toast.error('Tenant context not available');
      return;
    }

    if (!selectedLogoFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsLogoUploading(true);
    const formData = new FormData();
    formData.append('image', selectedLogoFile);

    try {
      const response = await fetch(`${API_URL}/logo`, {
        method: 'PUT',
        headers: {
          'X-Tenant-Subdomain': tenant.subdomain,
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update logo');
      }

      setCurrentLogo(data.data.url);
      toast.success('Logo updated successfully');
      setSelectedLogoFile(null);
      setLogoPreview(null);
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error(error.message);
    } finally {
      setIsLogoUploading(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!tenant?.subdomain) {
      toast.error('Tenant context not available');
      return;
    }

    setIsLogoDeleting(true);
    try {
      const response = await fetch(`${API_URL}/logo`, {
        method: 'DELETE',
        headers: {
          'X-Tenant-Subdomain': tenant.subdomain,
          Authorization: `Bearer ${userData.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete logo');
      }

      setCurrentLogo('');
      toast.success('Logo deleted successfully');
    } catch (error) {
      console.error('Error deleting logo:', error);
      toast.error(error.message);
    } finally {
      setIsLogoDeleting(false);
    }
  };

  if (isLoading || tenantLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!tenant?.subdomain) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Tenant Not Found</h3>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't identify your business context. Please check your URL or contact support.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Settings
            </h2>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Business Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={tenantInfo.name}
                    onChange={handleTenantInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
                    Subdomain
                  </label>
                  <input
                    type="text"
                    name="subdomain"
                    id="subdomain"
                    value={tenantInfo.subdomain}
                    onChange={handleTenantInfoChange}
                    disabled
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Business Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={tenantInfo.email}
                    onChange={handleTenantInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Business Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={tenantInfo.phone}
                    onChange={handleTenantInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={tenantInfo.address}
                    onChange={handleTenantInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="settings.themeColor" className="block text-sm font-medium text-gray-700">
                    Theme Color
                  </label>
                  <input
                    type="text"
                    name="settings.themeColor"
                    id="settings.themeColor"
                    value={tenantInfo.settings.themeColor}
                    onChange={handleTenantInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="settings.timezone" className="block text-sm font-medium text-gray-700">
                    Timezone
                  </label>
                  <select
                    name="settings.timezone"
                    id="settings.timezone"
                    value={tenantInfo.settings.timezone}
                    onChange={handleTenantInfoChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Asia/Kolkata">India Standard Time (IST)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveTenantInfo}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Hero Image</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update the hero image displayed on your website's homepage.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 w-full max-w-2xl">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 h-64 flex items-center justify-center">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <img src={currentImage} alt="Current Hero" className="w-full h-full object-cover" />
                  )}
                </div>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Image
                  </label>
                  <div className="flex items-center">
                    <label
                      htmlFor="hero-upload"
                      className="flex-1 cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Image className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Select Image
                      <input
                        id="hero-upload"
                        name="hero-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <button
                      onClick={handleHeroImageUpload}
                      disabled={!selectedFile || isUploading}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>

                <div>
                  <button
                    onClick={handleHeroImageDelete}
                    disabled={currentImage === '/images/landscaping-image.png' || isDeleting}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? 'Deleting...' : 'Delete Current Image'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Upload Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Business Logo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Update your business logo that appears in the header and throughout your website.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4 w-full max-w-md">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 h-32 flex items-center justify-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : currentLogo ? (
                    <img src={currentLogo} alt="Current Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <Image className="mx-auto h-12 w-12 mb-2" />
                      <p className="text-sm">No logo uploaded</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload New Logo
                  </label>
                  <div className="flex items-center">
                    <label
                      htmlFor="logo-upload"
                      className="flex-1 cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <Image className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                      Select Logo
                      <input
                        id="logo-upload"
                        name="logo-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleLogoFileSelect}
                      />
                    </label>
                    <button
                      onClick={handleLogoUpload}
                      disabled={!selectedLogoFile || isLogoUploading}
                      className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLogoUploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG, SVG up to 2MB. Recommended size: 200x200px
                  </p>
                </div>

                {currentLogo && (
                  <div>
                    <button
                      onClick={handleLogoDelete}
                      disabled={isLogoDeleting}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      {isLogoDeleting ? 'Deleting...' : 'Delete Current Logo'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;