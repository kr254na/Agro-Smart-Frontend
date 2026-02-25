import { Settings, User, Bell, Lock, Palette, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const settingsCards = [
  {
    icon: User,
    title: 'Profile Settings',
    description: 'Update your personal information, contact details and farm profile.',
    action: '/profile',
    actionLabel: 'Manage Profile',
    accentColor: 'text-[#48D87D]',
    bgColor: 'bg-[#48D87D]/10',
    borderHover: 'hover:border-[#48D87D]/40',
    isNav: true,
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Configure alert preferences, sensor thresholds, and notification channels.',
    action: '/notifications',
    actionLabel: 'Configure Alerts',
    accentColor: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderHover: 'hover:border-amber-400/40',
    isNav: true,
  },
  {
    icon: Lock,
    title: 'Security',
    description: 'Manage your password, two-factor authentication, and login sessions.',
    action: null,
    actionLabel: 'Security Settings',
    accentColor: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderHover: 'hover:border-red-400/40',
    isNav: false,
  },
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Customize the dashboard theme, layout density, and display preferences.',
    action: null,
    actionLabel: 'Customize Theme',
    accentColor: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderHover: 'hover:border-purple-400/40',
    isNav: false,
  },
  {
    icon: Globe,
    title: 'Language & Region',
    description: 'Set your preferred language, time zone, and regional number formats.',
    action: null,
    actionLabel: 'Change Settings',
    accentColor: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderHover: 'hover:border-blue-400/40',
    isNav: false,
  },
  {
    icon: Settings,
    title: 'Advanced Settings',
    description: 'Configure sensor thresholds, data retention policies, and API access tokens.',
    action: null,
    actionLabel: 'Advanced Options',
    accentColor: 'text-slate-400',
    bgColor: 'bg-slate-400/10',
    borderHover: 'hover:border-slate-400/40',
    isNav: false,
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleAction = (card: typeof settingsCards[0]) => {
    if (card.isNav && card.action) {
      navigate(card.action);
    } else {
      alert(`${card.title} — coming soon!`);
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[#48D87D]/20 rounded-lg">
            <Settings className="h-6 w-6 text-[#48D87D]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">
            System Settings
          </h1>
        </div>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] ml-1">
          Account, Preferences & Application Configuration
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settingsCards.map((card) => (
          <div
            key={card.title}
            onClick={() => handleAction(card)}
            className={`group bg-gray-900/50 border border-gray-800 ${card.borderHover} rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5`}
          >
            {/* Icon */}
            <div className={`${card.bgColor} p-3 rounded-xl w-fit mb-5`}>
              <card.icon className={`h-6 w-6 ${card.accentColor}`} />
            </div>

            {/* Text */}
            <h3 className="text-white text-base font-semibold mb-2">{card.title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{card.description}</p>

            {/* Action Row */}
            <div className={`flex items-center gap-2 text-sm font-semibold ${card.accentColor} group-hover:gap-3 transition-all`}>
              <span>{card.actionLabel}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-slate-700 text-xs text-center mt-12 uppercase tracking-widest font-bold">
        AgroSmart v2.0 · All settings auto-save
      </p>
    </div>
  );
}
