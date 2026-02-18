import { Settings, User, Bell, Lock, Palette, Globe } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <div className="p-6 lg:p-8 pt-24  min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl text-white mb-2 font-bold leading-tight">Settings</h1>
        <p className="text-gray-400">
          Manage your account, preferences, and application settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#48D87D]/20 transition-colors shadow-lg">
          <div className="bg-[#48D87D]/10 p-3 rounded-lg w-fit mb-4">
            <User className="h-6 w-6 text-[#48D87D]" />
          </div>
          <h3 className="text-white text-lg mb-2 font-semibold">Profile Settings</h3>
          <p className="text-gray-400 text-sm mb-4">
            Update your personal information and contact details
          </p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-black hover:bg-[#2a2a2a] hover:text-[#48D87D]"
            onClick={() => navigate('/profile')}
          >
            Manage Profile
          </Button>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#48D87D]/20 transition-colors shadow-lg">
          <div className="bg-[#48D87D]/10 p-3 rounded-lg w-fit mb-4">
            <Bell className="h-6 w-6 text-[#48D87D]" />
          </div>
          <h3 className="text-white text-lg mb-2 font-semibold">Notifications</h3>
          <p className="text-gray-400 text-sm mb-4">
            Configure your notification preferences and alerts
          </p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-black hover:bg-[#2a2a2a] hover:text-[#48D87D]"
            onClick={() => navigate('/notifications')}
          >
            Configure Alerts
          </Button>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#48D87D]/20 transition-colors shadow-lg">
          <div className="bg-[#48D87D]/10 p-3 rounded-lg w-fit mb-4">
            <Lock className="h-6 w-6 text-[#48D87D]" />
          </div>
          <h3 className="text-white text-lg mb-2 font-semibold">Security</h3>
          <p className="text-gray-400 text-sm mb-4">
            Manage passwords, two-factor authentication, and security
          </p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-black hover:bg-[#2a2a2a] hover:text-[#48D87D]"
            onClick={() => alert('Security settings coming soon!')}
          >
            Security Settings
          </Button>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#48D87D]/20 transition-colors shadow-lg">
          <div className="bg-[#48D87D]/10 p-3 rounded-lg w-fit mb-4">
            <Palette className="h-6 w-6 text-[#48D87D]" />
          </div>
          <h3 className="text-white text-lg mb-2 font-semibold">Appearance</h3>
          <p className="text-gray-400 text-sm mb-4">
            Customize the look and feel of your dashboard
          </p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-black hover:bg-[#2a2a2a] hover:text-[#48D87D]"
            onClick={() => alert('Theme customization coming soon!')}
          >
            Customize Theme
          </Button>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#48D87D]/20 transition-colors shadow-lg">
          <div className="bg-[#48D87D]/10 p-3 rounded-lg w-fit mb-4">
            <Globe className="h-6 w-6 text-[#48D87D]" />
          </div>
          <h3 className="text-white text-lg mb-2 font-semibold">Language & Region</h3>
          <p className="text-gray-400 text-sm mb-4">
            Set your preferred language and regional settings
          </p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-black hover:bg-[#2a2a2a] hover:text-[#48D87D]"
            onClick={() => alert('Language and region settings coming soon!')}
          >
            Change Settings
          </Button>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 hover:border-[#48D87D]/20 transition-colors shadow-lg">
          <div className="bg-[#48D87D]/10 p-3 rounded-lg w-fit mb-4">
            <Settings className="h-6 w-6 text-[#48D87D]" />
          </div>
          <h3 className="text-white text-lg mb-2 font-semibold">Advanced Settings</h3>
          <p className="text-gray-400 text-sm mb-4">
            Configure sensor thresholds, data retention, and API access
          </p>
          <Button 
            variant="outline" 
            className="w-full border-gray-700 text-black hover:bg-[#2a2a2a] hover:text-[#48D87D]"
            onClick={() => alert('Advanced options coming soon!')}
          >
            Advanced Options
          </Button>
        </div>
      </div>
    </div>
  );
}
