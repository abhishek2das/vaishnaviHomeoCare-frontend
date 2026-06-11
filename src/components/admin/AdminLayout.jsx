import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {  LayoutDashboard,  Calendar,  Users,  MessageSquare,  FileText,  Image as ImageIcon,  Trophy,  HelpCircle,  Settings, LogOut, Menu, X, User, Mail, Monitor } from 'lucide-react';
import { API_ENDPOINTS } from '../../api/endpoints';
import { fetchWithAuth } from '../../api/apiClient';
import image from '../../assets/site_logo_v2.png'
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle window resize for mobile check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isCmsOpen, setIsCmsOpen] = useState(false);

  // Verify authentication token on mount
  useEffect(() => {
    const verifyAuthentication = async () => {
      const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
      if (!isAuthenticated) {
        navigate('/admin/login', { replace: true });
        return;
      }

      try {
        const res = await fetchWithAuth(API_ENDPOINTS.AUTH.VERIFY);
        if (!res.ok) {
          localStorage.removeItem('adminAuthenticated');
          localStorage.removeItem('adminToken');
          navigate('/admin/login', { replace: true });
        }
      } catch (err) {
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
        navigate('/admin/login', { replace: true });
      }
    };

    verifyAuthentication();
  }, [navigate]);

  // Close sidebar on mobile after route change
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Check authentication on mount
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  // Open CMS dropdown if we are on a CMS route
  useEffect(() => {
    if (location.pathname.startsWith('/admin/cms')) {
      setIsCmsOpen(true);
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Contact Inquiries', path: '/admin/contacts', icon: Mail },
    { 
      name: 'CMS', 
      icon: Monitor,
      subItems: [
        { name: 'About Us', path: '/admin/cms/about' },
        { name: 'Services', path: '/admin/cms/services' }
      ]
    },
    { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { name: 'Blog', path: '/admin/press', icon: FileText },
    { name: 'Gallery', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Patient Feedback', path: '/admin/patient-feedback', icon: ImageIcon },
    { name: 'Awards', path: '/admin/awards', icon: Trophy },
    { name: 'FAQ', path: '/admin/faq', icon: HelpCircle }, 
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-hidden">
      
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between p-4 lg:p-6 h-16 lg:h-20 border-b border-slate-600">
          <div className="w-64 brightness-0 invert flex items-center justify-center">
            <img src={image} alt="Medicare Clinic Logo" />
          </div>
          {isMobile && (
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-300 hover:text-white">
              <X size={24} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                {item.subItems ? (
                  <div className="mb-1">
                    <button
                      onClick={() => setIsCmsOpen(!isCmsOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-slate-600 hover:text-white`}
                    >
                      <div className="flex items-center">
                        <item.icon size={20} className="mr-3 flex-shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="text-xs transition-transform duration-200" style={{ transform: isCmsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M0 0h24v24H0z" fill="none" />
                          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 10l-5 5l-5-5" />
                        </svg>
                      </span>
                    </button>
                    {isCmsOpen && (
                      <ul className="mt-1 ml-9 space-y-1">
                        {item.subItems.map(subItem => (
                          <li key={subItem.name}>
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) => `block px-4 py-2 text-sm rounded-lg transition-colors
                                ${isActive 
                                  ? 'bg-slate-600 text-green-400 font-semibold border-l-2 border-green-500' 
                                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
                                }
                              `}
                            >
                              {subItem.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'} // Exact match for dashboard
                    className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-slate-600 text-green-400 font-semibold border border-slate-500' 
                        : 'text-gray-300 hover:bg-slate-600 hover:text-white border-l-4 border-transparent'
                      }
                    `}
                  >
                    <item.icon size={20} className="mr-3 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#2c543f]">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-[#204633] rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
          <div className="flex items-center">
            {isMobile && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">Admin Panel</h1>
          </div>
           

            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-gray-600">
                <User size={20} />
              </div>
            </div>
         
        </header>

        {/* Main Outlet */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
