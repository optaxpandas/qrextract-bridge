
import { toast } from 'sonner';

const API_URL = 'http://127.0.0.1:8000';

// Get the authentication token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper function for making authenticated requests
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    ...defaultOptions,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API request failed with status ${response.status}`);
  }
  
  return response.json();
};

// QR Code related API calls
export const qrApi = {
  // Send QR data to backend
  sendQRData: async (data: any) => {
    return fetchWithAuth('/qr', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Get QR history
  getQRHistory: async () => {
    return fetchWithAuth('/qr/history');
  },
  
  // Get QR details by ID
  getQRDetails: async (id: string) => {
    return fetchWithAuth(`/qr/${id}`);
  }
};

// Table extraction related API calls
export const tableApi = {
  // Extract table from image
  extractTable: async (data: any) => {
    return fetchWithAuth('/table', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Get all tables
  getAllTables: async (page?: number, size?: number) => {
    let url = '/table';
    if (page !== undefined || size !== undefined) {
      url += `?page=${page || ''}&size=${size || ''}`;
    }
    return fetchWithAuth(url);
  },
  
  // Get table by ID
  getTableById: async (id: string) => {
    return fetchWithAuth(`/table/${id}`);
  }
};

// User related API calls
export const userApi = {
  // Get current user info
  getMe: async () => {
    return fetchWithAuth('/me');
  }
};

// Handle API errors consistently
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    toast.error('Unable to connect to the server. Please check your network or contact support.');
    return;
  }
  
  if (error.message.includes('401')) {
    // Clear token and redirect to login if unauthorized
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    toast.error('Your session has expired. Please log in again.');
    window.location.href = '/login';
    return;
  }
  
  toast.error(error.message || 'An unexpected error occurred. Please try again.');
};
