import apiClient from './apiClient';

export const propertyApi = {
  // Property Management
  getAllProperties: async (params = {}) => {
    const response = await apiClient.get('/properties', { params });
    return response.data;
  },

  getProperty: async (id) => {
    const response = await apiClient.get(`/properties/${id}`);
    return response.data;
  },

  createProperty: async (propertyData) => {
    const response = await apiClient.post('/properties', propertyData);
    return response.data;
  },

  updateProperty: async (id, propertyData) => {
    const response = await apiClient.put(`/properties/${id}`, propertyData);
    return response.data;
  },

  deleteProperty: async (id) => {
    const response = await apiClient.delete(`/properties/${id}`);
    return response.data;
  },

  // Property Photos
  uploadPropertyPhotos: async (propertyId, photos) => {
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append(`photos[${index}]`, photo);
    });
    
    const response = await apiClient.post(
      `/properties/${propertyId}/photos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Property Features
  getPropertyFeatures: async (propertyId) => {
    const response = await apiClient.get(`/properties/${propertyId}/features`);
    return response.data;
  },

  updatePropertyFeatures: async (propertyId, features) => {
    const response = await apiClient.put(`/properties/${propertyId}/features`, features);
    return response.data;
  },

  // Property Access Instructions
  updateAccessInstructions: async (propertyId, instructions) => {
    const response = await apiClient.put(`/properties/${propertyId}/access`, instructions);
    return response.data;
  },

  // Property History
  getPropertyHistory: async (propertyId) => {
    const response = await apiClient.get(`/properties/${propertyId}/history`);
    return response.data;
  },

  // Property Analytics
  getPropertyAnalytics: async (propertyId, dateRange) => {
    const response = await apiClient.get(`/properties/${propertyId}/analytics`, {
      params: dateRange
    });
    return response.data;
  }
};
