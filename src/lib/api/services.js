import apiClient from './apiClient';

export const serviceApi = {
  // Get all services with optional filters
  // getAllServices: async (params = {}) => {
  //   const response = await apiClient.get('/services', { params });
  //   return response.data;
  // },


  
  getAllServices: async (params) => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services`, {
      params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data; // Just return the direct response
  },


  
  
  

  // Get a single service by ID
  getService: async (id) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },

  // Create a new service
  // createService: async (serviceData) => {
  //   const response = await apiClient.post('/services', serviceData);
  //   return response.data;
  // },



   createService: async (data) => {
    const response = await axios.post(`${API_URL}/services`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  // Update an existing service
  updateService: async (id, serviceData) => {
    const response = await apiClient.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Delete a service
  deleteService: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },

  // Upload service photo
  uploadServicePhoto: async (id, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    
    const response = await apiClient.put(
      `/services/${id}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // Get services by category
  getServicesByCategory: async (category) => {
    const response = await apiClient.get(`/services/category/${category}`);
    return response.data;
  },

  // Get service packages
  getServicePackages: async (id) => {
    const response = await apiClient.get(`/services/${id}/packages`);
    return response.data;
  },
}; 