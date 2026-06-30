import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserNotifications, markNotificationAsRead, NotificationItem } from '../firebase/dbService';
import { 
  Bell, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Sparkles, 
  SlidersHorizontal,
  Home,
  BookOpen,
  Info,
  PhoneCall,
  HelpCircle
} from 'lucide-react';

export default function Navbar() {
  const { user, userProfile, logout, isCustomer, isProfessional, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const data = await getUserNotifications(user.uid);
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      };
      
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000); // Check every 10s
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleNotificationClick = async (notifId: string) => {
    await markNotificationAsRead(notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const navigateTo = (hash: string) => {
    window.location.hash = hash;
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigateTo('#login');
  };

  const getDashboardHash = () => {
    if (isAdmin) return '#admin-dashboard';
    if (isProfessional) return '#professional-dashboard';
    return '#customer-dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigateTo('#home')} 
              className="flex items-center space-x-2 text-2xl font-black tracking-tight text-blue-600 focus:outline-hidden"
              id="nav-logo"
            >
              <span className="bg-blue-600 text-white px-2.5 py-1 rounded-md text-xl mr-1 shadow-xs">F</span>
              <span>FixKer<span className="text-slate-400">.pk</span></span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => navigateTo('#home')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors cursor-pointer">Home</button>
            <button onClick={() => navigateTo('#services')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors cursor-pointer">Services</button>
            <button onClick={() => navigateTo('#blog')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors cursor-pointer">Blog</button>
            <button onClick={() => navigateTo('#faq')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors cursor-pointer">FAQ</button>
            <button onClick={() => navigateTo('#about')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors cursor-pointer">About Us</button>
            <button onClick={() => navigateTo('#contact')} className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors cursor-pointer">Contact</button>
          </div>

          {/* Actions / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-50 relative focus:outline-hidden"
                    id="nav-notif-bell"
                  >
                    <Bell className="h-5.5 w-5.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <span className="font-bold text-slate-800 text-sm">Notifications</span>
                        <span className="text-xs text-blue-600 font-medium">{unreadCount} Unread</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-slate-400 text-sm">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <button
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif.id)}
                              className={`w-full text-left px-4 py-3 hover:bg-slate-55 flex flex-col space-y-1 border-b border-slate-50 last:border-0 transition-colors ${!notif.isRead ? 'bg-blue-50/20' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <span className={`font-semibold text-xs ${!notif.isRead ? 'text-blue-700' : 'text-slate-700'}`}>{notif.title}</span>
                                {!notif.isRead && <span className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></span>}
                              </div>
                              <p className="text-slate-600 text-xs leading-relaxed">{notif.message}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Nav Button */}
                <button 
                  onClick={() => navigateTo(getDashboardHash())}
                  className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 font-medium text-sm bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-150 transition-all"
                  id="nav-dashboard-btn"
                >
                  <img 
                    src={userProfile?.photoURL || user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user.uid}`} 
                    alt="avatar" 
                    className="h-6 w-6 rounded-full border border-blue-100 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span>Dashboard</span>
                  {userProfile?.role === 'admin' && (
                    <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-bold uppercase">Admin</span>
                  )}
                  {userProfile?.role === 'professional' && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded font-bold uppercase">Pro</span>
                  )}
                </button>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => navigateTo('#login')} 
                  className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigateTo('#signup')} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2.5 rounded-lg shadow-sm transition-all hover:shadow-md cursor-pointer"
                >
                  Register Now
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            {user && (
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-1.5 text-slate-500 hover:text-blue-600 rounded-full hover:bg-slate-50 relative focus:outline-hidden"
              >
                <Bell className="h-5.5 w-5.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-50 focus:outline-hidden"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications modal for mobile if open */}
      {notificationsOpen && user && (
        <div className="md:hidden border-t border-slate-100 bg-slate-50 px-4 py-2">
          <div className="flex justify-between items-center py-2">
            <span className="font-bold text-slate-800 text-sm">Notifications ({unreadCount})</span>
            <button onClick={() => setNotificationsOpen(false)} className="text-xs text-slate-500">Close</button>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2 pb-2">
            {notifications.length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-4">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif.id)}
                  className={`p-2.5 rounded-lg border border-slate-150 text-xs bg-white ${!notif.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/10' : ''}`}
                >
                  <div className="font-semibold text-slate-800 flex justify-between items-center">
                    <span>{notif.title}</span>
                    {!notif.isRead && <span className="h-1.5 w-1.5 bg-blue-500 rounded-full"></span>}
                  </div>
                  <p className="text-slate-600 mt-0.5">{notif.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => navigateTo('#home')}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              <Home className="h-5 w-5 text-slate-400" />
              <span>Home</span>
            </button>
            <button
              onClick={() => navigateTo('#services')}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              <Sparkles className="h-5 w-5 text-slate-400" />
              <span>Services</span>
            </button>
            <button
              onClick={() => navigateTo('#blog')}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              <BookOpen className="h-5 w-5 text-slate-400" />
              <span>Blog Articles</span>
            </button>
            <button
              onClick={() => navigateTo('#faq')}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              <HelpCircle className="h-5 w-5 text-slate-400" />
              <span>FAQ</span>
            </button>
            <button
              onClick={() => navigateTo('#about')}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              <Info className="h-5 w-5 text-slate-400" />
              <span>About Us</span>
            </button>
            <button
              onClick={() => navigateTo('#contact')}
              className="w-full text-left flex items-center space-x-3 px-3 py-2.5 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              <PhoneCall className="h-5 w-5 text-slate-400" />
              <span>Contact</span>
            </button>

            <div className="pt-4 pb-2 border-t border-slate-100 mt-4 px-3 flex flex-col space-y-2">
              {user ? (
                <>
                  <button
                    onClick={() => navigateTo(getDashboardHash())}
                    className="w-full text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigateTo('#login')}
                    className="w-full text-center border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigateTo('#signup')}
                    className="w-full text-center bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700"
                  >
                    Register Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
