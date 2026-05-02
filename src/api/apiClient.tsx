const BASE_URL = 'https://agrosmart-backend-spz5.onrender.com';
import { getStorage, setStorage, clearAllStorage } from '../utils/storage';

// Internal state to handle multiple simultaneous 401s
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRrefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

export const apiClient = async (endpoint: string, options: any = {}) => {
  let accessToken = getStorage('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Handle Token Expiration (401)
  if (response.status === 401) {
    const refreshToken = getStorage('refresh');
    
    if (!refreshToken) {
      handleAuthFailure();
      return response;
    }

    if (!isRefreshing) {
      isRefreshing = true;

      try {
        const refreshResponse = await fetch(`${BASE_URL}/api/auth/token/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: refreshToken }), // Matches RefreshTokenRequest
        });

        const refreshResult = await refreshResponse.json();

        if (refreshResponse.ok && refreshResult.success) {
          const newToken = refreshResult.data.accessToken;
          setStorage('token', newToken);
          isRefreshing = false;
          
          // Notify all queued requests that the new token is ready
          onRrefreshed(newToken);
          
          // Retry the original request that triggered the refresh
          headers['Authorization'] = `Bearer ${newToken}`;
          return fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
        } else {
          throw new Error('Refresh failed');
        }
      } catch (error) {
        isRefreshing = false;
        
        // Clear queue on failure so pending requests don't hang
        refreshSubscribers = [];
        
        handleAuthFailure();
        return response;
      }
    }

    // If a refresh is already in progress, wait for it to finish and then retry this request
    return new Promise((resolve) => {
      subscribeTokenRefresh((token: string) => {
        headers['Authorization'] = `Bearer ${token}`;
        resolve(fetch(`${BASE_URL}${endpoint}`, { ...options, headers }));
      });
    });
  }

  return response;
};

// Centralized logout logic for expired sessions
const handleAuthFailure = () => {
  clearAllStorage();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};