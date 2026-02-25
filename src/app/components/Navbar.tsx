import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, Bell, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@/app/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";

interface NavbarProps {
  onMenuToggle?: () => void;
  isSidebarOpen?: boolean;
}

export default function Navbar({ onMenuToggle, isSidebarOpen }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: 'Low Soil Moisture',
      message: 'Zone A moisture level is 32%.',
      time: '10m ago',
      type: 'sensor'
    },
    {
      id: 2,
      title: 'Heavy Rainfall',
      message: 'Storm expected tomorrow.',
      time: '2h ago',
      type: 'weather'
    },
    {
      id: 3,
      title: 'AI Insight',
      message: 'Optimal maize conditions detected.',
      time: '3h ago',
      type: 'ai'
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isDashboardRoute = [
    '/dashboard', '/farms', '/sensors', '/analysis', '/weather', '/community', '/marketplace', '/notifications', '/settings', '/profile'
  ].some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    ...(isLoggedIn ? [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Farms', path: '/farms' },
      { name: 'Market', path: '/marketplace' },
      { name: 'Community', path: '/community' },
    ] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled || isDashboardRoute ? 'bg-gray-950/95 backdrop-blur-lg border-b border-green-500/20 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent hidden sm:inline">
                AgroSmart
              </span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-sm font-medium transition-colors hover:text-green-400 ${location.pathname === link.path ? 'text-green-400' : 'text-gray-300'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                  <PopoverTrigger asChild>
                    <button className="relative p-2 rounded-full text-gray-400 hover:text-green-400 hover:bg-gray-900 outline-none transition-colors">
                      <Bell className="h-6 w-6" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-950"></span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent 
                    align="end" 
                    sideOffset={8}
                    className="w-[calc(100vw-32px)] sm:w-80 bg-gray-900 border-gray-800 text-white p-0 shadow-2xl z-[110] max-h-[calc(100vh-100px)] flex flex-col"
                  >
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950/50 flex-shrink-0">
                      <h3 className="font-bold text-sm text-green-400 uppercase tracking-widest">Notifications</h3>
                      <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full font-bold">3 NEW</span>
                    </div>
                    <div className="overflow-y-auto custom-scrollbar">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => {
                            setNotifOpen(false);
                            navigate('/notifications');
                          }}
                          className="p-4 border-b border-gray-800/50 hover:bg-gray-800/50 cursor-pointer transition-colors"
                        >
                          <div className="flex justify-between mb-1">
                            <h4 className="text-xs font-bold text-gray-200">{notif.title}</h4>
                            <span className="text-[10px] text-gray-500">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 line-clamp-2">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setNotifOpen(false);
                        navigate('/notifications');
                      }}
                      className="w-full p-3 text-center text-xs font-bold text-green-400 hover:bg-gray-800 border-t border-gray-800 transition-colors uppercase tracking-widest flex-shrink-0"
                    >
                      View all notifications
                    </button>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 rounded-full text-gray-400 hover:text-green-400 hover:bg-gray-900 outline-none transition-colors">
                    <User className="h-6 w-6" />
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuPortal>
                    <DropdownMenuContent 
                      align="end" 
                      sideOffset={5}
                      className="w-[calc(100vw-32px)] sm:w-64 bg-gray-900 border border-gray-800 text-white shadow-2xl z-[110] p-1"
                    >
                      <div className="px-3 py-3 mb-1 border-b border-gray-800 bg-gray-950/50 rounded-t-md">
                        <p className="text-sm font-semibold text-green-400">Account</p>
                        <p className="text-[10px] text-gray-400 truncate">{localStorage.getItem('user_email')}</p>
                      </div>
                      
                      <DropdownMenuItem onSelect={() => navigate('/profile')} className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-800 outline-none rounded-sm">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onSelect={() => navigate('/settings')} className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-800 outline-none rounded-sm">
                        <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="bg-gray-800 my-1" />
                      
                      <DropdownMenuItem 
                        onSelect={handleLogout} 
                        className="flex items-center px-3 py-2 text-sm text-red-400 cursor-pointer hover:bg-red-500/10 outline-none rounded-sm"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenuPortal>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white">Login</Link>
                <Link to="/register">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
                </Link>
              </div>
            )}
            
            {/* Toggles Group on Right */}
            <div className="flex items-center gap-1">
              {isLoggedIn && isDashboardRoute && (
                <button onClick={onMenuToggle} className="lg:hidden p-2 text-gray-400 hover:text-green-400">
                  {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
              
              {!isDashboardRoute && (
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-green-400">
                  {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed inset-x-0 top-20 bg-gray-950/95 backdrop-blur-lg border-b border-green-500/20 shadow-lg p-4 pb-6 z-[90]"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-green-400 ${location.pathname === link.path ? 'text-green-400' : 'text-gray-300'}`}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <div className="h-px bg-gray-800 my-2" />
                  <Link to="/notifications" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-green-400 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell size={18} /> Notifications
                    </div>
                    <span className="bg-red-500 w-2 h-2 rounded-full"></span>
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-green-400 flex items-center gap-2">
                    <User size={18} /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 hover:text-green-400 flex items-center gap-2">
                    <SettingsIcon size={18} /> Settings
                  </Link>
                  <div className="h-px bg-gray-800 my-2" />
                  <button onClick={handleLogout} className="text-left text-lg font-medium text-red-400 hover:text-red-500 flex items-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-gray-800 my-2" />
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Login</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white text-lg">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}