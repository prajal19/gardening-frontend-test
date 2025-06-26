'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Calendar, ChevronLeft, Layers, User, Grid } from 'lucide-react';

const ProjectPage = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('before-after');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const params = useParams();
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointments/${params.id}`);
        const appointment = response.data.data;

        if (!appointment || appointment.status !== 'Completed') {
          toast.error('Project not found');
          return;
        }

        setProject({
          id: appointment._id,
          title: appointment.service?.name || 'Landscaping Project',
          category: appointment.service?.category || 'Landscaping',
          date: new Date(appointment.date).toLocaleDateString(),
          beforePhotos: appointment.photos?.beforeService || [],
          afterPhotos: appointment.photos?.afterService || [],
          customer: appointment.customer,
          service: appointment.service,
          notes: appointment.notes
        });
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-6 text-green-800 font-medium text-lg">Loading your beautiful landscape project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-green-50 py-12">
        <Container>
          <div className="text-center max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Project Not Found</h1>
            <p className="text-gray-600 mb-6">We couldn't find the landscape project you're looking for.</p>
            <Link href="/gallery">
              <span className="inline-block bg-green-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Browse Our Gallery
              </span>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <Container>
        <div className="max-w-5xl mx-auto">
          <Link href="/gallery">
            <span className="inline-flex items-center text-green-700 hover:text-green-800 font-medium mb-6 group">
              <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Project Gallery
            </span>
          </Link>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 bg-gradient-to-r from-green-800 to-green-600 overflow-hidden">
              {project.afterPhotos.length > 0 && (
                <div className="absolute inset-0">
                  <img 
                    src={project.afterPhotos[0].url} 
                    alt={project.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 p-6 md:p-8">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {project.date}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-sm">{project.title}</h1>
                {project.customer && (
                  <p className="text-green-100 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Client: {project.customer.firstName} {project.customer.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveTab('before-after')}
                  className={`px-4 py-4 font-medium text-sm md:text-base flex items-center whitespace-nowrap ${
                    activeTab === 'before-after'
                      ? 'text-green-700 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Before & After
                </button>
                {project.notes?.professional && (
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-4 font-medium text-sm md:text-base flex items-center whitespace-nowrap ${
                      activeTab === 'details'
                        ? 'text-green-700 border-b-2 border-green-600'
                        : 'text-gray-500 hover:text-green-600'
                    }`}
                  >
                    <Leaf className="w-4 h-4 mr-2" />
                    Project Details
                  </button>
                )}
                {(project.service?.features?.length > 0 || project.service?.description) && (
                  <button
                    onClick={() => setActiveTab('services')}
                    className={`px-4 py-4 font-medium text-sm md:text-base flex items-center whitespace-nowrap ${
                      activeTab === 'services'
                        ? 'text-green-700 border-b-2 border-green-600'
                        : 'text-gray-500 hover:text-green-600'
                    }`}
                  >
                    <Grid className="w-4 h-4 mr-2" />
                    Services Performed
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {/* Before & After Tab */}
              {activeTab === 'before-after' && (
                <div className="space-y-12">
                  {/* Before Section */}
                  {project.beforePhotos.length > 0 && (
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                          <span className="text-amber-700 font-bold text-sm">1</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Before</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {project.beforePhotos.map((photo, index) => (
                          <div 
                            key={`before-${index}`} 
                            className="group relative cursor-pointer"
                            onClick={() => handlePhotoClick(photo)}
                          >
                            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-md">
                              <img
                                src={photo.url}
                                alt={`Before ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/80 rounded-full p-2">
                                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {photo.caption && (
                              <p className="text-sm text-gray-600 mt-3 font-medium">{photo.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* After Section */}
                  {project.afterPhotos.length > 0 && (
                    <div>
                      <div className="flex items-center mb-6">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <span className="text-green-700 font-bold text-sm">2</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">After</h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {project.afterPhotos.map((photo, index) => (
                          <div 
                            key={`after-${index}`} 
                            className="group relative cursor-pointer"
                            onClick={() => handlePhotoClick(photo)}
                          >
                            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-md">
                              <img
                                src={photo.url}
                                alt={`After ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity"></div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-white/80 rounded-full p-2">
                                  <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                            {photo.caption && (
                              <p className="text-sm text-gray-600 mt-3 font-medium">{photo.caption}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Photos Message */}
                  {project.beforePhotos.length === 0 && project.afterPhotos.length === 0 && (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Photos Available</h3>
                      <p className="text-gray-500">Photos for this project will be coming soon.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Project Details Tab */}
              {activeTab === 'details' && project.notes?.professional && (
                <div className="prose prose-green max-w-none">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-100 mb-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center">
                      <Leaf className="w-6 h-6 mr-2" />
                      Project Overview
                    </h2>
                    <div className="text-gray-700 whitespace-pre-line">{project.notes.professional}</div>
                  </div>
                  
                  {/* Call to action */}
                  <div className="bg-gradient-to-r from-green-700 to-green-600 text-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-3">Interested in a similar transformation?</h3>
                    <p className="mb-4">We'd love to help bring your landscaping vision to life.</p>
                    <Link href="/contact">
                      <span className="inline-block bg-white text-green-700 font-medium px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
                        Get Your Free Quote
                      </span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Services Tab */}
              {activeTab === 'services' && (
                <div>
                  {project.service?.description && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Service</h2>
                      <p className="text-gray-700">{project.service.description}</p>
                    </div>
                  )}
                  
                  {project.service?.features?.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Features</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.service.features.map((feature, index) => (
                          <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg">
                            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{feature.name}</h3>
                              {feature.description && (
                                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(!project.service?.features || project.service.features.length === 0) && 
                   !project.service?.description && (
                    <div className="text-center py-16">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No Service Details Available</h3>
                      <p className="text-gray-500">Additional information about this service will be added soon.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <Leaf className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-600">Premium Landscaping Services</span>
                </div>
                <div className="flex space-x-4">
                  <Link href="/contact">
                    <span className="text-green-600 hover:text-green-700 font-medium">
                      Contact Us
                    </span>
                  </Link>
                  <Link href="/services">
                    <span className="text-green-600 hover:text-green-700 font-medium">
                      Our Services
                    </span>
                  </Link>
                  <Link href="/gallery">
                    <span className="text-green-600 hover:text-green-700 font-medium">
                      Project Gallery
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-80 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.caption || "Project photo"} 
                className="w-full max-h-[80vh] object-contain"
              />
              {selectedPhoto.caption && (
                <div className="p-4 bg-white">
                  <p className="text-gray-700 font-medium">{selectedPhoto.caption}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPage;