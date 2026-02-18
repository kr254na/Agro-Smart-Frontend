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
} from 'lucide-react';
import { cn } from './ui/utils';

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
          'fixed left-0 top-20 h-[calc(100vh-5rem)] bg-gray-950 border-r border-gray-800 z-40 transition-transform duration-300',
          'w-64 overflow-y-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="p-4 space-y-2">
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
                    ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                    : 'text-gray-400 hover:text-green-400 hover:bg-gray-900'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
