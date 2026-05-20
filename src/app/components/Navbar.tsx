import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@/app/components/ui/dropdown-menu";

import { getStorage, clearAllStorage } from '../../utils/storage';
import Marketplace from '@/pages/Marketplace';

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
    const token = getStorage('token');
    setIsLoggedIn(!!token);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    clearAllStorage();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isDashboardRoute = [
    '/dashboard', '/farms', '/sensors', '/analysis', '/weather', '/community', '/marketplace', '/settings', '/profile', '/smart-eye'
  ].some(path => location.pathname === path || location.pathname.startsWith(path + '/'));

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Weather', path: '/weather' },
    ...(isLoggedIn ? [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Farms', path: '/farms' },
    ] : []),
      { name: 'Smart Eye', path: '/smart-eye' },
      { name: 'Settings', path: '/settings' },
  ];


  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled || isDashboardRoute ? 'bg-background/95 backdrop-blur-lg border-b border-green-500/20 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-6 h-6 text-foreground" />
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
                className={`text-sm font-medium transition-colors hover:text-green-400 ${location.pathname === link.path ? 'text-green-400' : 'text-secondary-foreground'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 rounded-full text-muted-foreground hover:text-green-400 hover:bg-card outline-none transition-colors">
                    <User className="h-6 w-6" />
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuPortal>
                    <DropdownMenuContent 
                      align="end" 
                      sideOffset={5}
                      className="w-[calc(100vw-32px)] sm:w-64 bg-card border border-border text-foreground shadow-2xl z-[110] p-1"
                    >
                      <div className="px-3 py-3 mb-1 border-b border-border bg-background/50 rounded-t-md">
                        <p className="text-sm font-semibold text-green-400">Account</p>
                        <p className="text-[10px] text-muted-foreground truncate">{getStorage('user_email')}</p>
                      </div>
                      
                      <DropdownMenuItem onSelect={() => navigate('/profile')} className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent outline-none rounded-sm">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onSelect={() => navigate('/settings')} className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-accent outline-none rounded-sm">
                        <SettingsIcon className="mr-2 h-4 w-4" /> Settings
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="bg-accent my-1" />
                      
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
                <Link to="/login" className="text-sm font-medium text-secondary-foreground hover:text-foreground">Login</Link>
                <Link to="/login">
                  <Button className="bg-green-600 hover:bg-green-700 text-foreground">Get Started</Button>
                </Link>
              </div>
            )}
            
            {/* Toggles Group on Right */}
            <div className="flex items-center gap-1">
              {isLoggedIn && isDashboardRoute && (
                <button onClick={onMenuToggle} className="lg:hidden p-2 text-muted-foreground hover:text-green-400">
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
            className="lg:hidden fixed inset-x-0 top-20 bg-background/95 backdrop-blur-lg border-b border-green-500/20 shadow-lg p-4 pb-6 z-[90]"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-lg font-medium transition-colors hover:text-green-400 ${location.pathname === link.path ? 'text-green-400' : 'text-secondary-foreground'}`}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <div className="h-px bg-accent my-2" />
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-secondary-foreground hover:text-green-400 flex items-center gap-2">
                    <User size={18} /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="text-secondary-foreground hover:text-green-400 flex items-center gap-2">
                    <SettingsIcon size={18} /> Settings
                  </Link>
                  <div className="h-px bg-accent my-2" />
                  <button onClick={handleLogout} className="text-left text-lg font-medium text-red-400 hover:text-red-500 flex items-center gap-2">
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-accent my-2" />
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-secondary-foreground hover:text-foreground">Login</Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-foreground text-lg">Get Started</Button>
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