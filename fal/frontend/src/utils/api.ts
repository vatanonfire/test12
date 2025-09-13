// API utility functions for consistent API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_BASE_URL,
  frontendURL: FRONTEND_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      checkToken: '/api/auth/check-token',
    },
    fortune: {
      hand: '/api/fortune/hand',
      face: '/api/fortune/face',
      coffee: '/api/fortune/coffee',
      tarot: '/api/fortune/tarot',
      limits: '/api/fortune-limits',
    },
    ai: {
      chat: '/api/ai-chat',
    },
    coins: {
      packages: '/api/coins/packages',
      userAddCoins: '/api/coins/user/add-coins',
      userTransactions: '/api/coins/user/transactions',
      adminPackages: '/api/coins/admin/packages',
      adminPackageStats: '/api/coins/admin/package-stats',
    },
    admin: {
      stats: '/api/admin/stats',
      users: '/api/admin/users',
      sendCoins: '/api/admin/send-coins',
      sendNotification: '/api/admin/send-notification',
    },
    rituals: {
      list: '/api/rituals',
      orders: '/api/rituals/orders',
    },
    notifications: {
      list: '/api/notifications',
      unreadCount: '/api/notifications/unread-count',
      markAsRead: '/api/notifications',
      readAll: '/api/notifications/read-all',
    },
    user: {
      profile: '/api/user/profile',
    },
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to get full frontend URL
export const getFrontendUrl = (path: string): string => {
  return `${FRONTEND_URL}${path}`;
};

// Default fetch options with common headers
export const getDefaultHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API call wrapper with error handling
export const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  const headers = getDefaultHeaders(token);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  return response;
};

