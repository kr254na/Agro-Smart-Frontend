import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Sprout, 
  Radio, 
  TrendingUp, 
  Cloud, 
  Users, 
  ShoppingCart, 
  Bell, 
  Settings,
  Home,
  Info,
  LogOut
} from 'lucide-react';
import { cn } from './ui/utils';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Sprout, label: 'Farms', path: '/farms' },
  { icon: Radio, label: 'Sensors', path: '/sensors' },
  { icon: TrendingUp, label: 'Analysis', path: '/analysis' },
  { icon: Cloud, label: 'Weather', path: '/weather' },
  { icon: Users, label: 'Community', path: '/community' },
  { icon: ShoppingCart, label: 'Marketplace', path: '/marketplace' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed right-0 lg:left-0 lg:right-auto top-20 h-[calc(100vh-5rem)] bg-gray-950 border-l lg:border-r border-gray-800 z-40 transition-transform duration-300',
          'w-64 flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {/* Mobile Only: Global Links */}
          <div className="lg:hidden space-y-2 mb-6">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">Navigation</p>
            <Link
              to="/"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-900 transition-all"
            >
              <Home className="h-5 w-5" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <Link
              to="/about"
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-900 transition-all"
            >
              <Info className="h-5 w-5" />
              <span className="text-sm font-medium">About</span>
            </Link>
            <div className="h-px bg-gray-800 mx-4 my-4" />
          </div>

          <p className="hidden lg:block text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">Dashboard</p>
          
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/20 font-bold'
                    : 'text-gray-400 hover:text-green-400 hover:bg-gray-900 border border-transparent hover:border-green-500/20'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Action Area */}
        <div className="p-4 border-t border-gray-800 bg-gray-950/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-bold uppercase tracking-wider">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
