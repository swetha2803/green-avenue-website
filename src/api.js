// Green Avenue API - Separate project, connects to same Google Sheets
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzL_3ZWGnWaTK6_5suUcDPmRqcjXxW5vhZ6k4yfXesOzgyN_9k14qRpNj-tvxSra1L1FQ/exec';

// Connected to real API!
const MOCK_MODE = false;

// API helper to call Google Apps Script functions
async function callGoogleScript(action, data = {}) {
  try {
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append('action', action);
    
    // For GET requests with simple data
    if (Object.keys(data).length > 0) {
      url.searchParams.append('data', JSON.stringify(data));
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error calling ${action}:`, error);
    // Fallback to mock data on error
    return null;
  }
}

// POST request for actions that modify data (now using GET to avoid CORS)
async function postToGoogleScript(action, data = {}) {
  try {
    // Use GET to avoid CORS preflight issues with Google Apps Script
    const url = new URL(APPS_SCRIPT_URL);
    url.searchParams.append('action', action);
    url.searchParams.append('data', JSON.stringify(data));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow'
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error calling ${action}:`, error);
    return null;
  }
}

// Mock user for fallback
const mockUser = {
  email: 'admin@greenavenue.com',
  site: '1',
  role: 'Admin',
  name: 'Admin User',
  phone: '9876543210'
};

// Mock data for fallback
const mockData = {
  directory: [
    { site: '1', name: 'Admin User', phone: '9876543210', email: 'admin@greenavenue.com', role: 'Admin' },
    { site: '2', name: 'Rahul Sharma', phone: '9876543211', email: 'rahul@email.com', role: 'Owner' },
    { site: '3', name: 'Priya Singh', phone: '9876543212', email: 'priya@email.com', role: 'Owner' },
  ],
  notices: [
    { ID: '1', Type: 'General', Title: 'Welcome to Green Avenue', Message: 'This is your new community portal. Explore all features!', PostedBy: 'admin@greenavenue.com', PostedAt: '27/12/2024' },
  ],
  stats: { totalResidents: 139, totalNotices: 5, pendingVisitors: 3, openRequests: 2 }
};

// API Functions
export const api = {
  // Auth - Supports Email OR Phone Number (same as original Code.gs)
  async login(input, password) {
    if (MOCK_MODE) {
      // Mock login for testing
      if ((input === 'admin@greenavenue.com' || input === '9876543210') && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      return { success: false, message: 'Invalid credentials' };
    }
    
    try {
      const result = await postToGoogleScript('login', { input, password });
      
      // Handle response - API returns { success: true, user: {...} }
      if (result && result.success && result.user) {
        const user = {
          email: result.user.email,
          site: result.user.site,
          role: result.user.role,
          name: result.user.name || result.user.email?.split('@')[0],
          phone: result.user.phone
        };
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      // Handle old format response (just user object)
      if (result && result.email) {
        const user = {
          email: result.email,
          site: result.site,
          role: result.role,
          name: result.name || result.email.split('@')[0],
          phone: result.phone
        };
        localStorage.setItem('user', JSON.stringify(user));
        return { success: true, user };
      }
      
      console.log('Login API response:', result);
      return { success: false, message: result?.message || 'Invalid credentials' };
    } catch (e) {
      console.error('Login error:', e);
      console.log('API URL:', APPS_SCRIPT_URL);
      // Fallback to mock
      if ((input === 'admin@greenavenue.com' || input === '9876543210') && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      return { success: false, message: 'Connection error' };
    }
  },
  
  async getSession() {
    const user = localStorage.getItem('user');
    return user ? { loggedIn: true, user: JSON.parse(user) } : { loggedIn: false };
  },
  
  logout() {
    localStorage.removeItem('user');
  },
  
  // Directory
  async getDirectory() {
    if (MOCK_MODE) {
      return { success: true, data: mockData.directory };
    }
    
    try {
      const result = await callGoogleScript('getDirectory');
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: mockData.directory };
    } catch (e) {
      return { success: true, data: mockData.directory };
    }
  },
  
  // Notices
  async getNotices() {
    if (MOCK_MODE) {
      return { success: true, data: mockData.notices };
    }
    
    try {
      const result = await callGoogleScript('getNotices');
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: mockData.notices };
    } catch (e) {
      return { success: true, data: mockData.notices };
    }
  },
  
  // Visitors
  async getVisitors(user) {
    if (MOCK_MODE) {
      return { success: true, data: [] };
    }
    
    try {
      const result = await callGoogleScript('getVisitors', { user });
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: [] };
    } catch (e) {
      return { success: true, data: [] };
    }
  },
  
  async registerVisitor(data, user) {
    if (MOCK_MODE) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      return { success: true, otp, expiry: new Date(Date.now() + 86400000).toISOString() };
    }
    
    try {
      const result = await postToGoogleScript('registerVisitor', { ...data, user });
      return result || { success: false, message: 'Failed to register visitor' };
    } catch (e) {
      return { success: false, message: 'Connection error' };
    }
  },
  
  // Properties
  async getProperties() {
    if (MOCK_MODE) {
      return { success: true, data: [] };
    }
    
    try {
      const result = await callGoogleScript('getProperties');
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: [] };
    } catch (e) {
      return { success: true, data: [] };
    }
  },
  
  // Polls
  async getPolls() {
    if (MOCK_MODE) {
      return { success: true, data: [] };
    }
    
    try {
      const result = await callGoogleScript('getPolls');
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: [] };
    } catch (e) {
      return { success: true, data: [] };
    }
  },
  
  // Stats
  async getStats() {
    if (MOCK_MODE) {
      return { success: true, data: mockData.stats };
    }
    
    try {
      const result = await callGoogleScript('getStats');
      if (result) {
        return { success: true, data: result };
      }
      return { success: true, data: mockData.stats };
    } catch (e) {
      return { success: true, data: mockData.stats };
    }
  },
  
  // Payments
  async getPayments(user) {
    if (MOCK_MODE) {
      return { success: true, data: [] };
    }
    
    try {
      const result = await callGoogleScript('getPayments', { user });
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: [] };
    } catch (e) {
      return { success: true, data: [] };
    }
  },
  
  // Requests
  async getRequests(user) {
    if (MOCK_MODE) {
      return { success: true, data: [] };
    }
    
    try {
      const result = await callGoogleScript('getRequests', { user });
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: [] };
    } catch (e) {
      return { success: true, data: [] };
    }
  },
  
  // Users (Admin)
  async getUsers(user) {
    if (MOCK_MODE) {
      return { success: true, data: mockData.directory };
    }
    
    try {
      const result = await callGoogleScript('getUsers', { user });
      if (result && Array.isArray(result)) {
        return { success: true, data: result };
      }
      return { success: true, data: mockData.directory };
    } catch (e) {
      return { success: true, data: mockData.directory };
    }
  }
};

export default api;
