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
            {isLoggedIn && isDashboardRoute && (
              <button onClick={onMenuToggle} className="lg:hidden text-gray-400 hover:text-green-400">
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
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
              <DropdownMenu>
                {/* REMOVED asChild to ensure the click event is caught directly by the trigger */}
                <DropdownMenuTrigger className="p-2 rounded-full text-gray-400 hover:text-green-400 hover:bg-gray-900 outline-none transition-colors">
                   <User className="h-6 w-6" />
                </DropdownMenuTrigger>
                
                <DropdownMenuPortal>
                  <DropdownMenuContent 
                    align="end" 
                    sideOffset={5}
                    className="w-64 bg-gray-900 border border-gray-800 text-white shadow-2xl z-[110] p-1"
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
            ) : (
              <div className="hidden lg:flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white">Login</Link>
                <Link to="/register">
                  <Button className="bg-green-600 hover:bg-green-700 text-white">Get Started</Button>
                </Link>
              </div>
            )}
            
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-green-400">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}