'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDashboard } from '@/contexts/DashboardContext';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

const HeroImagePage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState('/images/landscaping-image.png');
  const [isDeleting, setIsDeleting] = useState(false);
  const { userData } = useDashboard();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    fetchCurrentHeroImage();
  }, []);

  const fetchCurrentHeroImage = async () => {
    try {
      const response = await fetch(`${API_URL}/hero-image`);
      const data = await response.json();
      if (data.success && data.data?.url) {
        setCurrentImage(data.data.url);
      }
    } catch (error) {
      console.error('Error fetching hero image:', error);
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

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/hero-image`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.url) {
          setCurrentImage(data.data.url);
          toast.success('Hero image updated successfully');
          setSelectedFile(null);
          setPreview(null);
        } else {
          toast.error('Failed to update hero image');
        }
      } else {
        toast.error('Failed to update hero image');
      }
    } catch (error) {
      console.error('Error uploading hero image:', error);
      toast.error('Error uploading hero image');
    }
  };

  const handleDelete = () => {
    if (currentImage === '/images/landscaping-image.png') {
      toast.error('Cannot delete the default image');
      return;
    }

    const deleteToast = toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Trash2 className="h-10 w-10 text-red-600" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Delete Hero Image
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Are you sure you want to delete the current hero image? This will restore the default image.
                </p>
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  deleteImage();
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
      ),
      {
        duration: 5000,
        position: 'top-center',
      }
    );
  };

  const deleteImage = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`${API_URL}/hero-image`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentImage('/images/landscaping-image.png');
          toast.success('Hero image deleted successfully');
        } else {
          toast.error('Failed to delete hero image');
        }
      } else {
        toast.error('Failed to delete hero image');
      }
    } catch (error) {
      console.error('Error deleting hero image:', error);
      toast.error('Error deleting hero image');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Hero Image</h1>
        
        {/* Current Image Display */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">Current Hero Image</h2>
            {currentImage !== '/images/landscaping-image.png' && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {isDeleting ? 'Deleting...' : 'Delete Image'}
              </button>
            )}
          </div>
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Current Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Upload New Hero Image</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {preview ? (
                    <img src={preview} alt="Preview" className="max-h-48 object-contain" />
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={handleUpload}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default HeroImagePage; 