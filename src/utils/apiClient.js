import axios from 'axios';

// ----------------------------------------------------------------------
// Client for the Django backend (motos-REST).
// Kept separate from ./axios, which axios-mock-adapter intercepts for the template's demo data.

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

export const getTokens = () => ({
  access: localStorage.getItem(ACCESS_KEY),
  refresh: localStorage.getItem(REFRESH_KEY)
});

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

// The auth context registers a callback here so an expired session logs the user out.
let onSessionExpired = () => {};
export const setSessionExpiredHandler = (handler) => {
  onSessionExpired = handler || (() => {});
};

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

apiClient.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

// One refresh at a time: the dashboard fires several requests at once,
// and they should all wait for the same new token.
let refreshPromise = null;

export const refreshAccessToken = () => {
  if (!refreshPromise) {
    const { refresh } = getTokens();
    refreshPromise = (
      refresh
        ? axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, { refresh })
        : Promise.reject(new Error('No refresh token'))
    )
      .then(({ data }) => {
        // ROTATE_REFRESH_TOKENS is on, so the backend also returns a new refresh token.
        setTokens(data);
        return data.access;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall = original && /\/api\/token\//.test(original.url || '');

    if (error.response?.status === 401 && original && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        const access = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${access}`;
        return apiClient(original);
      } catch (refreshError) {
        clearTokens();
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
