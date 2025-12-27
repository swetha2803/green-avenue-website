import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, UserCheck, Bell, Building2, Vote, CreditCard, 
  HeadphonesIcon, Settings, LogOut, Menu, X, Search, Plus,
  ChevronRight, Phone, Mail, MapPin, Clock, CheckCircle2,
  AlertCircle, TrendingUp, Calendar, Shield, Eye, EyeOff,
  Send, RefreshCw, Trash2, ExternalLink, MessageCircle, Bot,
  Sparkles, Share2, Download, Smartphone
} from 'lucide-react';
import { api } from './api';

// ============================================================================
// APP COMPONENT
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const result = await api.getSession();
      if (result.loggedIn) {
        setUser(result.user);
      }
    } catch (e) {
      console.log('No session');
    }
    setLoading(false);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setCurrentPage('home');
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginPage onLogin={setUser} showToast={showToast} />;
  }

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar */}
      <Sidebar 
        user={user}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logout={logout}
      />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass border-b border-dark-800 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-dark-800 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-primary-400">Green Avenue</span>
          <div className="w-10" />
        </header>
        
        <div className="pt-16 lg:pt-0 p-4 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentPage === 'home' && <DashboardPage user={user} showToast={showToast} />}
              {currentPage === 'directory' && <DirectoryPage user={user} showToast={showToast} />}
              {currentPage === 'visitors' && <VisitorsPage user={user} showToast={showToast} />}
              {currentPage === 'notices' && <NoticesPage user={user} showToast={showToast} />}
              {currentPage === 'properties' && <PropertiesPage user={user} showToast={showToast} />}
              {currentPage === 'polls' && <PollsPage user={user} showToast={showToast} />}
              {currentPage === 'payments' && <PaymentsPage user={user} showToast={showToast} />}
              {currentPage === 'requests' && <RequestsPage user={user} showToast={showToast} />}
              {currentPage === 'admin' && <AdminPage user={user} showToast={showToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* AI Chatbot */}
      <AIChatbot user={user} />
      
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-40 px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl ${
              toast.type === 'success' ? 'bg-primary-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// LOADING SCREEN
// ============================================================================
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-dark-400">Loading Green Avenue...</p>
      </motion.div>
    </div>
  );
}

