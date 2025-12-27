// Google Apps Script Web App URL - Replace with your deployed URL
const APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL';

// API helper to call Google Apps Script functions
export async function callGoogleScript(functionName, ...args) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        function: functionName,
        parameters: args
      }),
      mode: 'cors'
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error calling ${functionName}:`, error);
    throw error;
  }
}

// For development - mock data
const MOCK_MODE = true; // Set to false when you connect to real Apps Script

// Mock user for development
const mockUser = {
  email: 'admin@greenavenue.com',
  site: '1',
  role: 'Admin',
  name: 'Admin User',
  phone: '9876543210'
};

// API Functions
export const api = {
  // Auth
  async login(email, password) {
    if (MOCK_MODE) {
      if (email === 'admin@greenavenue.com' && password === 'admin123') {
        localStorage.setItem('user', JSON.stringify(mockUser));
        return { success: true, user: mockUser };
      }
      return { success: false, message: 'Invalid credentials' };
    }
    return callGoogleScript('validateLogin', email, password);
  },
  
  async getSession() {
    if (MOCK_MODE) {
      const user = localStorage.getItem('user');
      return user ? { loggedIn: true, user: JSON.parse(user) } : { loggedIn: false };
    }
    return callGoogleScript('getSession');
  },
  
  logout() {
    localStorage.removeItem('user');
  },
  
  // Directory
  async getDirectory() {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          { site: '1', name: 'Admin User', phone: '9876543210', email: 'admin@greenavenue.com', role: 'Admin' },
          { site: '2', name: 'Rahul Sharma', phone: '9876543211', email: 'rahul@email.com', role: 'Owner' },
          { site: '3', name: 'Priya Singh', phone: '9876543212', email: 'priya@email.com', role: 'Owner' },
          { site: '4', name: 'Amit Patel', phone: '9876543213', email: 'amit@email.com', role: 'Tenant' },
          { site: '5', name: 'Sneha Reddy', phone: '9876543214', email: 'sneha@email.com', role: 'Owner' },
        ]
      };
    }
    return callGoogleScript('getCommunityDirectory');
  },
  
  // Notices
  async getNotices() {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          { ID: '1', Type: 'General', Title: 'Water Tank Cleaning', Message: 'Water tank cleaning scheduled for this Sunday. Please store water accordingly.', PostedBy: 'admin@greenavenue.com', PostedAt: '27/12/2024, 10:00 AM' },
          { ID: '2', Type: 'Event', Title: 'New Year Celebration', Message: 'Join us for New Year celebration at the community hall on 31st December.', PostedBy: 'admin@greenavenue.com', PostedAt: '26/12/2024, 2:00 PM' },
          { ID: '3', Type: 'Appreciation', Title: 'Thank You Volunteers', Message: 'Thank you to all volunteers who helped in the community cleanup drive!', PostedBy: 'admin@greenavenue.com', PostedAt: '25/12/2024, 11:00 AM' },
        ]
      };
    }
    return callGoogleScript('getNotices');
  },
  
  // Visitors
  async getVisitors(user) {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          { ID: '1', VisitorName: 'John Doe', VisitorPhone: '9999999999', VisitDate: '2024-12-28', OTP: '123456', OTPExpiry: new Date(Date.now() + 86400000).toISOString(), Status: 'Pending', SiteNumber: '1', otpExpired: false },
          { ID: '2', VisitorName: 'Jane Smith', VisitorPhone: '8888888888', VisitDate: '2024-12-27', OTP: '654321', OTPExpiry: new Date(Date.now() - 86400000).toISOString(), Status: 'Completed', SiteNumber: '1', otpExpired: true },
        ]
      };
    }
    return callGoogleScript('getMyVisitors', user);
  },
  
  async registerVisitor(data, user) {
    if (MOCK_MODE) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      return { success: true, otp, expiry: new Date(Date.now() + 86400000).toISOString() };
    }
    return callGoogleScript('registerVisitor', data, user);
  },
  
  // Properties
  async getProperties() {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          { ID: '1', Type: 'rent', PropertyType: 'Apartment', SiteNumber: '15', Floor: '2nd', BHK: '2 BHK', Facing: 'East', Contact: '9876543210', Facilities: 'Parking, Lift', SubmittedBy: 'owner@email.com', SubmittedAt: '27/12/2024' },
          { ID: '2', Type: 'sale', PropertyType: 'House', SiteNumber: '42', Floor: 'Ground', BHK: '3 BHK', Facing: 'North', Contact: '9876543211', Facilities: 'Garden, Parking', SubmittedBy: 'seller@email.com', SubmittedAt: '26/12/2024' },
        ]
      };
    }
    return callGoogleScript('getProperties');
  },
  
  // Polls
  async getPolls() {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          {
            ID: '1',
            Question: 'Should we install CCTV cameras at all entry points?',
            options: ['Yes', 'No', 'Need more discussion'],
            votes: { 'Yes': 25, 'No': 5, 'Need more discussion': 10 },
            totalVotes: 40,
            hasVoted: false,
            userVote: null,
            EndDate: '2024-12-31',
            isExpired: false,
            CreatedBy: 'admin@greenavenue.com'
          },
          {
            ID: '2',
            Question: 'Preferred timing for community meetings?',
            options: ['Weekday Evening', 'Saturday Morning', 'Sunday Morning'],
            votes: { 'Weekday Evening': 15, 'Saturday Morning': 30, 'Sunday Morning': 20 },
            totalVotes: 65,
            hasVoted: true,
            userVote: 'Saturday Morning',
            EndDate: '2024-12-25',
            isExpired: true,
            CreatedBy: 'admin@greenavenue.com'
          }
        ]
      };
    }
    return callGoogleScript('getPolls');
  },
  
  // Stats
  async getStats() {
    if (MOCK_MODE) {
      return {
        success: true,
        data: {
          totalResidents: 139,
          totalNotices: 12,
          pendingVisitors: 5,
          openRequests: 8,
          pendingPayments: 15,
          activeListings: 4
        }
      };
    }
    return callGoogleScript('getDashboardStats');
  },
  
  // Payments
  async getPayments(user) {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          { ID: '1', Month: 'December', Year: '2024', Amount: '1500', Status: 'Approved', SubmittedAt: '15/12/2024' },
          { ID: '2', Month: 'November', Year: '2024', Amount: '1500', Status: 'Approved', SubmittedAt: '14/11/2024' },
          { ID: '3', Month: 'January', Year: '2025', Amount: '1500', Status: 'Pending', SubmittedAt: '27/12/2024' },
        ]
      };
    }
    return callGoogleScript('getMyPayments', user);
  },
  
  // Requests
  async getRequests(user) {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          { ID: '1', Type: 'Maintenance', Message: 'Street light not working near site 25', Status: 'Open', Priority: 'High', SubmittedAt: '27/12/2024' },
          { ID: '2', Type: 'Security', Message: 'Gate not closing properly', Status: 'Resolved', Priority: 'Normal', SubmittedAt: '20/12/2024' },
        ]
      };
    }
    return callGoogleScript('getMyRequests', user);
  },
  
  // Users (Admin)
  async getUsers(user) {
    if (MOCK_MODE) {
      return {
        success: true,
        data: [
          { email: 'admin@greenavenue.com', site: '1', name: 'Admin User', role: 'Admin', status: 'Active', phone: '9876543210' },
          { email: 'rahul@email.com', site: '2', name: 'Rahul Sharma', role: 'Owner', status: 'Active', phone: '9876543211' },
          { email: 'priya@email.com', site: '3', name: 'Priya Singh', role: 'Owner', status: 'Active', phone: '9876543212' },
          { email: 'tenant@email.com', site: '4', name: 'Amit Patel', role: 'Tenant', status: 'Inactive', phone: '9876543213' },
        ]
      };
    }
    return callGoogleScript('getAllUsers', user);
  }
};

export default api;

