const BASE_URL = 'https://agro-smart-backend-production.up.railway.app';

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
  let accessToken = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
    ...options.headers,
  };

  let response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Handle Token Expiration (401)
  if (response.status === 401) {
    const refreshToken = localStorage.getItem('refresh');
    
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
          localStorage.setItem('token', newToken);
          isRefreshing = false;
          
          // Notify all queued requests that the new token is ready
          onRrefreshed(newToken);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (error) {
        isRefreshing = false;
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
  localStorage.clear();
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};