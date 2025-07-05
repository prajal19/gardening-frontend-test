// 'use client';

// import React, { useState, useEffect } from 'react';
// import apiClient from '../../lib/api/apiClient';
// import Button from '../ui/Button';
// import { useDashboard } from '../../contexts/DashboardContext';
// import { useTenant } from '../../contexts/TenantContext';

// const AnnouncementManager = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     message: '',
//     status: 'inactive',
//     displayDuration: 5
//   });
//   const [isEditing, setIsEditing] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const { userData } = useDashboard();
//   const { tenant } = useTenant();

//   useEffect(() => {
//     fetchAnnouncements();
//   }, [tenant]); // Add tenant as dependency

//   const fetchAnnouncements = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Add tenant filter if not super admin
//       const params = {};
//       if (userData?.role !== 'superAdmin' && tenant?._id) {
//         params.tenant = tenant._id;
//       }

//       const response = await apiClient.get('/announcements', { params });
//       setAnnouncements(response.data.data || response.data);
//     } catch (error) {
//       console.error('Error fetching announcements:', error);
//       setError(`Failed to fetch announcements: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
    
//     if (!userData || !userData.token) {
//       setError('You must be logged in to create or update announcements');
//       setLoading(false);
//       return;
//     }
    
//     try {
//       const dataToSend = {
//         ...formData,
//         // Add tenant ID for non-super admins
//         ...(userData.role !== 'superAdmin' && { tenant: tenant?._id })
//       };

//       if (isEditing) {
//         await apiClient.put(`/announcements/${editId}`, dataToSend);
//       } else {
//         await apiClient.post('/announcements', dataToSend);
//       }
      
//       setFormData({ title: '', message: '', status: 'inactive', displayDuration: 5 });
//       setIsEditing(false);
//       setEditId(null);
//       fetchAnnouncements();
//     } catch (error) {
//       console.error('Error saving announcement:', error);
//       setError(`Failed to save announcement: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (announcement) => {
//     setFormData({
//       title: announcement.title,
//       message: announcement.message,
//       status: announcement.status,
//       displayDuration: announcement.displayDuration
//     });
//     setIsEditing(true);
//     setEditId(announcement._id);
//   };

//   const handleDelete = async (id) => {
//     if (!userData || !userData.token) {
//       setError('You must be logged in to delete announcements');
//       return;
//     }
    
