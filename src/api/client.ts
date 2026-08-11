import axios from 'axios';

// In development Vite proxies this path to the local Express server. In a
// production Vercel deployment, set VITE_API_BASE_URL to the public URL of the
// separately deployed backend (for example, https://rentalisting-api.example.com/api).
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Transform Supabase response format (id) to frontend format (_id)
const transformSupabaseData = (data: any): any => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => transformSupabaseData(item));
  }

  if (typeof data === 'object' && data !== null) {
    const transformed = { ...data };
    if ('id' in transformed && !('_id' in transformed)) {
      transformed._id = transformed.id;
    }
    return transformed;
  }

  return data;
};

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.data) {
      response.data.data = transformSupabaseData(response.data.data);
    } else if (response.data) {
      response.data = transformSupabaseData(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
