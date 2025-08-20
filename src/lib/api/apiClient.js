// import axios from 'axios';

// // Extract subdomain from current host
// const extractSubdomain = () => {
//   if (typeof window === 'undefined') return null;
//   const host = window.location.hostname;
//   const parts = host.split('.');
//   // Remove 'www' if present
//   if (parts[0] === 'www') parts.shift();
//   // Only return subdomain if there are at least 3 parts (sub.domain.tld) or 2 parts for local dev (sub.localhost)
//   if (parts.length >= 3 || (parts.length === 2 && parts[1] === 'localhost')) {
//     return parts[0];
//   }
//   return null;
// };

// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     // Add authentication token
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || localStorage.getItem('token');
//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//         console.log('🔑 Adding Authorization header with token');
//         console.log('🌐 Request URL:', config.url);
//         console.log('📋 Request method:', config.method);
//         console.log('🔒 Token present:', !!token);
//       } else {
//         console.log('⚠️ No token found in storage');
//         console.log('🌐 Request URL:', config.url);
//         console.log('📋 Request method:', config.method);
//       }
//     }

//     // Add tenant subdomain header
//     const subdomain = extractSubdomain();
//     if (subdomain) {
//       config.headers['x-tenant-subdomain'] = subdomain;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for handling tenant-specific errors
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle tenant not found errors
//     if (error.response?.status === 404 && error.response?.data?.message?.includes('Tenant not found')) {
//       // Redirect to main domain or show tenant not found page
//       if (typeof window !== 'undefined') {
//         window.location.href = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'http://localhost:3000';
//       }
//     }
    
//     // Handle tenant inactive errors
//     if (error.response?.status === 403 && error.response?.data?.message?.includes('inactive')) {
//       // Show tenant inactive message
//       console.error('Tenant account is inactive');
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default apiClient;






import axios from 'axios';

// Extract subdomain from current host
const extractSubdomain = () => {
  if (typeof window === 'undefined') return null;
  const host = window.location.hostname;
  
  // For local development with subdomains (e.g., tenant.localhost:3000)
  if (host.includes('localhost')) {
    const parts = host.split('.');
    if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
      return parts[0];
    }
    return null;
  }
  
  // For production domains (e.g., tenant.example.com)
  const parts = host.split('.');
  if (parts.length <= 2) return null; // No subdomain (example.com)
  if (parts[0] === 'www') return parts.length > 3 ? parts[1] : null;
  return parts[0];
};

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Add tenant subdomain header only if we're on a subdomain
    const subdomain = extractSubdomain();
    if (subdomain) {
      config.headers['x-tenant-subdomain'] = subdomain;
    } else {
      // On main domain, explicitly indicate we want all services
      config.headers['x-all-tenants'] = 'true';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling tenant-specific errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle tenant not found errors
    if (error.response?.status === 404 && error.response?.data?.message?.includes('Tenant not found')) {
      // Redirect to main domain or show tenant not found page
      if (typeof window !== 'undefined') {
        window.location.href = process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'http://localhost:3000';
      }
    }
    
    // Handle tenant inactive errors
    if (error.response?.status === 403 && error.response?.data?.message?.includes('inactive')) {
      // Show tenant inactive message
      console.error('Tenant account is inactive');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
