import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, User, Page, LoginCredentials, RegisterCredentials } from '../types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/auth/profile', updates);
    return response.data;
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.delete('/auth/logout');
    return response.data;
  },
};

// Pages API
export const pagesAPI = {
  getPages: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    isPublished?: boolean;
    search?: string;
  }): Promise<ApiResponse<{ pages: Page[] }>> => {
    const response = await api.get('/pages', { params });
    return response.data;
  },

  getPublicPages: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<ApiResponse<{ pages: Page[] }>> => {
    const response = await api.get('/pages/public', { params });
    return response.data;
  },

  getPage: async (id: string): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.get(`/pages/${id}`);
    return response.data;
  },

  createPage: async (pageData: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    settings?: any;
  }): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.post('/pages', pageData);
    return response.data;
  },

  updatePage: async (id: string, updates: Partial<Page>): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.put(`/pages/${id}`, updates);
    return response.data;
  },

  updateBlocks: async (id: string, blocks: any[]): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.put(`/pages/${id}/blocks`, { blocks });
    return response.data;
  },

  addCollaborator: async (id: string, userId: string, role: string = 'editor'): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.post(`/pages/${id}/collaborators`, { userId, role });
    return response.data;
  },

  removeCollaborator: async (pageId: string, userId: string): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.delete(`/pages/${pageId}/collaborators/${userId}`);
    return response.data;
  },

  deletePage: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/pages/${id}`);
    return response.data;
  },

  publishPage: async (id: string): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.put(`/pages/${id}`, { isPublished: true });
    return response.data;
  },

  unpublishPage: async (id: string): Promise<ApiResponse<{ page: Page }>> => {
    const response = await api.put(`/pages/${id}`, { isPublished: false });
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getProfile: async (): Promise<ApiResponse<{ user: User; statistics: any; recentPages: Page[] }>> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (updates: Partial<User>): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/users/profile', updates);
    return response.data;
  },

  searchUsers: async (query: string, limit: number = 10): Promise<ApiResponse<{ users: User[] }>> => {
    const response = await api.get('/users/search', { params: { q: query, limit } });
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  getStats: async (period: string = '30d'): Promise<ApiResponse<any>> => {
    const response = await api.get('/users/stats/overview', { params: { period } });
    return response.data;
  },
};

// File upload API
export const uploadAPI = {
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string; base64: string; mimeType: string; originalName: string; size: number }>> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadFile: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Utility functions
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default api;