//     if (window.confirm('Are you sure you want to delete this announcement?')) {
//       try {
//         await apiClient.delete(`/announcements/${id}`);
//         fetchAnnouncements();
//       } catch (error) {
//         console.error('Error deleting announcement:', error);
//         setError(`Failed to delete announcement: ${error.message}`);
//       }
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {error && (
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error}</p>
//               <p className="mt-1 text-xs text-red-600">Check the console for more details.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-4">
//           {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Title</label>
//             <input
//               type="text"
//               value={formData.title}
//               onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Message</label>
//             <textarea
//               value={formData.message}
//               onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//               rows="3"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Display Duration (seconds)</label>
//             <input
//               type="number"
//               min="5"
//               max="10"
//               value={formData.displayDuration}
//               onChange={(e) => setFormData({ ...formData, displayDuration: parseInt(e.target.value) })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Status</label>
//             <select
//               value={formData.status}
//               onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>
//           <div className="flex justify-end space-x-3">
//             {isEditing && (
//               <Button
//                 type="button"
//                 onClick={() => {
//                   setFormData({ title: '', message: '', status: 'inactive', displayDuration: 5 });
//                   setIsEditing(false);
//                   setEditId(null);
//                 }}
//                 className="bg-gray-500 hover:bg-gray-600"
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//             )}
//             <Button 
//               type="submit" 
//               className="bg-green-600 hover:bg-green-700"
//               disabled={loading}
//             >
//               {loading ? 'Processing...' : isEditing ? 'Update' : 'Create'} Announcement
//             </Button>
//           </div>
//         </form>
//       </div>

//       <div className="bg-white shadow rounded-lg p-6">
//         <h2 className="text-2xl font-bold mb-4">Announcements</h2>
//         {loading && <p className="text-gray-500">Loading announcements...</p>}
//         <div className="space-y-4">
//           {announcements.length === 0 && !loading ? (
//             <p className="text-gray-500">No announcements found.</p>
//           ) : (
//             announcements.map((announcement) => (
//               <div
//                 key={announcement._id}
//                 className="border rounded-lg p-4 flex justify-between items-start"
//               >
//                 <div>
//                   <h3 className="font-semibold">{announcement.title}</h3>
//                   <p className="text-gray-600">{announcement.message}</p>
//                   <div className="mt-2 space-x-2">
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                       announcement.status === 'active'
//                         ? 'bg-green-100 text-green-800'
//                         : 'bg-gray-100 text-gray-800'
//                     }`}>
//                       {announcement.status}
//                     </span>
//                     <span className="text-xs text-gray-500">
//                       Duration: {announcement.displayDuration}s
//                     </span>
//                   </div>
//                 </div>
//                 <div className="space-x-2">
//                   <button
//                     onClick={() => handleEdit(announcement)}
//                     className="text-blue-600 hover:text-blue-800"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(announcement._id)}
//                     className="text-red-600 hover:text-red-800"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnnouncementManager; 






'use client';

import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../../lib/api/apiClient';
import Button from '../ui/Button';
import { useDashboard } from '../../contexts/DashboardContext';
import { useTenant } from '../../contexts/TenantContext';
import { Check, X, AlertTriangle } from 'lucide-react';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    status: 'inactive',
    displayDuration: 5
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const { userData } = useDashboard();
  const { tenant } = useTenant();

  // Refs for timeout cleanup
  const successTimerRef = useRef(null);
  const deleteTimerRef = useRef(null);

  useEffect(() => {
    fetchAnnouncements();
    return () => {
      // Cleanup timers on unmount
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, [tenant]);

  // Auto-dismiss success popup after 3 seconds
  useEffect(() => {
    if (showSuccessPopup) {
      successTimerRef.current = setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    }
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, [showSuccessPopup]);

  // Auto-dismiss delete popup after 5 seconds
  useEffect(() => {
    if (showDeletePopup) {
      deleteTimerRef.current = setTimeout(() => {
        setShowDeletePopup(false);
        setAnnouncementToDelete(null);
      }, 5000);
    }
    return () => {
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    };
  }, [showDeletePopup]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (userData?.role !== 'superAdmin' && tenant?._id) {
        params.tenant = tenant._id;
      }

      const response = await apiClient.get('/announcements', { params });
      setAnnouncements(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError(`Failed to fetch announcements: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!userData || !userData.token) {
      setError('You must be logged in to create or update announcements');
      setLoading(false);
      return;
    }
    
    try {
      const dataToSend = {
        ...formData,
        ...(userData.role !== 'superAdmin' && { tenant: tenant?._id })
      };

      if (isEditing) {
        await apiClient.put(`/announcements/${editId}`, dataToSend);
        setSuccessMessage('Announcement updated successfully');
      } else {
        await apiClient.post('/announcements', dataToSend);
        setSuccessMessage('Announcement created successfully');
      }
      
      setFormData({ title: '', message: '', status: 'inactive', displayDuration: 5 });
      setIsEditing(false);
      setEditId(null);
      setShowSuccessPopup(true);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      setError(`Failed to save announcement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      status: announcement.status,
      displayDuration: announcement.displayDuration
    });
    setIsEditing(true);
    setEditId(announcement._id);
  };

  const handleDeleteClick = (id) => {
    if (!userData || !userData.token) {
      setError('You must be logged in to delete announcements');
      return;
    }
    
    const announcement = announcements.find(a => a._id === id);
    setAnnouncementToDelete(announcement);
    setShowDeletePopup(true);
  };

  const confirmDelete = async () => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    
    try {
      await apiClient.delete(`/announcements/${announcementToDelete._id}`);
      setSuccessMessage('Announcement deleted successfully');
      setShowSuccessPopup(true);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setError(`Failed to delete announcement: ${error.message}`);
    } finally {
      setShowDeletePopup(false);
      setAnnouncementToDelete(null);
    }
  };

  const cancelDelete = () => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    setShowDeletePopup(false);
    setAnnouncementToDelete(null);
  };

  const closeSuccessPopup = () => {
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
    setShowSuccessPopup(false);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <p className="mt-1 text-xs text-red-600">Check the console for more details.</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 z-50 transition-transform duration-300 ease-out animate-scale-fade-in">
          <div className="bg-white border border-green-200 rounded-lg shadow-xl p-4 w-64 relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
            
            {/* Bottom subtle bar */}
            <div className="absolute bottom-0 left-0 h-2 w-full bg-green-50"></div>

            <div className="flex items-start">
              {/* Icon */}
              <div className="flex-shrink-0 relative">
                <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center border-2 border-green-200 animate-bounce">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 text-2xl">🌿</div>
              </div>

              {/* Text Content */}
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">Success!</h3>
                <div className="mt-1 text-sm text-gray-600">
                  {successMessage}
                </div>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-green-100">
              <div 
                className="h-full bg-green-400 animate-[shrink_3s_linear_forwards]"
              ></div>
            </div>

            {/* Close button */}
            <button
              onClick={closeSuccessPopup}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition duration-150"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed top-4 right-4 z-50 transition-transform duration-300 ease-out animate-scale-fade-in">
          <div className="bg-white border border-orange-200 rounded-lg shadow-xl p-4 w-64 relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500 animate-pulse"></div>
            
            {/* Bottom subtle bar */}
            <div className="absolute bottom-0 left-0 h-2 w-full bg-orange-50"></div>

            <div className="flex items-start">
              {/* Icon */}
              <div className="flex-shrink-0 relative">
                <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center border-2 border-orange-200 animate-bounce">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 text-2xl">⚠️</div>
              </div>

              {/* Text Content */}
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-gray-900">Confirm Delete</h3>
                <div className="mt-1 text-sm text-gray-600">
                  Delete "{announcementToDelete?.title}"?
                </div>
              </div>
            </div>

            {/* Auto-dismiss progress bar */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-orange-100">
              <div 
                className="h-full bg-orange-400 animate-[shrink_5s_linear_forwards]"
              ></div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={cancelDelete}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition duration-150"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Display Duration (seconds)</label>
            <input
              type="number"
              min="5"
              max="10"
              value={formData.displayDuration}
              onChange={(e) => setFormData({ ...formData, displayDuration: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            {isEditing && (
              <Button
                type="button"
                onClick={() => {
                  setFormData({ title: '', message: '', status: 'inactive', displayDuration: 5 });
                  setIsEditing(false);
                  setEditId(null);
                }}
                className="bg-gray-500 hover:bg-gray-600"
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Processing...' : isEditing ? 'Update' : 'Create'} Announcement
            </Button>
          </div>
        </form>
      </div>

      {/* Announcements List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Announcements</h2>
        {loading && <p className="text-gray-500">Loading announcements...</p>}
        <div className="space-y-4">
          {announcements.length === 0 && !loading ? (
            <p className="text-gray-500">No announcements found.</p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement._id}
                className="border rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <p className="text-gray-600">{announcement.message}</p>
                  <div className="mt-2 space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      announcement.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {announcement.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      Duration: {announcement.displayDuration}s
                    </span>
                  </div>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(announcement._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementManager;