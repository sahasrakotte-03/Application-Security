import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer JWT if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('secureapp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format error responses and handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Normalize error message safely
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let validationDetails = null;

    if (error.response) {
      const data = error.response.data;
      if (data) {
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.details)) {
          errorMessage = data.message || 'Validation error';
          validationDetails = data.details;
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        }
      }

      // If token expired or invalid on protected route
      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes('/auth/login')
      ) {
        localStorage.removeItem('secureapp_token');
        localStorage.removeItem('secureapp_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    } else if (error.request) {
      errorMessage = 'Unable to connect to security server. Verify backend is running.';
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response?.status;
    enhancedError.details = validationDetails;
    enhancedError.raw = error;
    return Promise.reject(enhancedError);
  }
);

export default api;
