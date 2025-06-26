'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import PageHeader from '@/components/layout/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';

const GalleryPage = () => {
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      try {
        const response = await axios.get(`${API_URL}/appointments?status=Completed`);
        const projectsWithPhotos = response.data.data.filter(
          appointment =>
            (appointment.photos?.beforeService?.length > 0 ||
             appointment.photos?.afterService?.length > 0)
        ).map(appointment => ({
          id: appointment._id,
          title: appointment.service?.name || 'Landscaping Project',
          category: appointment.service?.category || 'Landscaping',
          date: new Date(appointment.date).toLocaleDateString(),
          beforePhotos: appointment.photos?.beforeService || [],
          afterPhotos: appointment.photos?.afterService || [],
          customer: appointment.customer,
          service: appointment.service,
          notes: appointment.notes,
          thumbnail: appointment.photos?.afterService?.[0]?.url ||
                     appointment.photos?.beforeService?.[0]?.url || ''
        }));
        setCompletedProjects(projectsWithPhotos);
      } catch (error) {
        console.error('Error fetching completed projects:', error);
        toast.error('Failed to load gallery projects');
      } finally {
        setLoading(false);
      }
    };
    fetchCompletedAppointments();
  }, []);

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    // Restore body scrolling when modal is closed
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
        <Container>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-12"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-gray-600 font-medium text-lg"
              >
                Loading our beautiful transformations...
              </motion.p>
            </div>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white pb-24">
      <PageHeader
        title="Transformation Gallery"
        description="Explore our portfolio of beautiful landscapes and outdoor transformations"
        backgroundImage="/images/services-header.jpg"
      />
      <Container>
        {/* View Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8 py-5 flex-wrap gap-4"
        >
          <p className="text-gray-700">
            <span className="font-semibold">{completedProjects.length}</span> completed projects
          </p>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} transition-colors duration-300`}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'} transition-colors duration-300`}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </motion.div>

        {completedProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm"
          >
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No projects to display yet</h3>
            <p className="text-gray-500">Completed projects with photos will appear here</p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {completedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", transition: { duration: 0.2 } }}
                onClick={() => openProjectDetails(project)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Overlay Elements */}
                  <div className="absolute top-0 left-0 w-full h-full">
                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between">
                      <span className="px-2.5 py-1 bg-white bg-opacity-90 rounded-md text-xs font-medium text-green-700 shadow-sm backdrop-blur-sm">
                        {project.service?.category || project.category}
                      </span>
                      <span className="px-2.5 py-1 bg-green-50 bg-opacity-95 rounded-md text-xs font-medium text-green-800 shadow-sm backdrop-blur-sm">
                        {project.beforePhotos.length + project.afterPhotos.length} Photos
                      </span>
                    </div>
                    
                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent"></div>
                    
                    {/* B&A Indicator */}
                    <div className="absolute bottom-3 left-3 flex space-x-3">
                      {project.beforePhotos.length > 0 && (
                        <div className="flex items-center space-x-1 bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
                          <span className="text-xs text-white">Before: {project.beforePhotos.length}</span>
                        </div>
                      )}
                      {project.afterPhotos.length > 0 && (
                        <div className="flex items-center space-x-1 bg-black/40 rounded-full px-2 py-0.5 backdrop-blur-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400"></span>
                          <span className="text-xs text-white">After: {project.afterPhotos.length}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Card Content */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{project.service?.name || project.title}</h3>
                  
                  <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {project.date}
                    </span>
                    <span className="text-sm font-medium text-green-600 flex items-center group">
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {completedProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)", transition: { duration: 0.2 } }}
                className="bg-white rounded-xl shadow overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => openProjectDetails(project)}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 lg:w-1/4">
                    <div className="aspect-video bg-gray-100 h-full overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-green-50">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-5 md:w-2/3 lg:w-3/4 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                          <span className="text-xs font-medium text-green-600 uppercase tracking-wider">
                            {project.service?.category || project.category}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{project.date}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{project.service?.name || project.title}</h3>
                      </div>
                    </div>
                    
                    {project.notes?.professional && (
                      <p className="text-gray-600 line-clamp-2 mt-2 mb-3">{project.notes.professional}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-auto pt-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{project.beforePhotos.length + project.afterPhotos.length} Photos</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          {project.beforePhotos.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></span>
                              Before
                            </span>
                          )}
                          {project.afterPhotos.length > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5"></span>
                              After
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-green-600 text-sm font-medium hover:text-green-700 group flex items-center">
                        View Details 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80 overflow-y-auto"
              onClick={closeProjectDetails}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, type: "spring", damping: 25 }}
                className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-white z-10 border-b border-gray-100 flex justify-between items-center p-4 backdrop-blur-sm bg-white/90">
                  <h2 className="text-xl font-bold">{selectedProject.title}</h2>
                  <button
                    onClick={closeProjectDetails}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                      <span className="text-sm font-medium text-green-600 uppercase tracking-wider">
                        {selectedProject.service?.category || selectedProject.category}
                      </span>
                    </div>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium">
                      {selectedProject.service?.name || selectedProject.title} • {selectedProject.date}
                    </div>
                  </div>

                  {/* Before & After Sections */}
                  <div className="space-y-8">
                    {/* Only show Before section if there are photos */}
                    {selectedProject.beforePhotos.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Before
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedProject.beforePhotos.map((photo, index) => (
                            <motion.div 
                              key={`before-${index}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1, duration: 0.4 }}
                              className="relative overflow-hidden rounded-lg shadow-sm group"
                            >
                              <div className="aspect-video bg-gray-100">
                                <img
                                  src={photo.url}
                                  alt={`Before ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                              </div>
                              {photo.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm text-white text-sm p-2 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                  {photo.caption}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {selectedProject.afterPhotos.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          After
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedProject.afterPhotos.map((photo, index) => (
                            <motion.div 
                              key={`after-${index}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
                              className="relative overflow-hidden rounded-lg shadow-sm group"
                            >
                              <div className="aspect-video bg-gray-100">
                                <img
                                  src={photo.url}
                                  alt={`After ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                              </div>
                              {photo.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-sm text-white text-sm p-2 text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                  {photo.caption}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {selectedProject.notes?.professional && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="mt-8 p-5 bg-green-50 rounded-lg border border-green-100"
                    >
                      <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                        </svg>
                        Project Notes
                      </h3>
                      <p className="text-gray-700 leading-relaxed">{selectedProject.notes.professional}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </div>
  );
};

export default GalleryPage;