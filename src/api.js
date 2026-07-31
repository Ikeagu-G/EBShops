import axios from 'axios';

// Single source of truth for the API origin. Several pages previously hardcoded
// https://ebshops-backend.onrender.com, so local development hit production.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  // The backend authenticates with httpOnly cookies, so every request must
  // carry credentials.
  withCredentials: true,
});

// Endpoints that must never trigger a refresh-and-retry cycle.
const AUTH_ENDPOINTS = ['/admin/refresh', '/admin/login', '/admin/logout'];

let refreshPromise = null;

const refreshSession = () => {
  // Collapse concurrent 401s into a single refresh call; otherwise a page that
  // fires several requests at once would send several refreshes and race.
  if (!refreshPromise) {
    refreshPromise = api
      .post('/admin/refresh')
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

// Registered once at module scope. The original registered this inside the App
// component body, adding a duplicate handler on every single render.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // error.response is undefined for network failures and timeouts; the old
    // code read error.response.status directly and threw a TypeError inside the
    // interceptor, masking the real error.
    const status = error.response?.status;
    const url = originalRequest?.url || '';
    const isAuthEndpoint = AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        await refreshSession();
        return api(originalRequest);
      } catch (refreshError) {
        // Let the caller decide how to react (e.g. redirect via the router)
        // rather than hard-navigating with window.location here.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/** Human-readable message from an axios error, for display in the UI. */
export const getErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (error.response) {
    return error.response.data?.error || error.response.data?.message || fallback;
  }
  if (error.request) {
    return 'Network error. Please check your connection and try again.';
  }
  return fallback;
};

export { API_BASE_URL };
export default api;