// ============================================================================
// LOGIN PAGE
// ============================================================================
function LoginPage({ onLogin, showToast }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await api.login(email, password);
      if (result.success) {
        onLogin(result.user);
        showToast('Welcome back!');
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card">
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/25"
            >
              <Home className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gradient">Green Avenue</h1>
            <p className="text-dark-400 mt-1">Community Portal</p>
          </div>
          
          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-400"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}
          
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-12 pr-12"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-4 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <p className="text-center text-dark-500 text-sm mt-6">
            Demo: admin@greenavenue.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================================================
// SIDEBAR
// ============================================================================
function Sidebar({ user, currentPage, setCurrentPage, sidebarOpen, setSidebarOpen, logout }) {
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'directory', label: 'Directory', icon: Users },
    { id: 'visitors', label: 'Visitors', icon: UserCheck },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'polls', label: 'Polls', icon: Vote },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'requests', label: 'Requests', icon: HeadphonesIcon },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Settings }] : []),
  ];
  
  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-72 bg-dark-900 border-r border-dark-800 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-dark-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Home className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gradient">Green Avenue</h2>
                  <p className="text-xs text-dark-500">Community Portal</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 hover:bg-dark-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                className={`nav-item w-full ${currentPage === item.id ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
          
          {/* User Info */}
          <div className="p-4 border-t border-dark-800">
            <div className="glass rounded-xl p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-400 font-bold">
                  {user?.site || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user?.name || user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="badge badge-info">Site {user?.site}</span>
                <span className="badge badge-success">{user?.role}</span>
              </div>
            </div>
            <InstallAppButton />
            <button onClick={logout} className="btn btn-secondary w-full mt-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ============================================================================
// DASHBOARD PAGE
// ============================================================================
function DashboardPage({ user, showToast }) {
  const [stats, setStats] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, noticesRes] = await Promise.all([
        api.getStats(),
        api.getNotices()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (noticesRes.success) setNotices(noticesRes.data.slice(0, 3));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const statCards = [
    { label: 'Total Residents', value: stats?.totalResidents || 0, icon: Users, color: 'from-primary-500 to-primary-600', bg: 'bg-primary-500/10' },
    { label: 'Active Notices', value: stats?.totalNotices || 0, icon: Bell, color: 'from-accent-500 to-accent-600', bg: 'bg-accent-500/10' },
    { label: 'Pending Visitors', value: stats?.pendingVisitors || 0, icon: UserCheck, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Open Requests', value: stats?.openRequests || 0, icon: HeadphonesIcon, color: 'from-red-500 to-red-600', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-bold mb-2"
        >
          Welcome back, <span className="text-gradient">{user?.name || 'Resident'}</span>! 👋
        </motion.h1>
        <p className="text-dark-400">Here's what's happening in your community today.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <div className={`stat-icon ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} style={{ color: stat.color.includes('primary') ? '#22c55e' : stat.color.includes('accent') ? '#f59e0b' : stat.color.includes('blue') ? '#3b82f6' : '#ef4444' }} />
            </div>
            <div>
              <p className="text-3xl font-bold">{loading ? '...' : stat.value}</p>
              <p className="text-sm text-dark-400">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Recent Notices */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Notices</h2>
          <span className="text-sm text-dark-400">{notices.length} notices</span>
        </div>
        
        {notices.length === 0 ? (
          <p className="text-dark-400 text-center py-8">No notices yet</p>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, i) => (
              <motion.div
                key={notice.ID}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`p-4 rounded-xl border-l-4 ${
                  notice.Type === 'Event' ? 'bg-blue-500/5 border-blue-500' :
                  notice.Type === 'Appreciation' ? 'bg-primary-500/5 border-primary-500' :
                  'bg-dark-800/50 border-accent-500'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold mb-1">{notice.Title}</h3>
                    <p className="text-sm text-dark-400 line-clamp-2">{notice.Message}</p>
                  </div>
                  <span className={`badge flex-shrink-0 ${
                    notice.Type === 'Event' ? 'badge-info' :
                    notice.Type === 'Appreciation' ? 'badge-success' :
                    'badge-warning'
                  }`}>{notice.Type}</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-dark-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{notice.PostedAt}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

// ============================================================================
// DIRECTORY PAGE
// ============================================================================
function DirectoryPage({ user, showToast }) {
  const [residents, setResidents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDirectory();
  }, []);

  const loadDirectory = async () => {
    try {
      const res = await api.getDirectory();
      if (res.success) setResidents(res.data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filtered = residents.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    String(r.site).includes(search) ||
    r.phone?.includes(search)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Community Directory</h1>
          <p className="text-dark-400">{residents.length} residents</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            placeholder="Search name, site, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-12 w-full sm:w-80"
          />
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((resident, i) => (
            <motion.div
              key={resident.email || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card hover:border-primary-500/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-xl font-bold">
                  {resident.site}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{resident.name}</h3>
                  <p className="text-sm text-dark-400 flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {resident.phone || 'No phone'}
                  </p>
                </div>
                <span className={`badge ${resident.role === 'Admin' ? 'badge-warning' : resident.role === 'Tenant' ? 'badge-info' : 'badge-success'}`}>
                  {resident.role}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// PLACEHOLDER PAGES
// ============================================================================
function VisitorsPage({ user, showToast }) {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [otp, setOtp] = useState(null);

  useEffect(() => { loadVisitors(); }, []);

  const loadVisitors = async () => {
    try {
      const res = await api.getVisitors(user);
      if (res.success) setVisitors(res.data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      phone: form.phone.value,
      visitDate: form.date.value,
      purpose: form.purpose.value
    };
    try {
      const res = await api.registerVisitor(data, user);
      if (res.success) {
        setOtp(res.otp);
        showToast('Visitor registered!');
        loadVisitors();
        form.reset();
      }
    } catch (e) { showToast('Error registering visitor', 'error'); }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Visitor Management</h1>
          <p className="text-dark-400">Pre-register visitors with secure OTP</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          <Plus className="w-4 h-4" /> Add Visitor
        </button>
      </div>

      {/* OTP Modal with WhatsApp Share */}
      {otp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setOtp(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="glass-card max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">🎫 Visitor OTP</h3>
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 mb-4">
              <p className="text-4xl font-mono font-bold tracking-widest text-white">{otp}</p>
            </div>
            <p className="text-dark-400 text-sm mb-4">Valid for 24 hours • Show at gate</p>
            
            {/* WhatsApp Share Button */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`🏠 *Green Avenue Visitor Pass*\n\n🎫 OTP: *${otp}*\n\n✅ Show this OTP at the gate.\n⏰ Valid for 24 hours.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white rounded-xl hover:bg-[#128C7E] transition-colors mb-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Share via WhatsApp
            </a>
            
            <button onClick={() => setOtp(null)} className="btn btn-secondary w-full">Close</button>
          </motion.div>
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Visitor Name</label>
              <input name="name" className="input" required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input name="phone" type="tel" className="input" required />
            </div>
            <div>
              <label className="label">Visit Date</label>
              <input name="date" type="date" className="input" defaultValue={new Date().toISOString().split('T')[0]} required />
            </div>
            <div>
              <label className="label">Purpose</label>
              <input name="purpose" className="input" placeholder="Optional" />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="btn btn-primary">
                <UserCheck className="w-4 h-4" /> Register Visitor
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Visitors Table */}
      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Visitor</th>
                <th>Phone</th>
                <th>Date</th>
                <th>OTP</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-dark-400">Loading...</td></tr>
              ) : visitors.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-dark-400">No visitors registered</td></tr>
              ) : visitors.map(v => (
                <tr key={v.ID}>
                  <td className="font-medium">{v.VisitorName}</td>
                  <td>{v.VisitorPhone}</td>
                  <td>{v.VisitDate}</td>
                  <td><span className={`font-mono font-bold ${v.otpExpired ? 'text-red-400' : 'text-primary-400'}`}>{v.OTP}</span></td>
                  <td><span className={`badge ${v.otpExpired ? 'badge-danger' : 'badge-success'}`}>{v.otpExpired ? 'Expired' : 'Valid'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function NoticesPage({ user }) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotices().then(res => {
      if (res.success) setNotices(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Community Notices</h1>
      {loading ? <p className="text-center text-dark-400">Loading...</p> : (
        <div className="space-y-4">
          {notices.map(n => (
            <motion.div
              key={n.ID}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card border-l-4 ${n.Type === 'Event' ? 'border-blue-500' : n.Type === 'Appreciation' ? 'border-primary-500' : 'border-accent-500'}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold">{n.Title}</h3>
                <span className={`badge ${n.Type === 'Event' ? 'badge-info' : n.Type === 'Appreciation' ? 'badge-success' : 'badge-warning'}`}>{n.Type}</span>
              </div>
              <p className="text-dark-300 mb-4">{n.Message}</p>
              <p className="text-sm text-dark-500">{n.PostedAt} • {n.PostedBy}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function PropertiesPage({ user }) {
  const [properties, setProperties] = useState([]);
  useEffect(() => { api.getProperties().then(res => res.success && setProperties(res.data)); }, []);
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Property Listings</h1>
      <div className="grid gap-4">
        {properties.map(p => (
          <div key={p.ID} className="glass-card flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.Type === 'rent' ? 'bg-blue-500/20 text-blue-400' : 'bg-accent-500/20 text-accent-400'}`}>
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold">Site #{p.SiteNumber}</p>
                <p className="text-sm text-dark-400">{p.PropertyType} • {p.BHK} • {p.Floor}</p>
              </div>
            </div>
            <span className={`badge ${p.Type === 'rent' ? 'badge-info' : 'badge-warning'}`}>{p.Type === 'rent' ? 'For Rent' : 'For Sale'}</span>
            <a href={`tel:${p.Contact}`} className="btn btn-secondary btn-sm"><Phone className="w-4 h-4" />{p.Contact}</a>
          </div>
        ))}
      </div>
    </div>
  );
}

function PollsPage({ user }) {
  const [polls, setPolls] = useState([]);
  useEffect(() => { api.getPolls().then(res => res.success && setPolls(res.data)); }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Community Polls</h1>
      <div className="space-y-6">
        {polls.map(poll => (
          <div key={poll.ID} className="glass-card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h3 className="text-lg font-semibold">{poll.Question}</h3>
              {poll.isExpired ? <span className="badge badge-danger">Ended</span> : <span className="badge badge-success">Active</span>}
            </div>
            <div className="space-y-3">
              {poll.options.map(opt => {
                const pct = poll.totalVotes > 0 ? Math.round((poll.votes[opt] / poll.totalVotes) * 100) : 0;
                return (
                  <div key={opt}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{opt} {poll.userVote === opt && '✓'}</span>
                      <span className="text-dark-400">{poll.votes[opt]} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} className="h-full bg-gradient-to-r from-primary-500 to-primary-600" />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-dark-500 mt-4">{poll.totalVotes} total votes • Ends {poll.EndDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsPage({ user }) {
  const [payments, setPayments] = useState([]);
  useEffect(() => { api.getPayments(user).then(res => res.success && setPayments(res.data)); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Maintenance Payments</h1>
      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead><tr><th>Month</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.ID}>
                  <td className="font-medium">{p.Month} {p.Year}</td>
                  <td>₹{p.Amount}</td>
                  <td><span className={`badge ${p.Status === 'Approved' ? 'badge-success' : p.Status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>{p.Status}</span></td>
                  <td className="text-dark-400">{p.SubmittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RequestsPage({ user }) {
  const [requests, setRequests] = useState([]);
  useEffect(() => { api.getRequests(user).then(res => res.success && setRequests(res.data)); }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Service Requests</h1>
      <div className="glass-card">
        <div className="table-container">
          <table>
            <thead><tr><th>Type</th><th>Message</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.ID}>
                  <td><span className="badge badge-info">{r.Type}</span></td>
                  <td className="max-w-xs truncate">{r.Message}</td>
                  <td><span className={`badge ${r.Status === 'Resolved' ? 'badge-success' : 'badge-warning'}`}>{r.Status}</span></td>
                  <td className="text-dark-400">{r.SubmittedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ user }) {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.getUsers(user).then(res => res.success && setUsers(res.data)); }, []);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      <div className="glass-card">
        <h2 className="text-lg font-semibold mb-4">User Management</h2>
        <div className="table-container">
          <table>
            <thead><tr><th>Site</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.email}>
                  <td className="font-bold text-primary-400">#{u.site}</td>
                  <td>{u.name}</td>
                  <td className="text-dark-400">{u.email}</td>
                  <td><span className="badge badge-info">{u.role}</span></td>
                  <td><span className={`badge ${u.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{u.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INSTALL APP BUTTON - PWA Support
// ============================================================================
function InstallAppButton() {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    
    // Check for install prompt
    const checkInstall = () => {
      if (window.deferredPrompt) {
        setCanInstall(true);
      }
    };
    
    checkInstall();
    window.addEventListener('beforeinstallprompt', () => setCanInstall(true));
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setCanInstall(false);
    });
  }, []);

  const handleInstall = async () => {
    const prompt = window.deferredPrompt;
    if (!prompt) return;
    
    prompt.prompt();
    const result = await prompt.userChoice;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
    }
    window.deferredPrompt = null;
    setCanInstall(false);
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-primary-500/10 rounded-lg text-primary-400 text-sm mb-2">
        <CheckCircle2 className="w-4 h-4" />
        App Installed
      </div>
    );
  }

  if (!canInstall) return null;

  return (
    <button
      onClick={handleInstall}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl text-white font-medium mb-2 hover:opacity-90 transition-opacity"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Install App
    </button>
  );
}

// ============================================================================
// AI CHATBOT - Smart Assistant
// ============================================================================
function AIChatbot({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi ${user?.name || 'there'}! 👋 I'm your Green Avenue assistant. How can I help you today?`, time: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Response Generator - Smart responses based on keywords
  const generateAIResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    // Greetings
    if (msg.match(/^(hi|hello|hey|good morning|good evening)/)) {
      return `Hello! 😊 Welcome to Green Avenue. I can help you with:\n\n• 🎫 Visitor registration\n• 💰 Payment queries\n• 📢 Community notices\n• 🔧 Service requests\n• 📞 Emergency contacts\n\nWhat would you like to know?`;
    }
    
    // Visitor related
    if (msg.includes('visitor') || msg.includes('guest')) {
      return `🎫 **Visitor Management**\n\nTo register a visitor:\n1. Go to **Visitors** page\n2. Click **Add Visitor**\n3. Enter visitor details\n4. Share the OTP with your guest\n\nThe OTP is valid for 24 hours. You can also share it via WhatsApp!\n\nNeed help with anything else?`;
    }
    
    // Payment related
    if (msg.includes('payment') || msg.includes('maintenance') || msg.includes('fee') || msg.includes('pay')) {
      return `💰 **Maintenance Payments**\n\n• Monthly maintenance: ₹1,500\n• Due date: 5th of every month\n• Late fee: ₹100 after 10th\n\n**Payment Methods:**\n• UPI: greenavenue@paytm\n• Bank Transfer: HDFC XXXX1234\n• QR Code: Available on Payments page\n\nGo to **Payments** page to submit your payment receipt.`;
    }
    
    // Emergency
    if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('help')) {
      return `🚨 **Emergency Contacts**\n\n• 🚔 Police: 100\n• 🚒 Fire: 101\n• 🚑 Ambulance: 102\n• 🛡️ Security: 9876543210\n• 👨‍💼 Association: 9876543211\n\nFor non-emergencies, submit a **Service Request**.`;
    }
    
    // Rules & Regulations
    if (msg.includes('rule') || msg.includes('regulation') || msg.includes('guideline')) {
      return `📋 **Community Guidelines**\n\n• 🔇 Quiet hours: 10 PM - 7 AM\n• 🚗 Parking: Designated spots only\n• 🐕 Pets: Keep on leash in common areas\n• 🚮 Garbage: Segregate & dispose by 8 AM\n• 🏗️ Renovations: Prior approval needed\n\nCheck **Notices** for latest updates!`;
    }
    
    // Facilities
    if (msg.includes('facility') || msg.includes('amenity') || msg.includes('gym') || msg.includes('pool') || msg.includes('park')) {
      return `🏢 **Community Facilities**\n\n• 🏋️ Gym: 6 AM - 10 PM\n• 🏊 Pool: 6 AM - 8 PM\n• 🌳 Park: Always open\n• 🎉 Clubhouse: Book via requests\n• 🚗 Parking: 2 spots per unit\n\nBook facilities through **Service Requests**.`;
    }
    
    // Contact/Support
    if (msg.includes('contact') || msg.includes('support') || msg.includes('call') || msg.includes('reach')) {
      return `📞 **Contact Information**\n\n• **Office Hours:** 9 AM - 6 PM\n• **Association Email:** info@greenavenue.com\n• **Security:** 9876543210\n• **Maintenance:** 9876543211\n\nOr submit a **Service Request** anytime!`;
    }
    
    // Events
    if (msg.includes('event') || msg.includes('festival') || msg.includes('celebration')) {
      return `🎉 **Upcoming Events**\n\nCheck the **Notices** section for:\n• Community gatherings\n• Festival celebrations\n• Annual general meetings\n• Sports tournaments\n\nWant to organize an event? Contact the association!`;
    }
    
    // Property
    if (msg.includes('rent') || msg.includes('sale') || msg.includes('property') || msg.includes('flat')) {
      return `🏠 **Property Listings**\n\nLooking to rent or buy?\n→ Check **Properties** page\n\nWant to list your property?\n1. Go to **Properties**\n2. Click **Add Listing**\n3. Fill in details\n\n*Note: Only owners can list properties.*`;
    }
    
    // Polls
    if (msg.includes('poll') || msg.includes('vote') || msg.includes('survey')) {
      return `🗳️ **Community Polls**\n\nActive polls are on the **Polls** page.\n\n• Each resident gets one vote\n• Vote before the deadline\n• Results shown after voting ends\n\nYour voice matters! 🎯`;
    }
    
    // Thanks
    if (msg.match(/(thank|thanks|thx)/)) {
      return `You're welcome! 😊 Happy to help. Is there anything else you'd like to know about Green Avenue?`;
    }
    
    // Bye
    if (msg.match(/(bye|goodbye|see you|later)/)) {
      return `Goodbye! 👋 Have a great day. Feel free to chat anytime you need help!`;
    }
    
    // Default response
    return `I understand you're asking about "${userMessage}". 🤔\n\nHere's what I can help with:\n\n• 🎫 Visitor registration\n• 💰 Payment information\n• 📢 Notices & events\n• 🔧 Service requests\n• 📞 Emergency contacts\n• 🏢 Facility bookings\n• 📋 Rules & guidelines\n\nTry asking about any of these topics!`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userMessage, time: new Date() }]);
    
    // Simulate typing
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    setIsTyping(false);
    
    // Add bot response
    const botResponse = generateAIResponse(userMessage);
    setMessages(prev => [...prev, { role: 'bot', text: botResponse, time: new Date() }]);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestions
  const suggestions = ['Visitor OTP', 'Payment info', 'Emergency', 'Facilities'];

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? 'bg-dark-700' 
            : 'bg-gradient-to-r from-primary-500 to-accent-500'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] h-[500px] max-h-[70vh] bg-dark-900 rounded-2xl border border-dark-700 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Green Avenue Assistant</h3>
                <p className="text-xs text-white/70 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI-Powered
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary-500 text-white rounded-br-md' 
                      : 'bg-dark-800 text-dark-100 rounded-bl-md'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-dark-500'}`}>
                      {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-dark-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-dark-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => { setInput(s); }}
                    className="text-xs px-3 py-1.5 bg-dark-800 hover:bg-dark-700 rounded-full text-dark-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-dark-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-700 disabled:text-dark-500 rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

