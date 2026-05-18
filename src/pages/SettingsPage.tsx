import { Settings, User, Palette, Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const settingsCards = [
  {
    icon: User,
    title: 'Profile Settings',
    description: 'Update your personal information, contact details and farm profile.',
    action: '/profile',
    actionLabel: 'Manage Profile',
    accentColor: 'text-primary',
    bgColor: 'bg-primary/10',
    borderHover: 'hover:border-primary/40',
    isNav: true,
  },
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Customize the dashboard theme, layout density, and display preferences.',
    action: '/appearance',
    actionLabel: 'Customize Theme',
    accentColor: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderHover: 'hover:border-purple-400/40',
    isNav: true,
  },
  {
    icon: Globe,
    title: 'Language & Region',
    description: 'Set your preferred language, time zone, and regional number formats.',
    action: '/language',
    actionLabel: 'Change Settings',
    accentColor: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderHover: 'hover:border-blue-400/40',
    isNav: true,
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  const handleAction = (card: typeof settingsCards[0]) => {
    if (card.isNav && card.action) {
      navigate(card.action);
    } else {
      toast.info(`${card.title} — coming soon!`);
    }
  };

  return (
    <div className="p-6 lg:p-10 bg-background min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Settings className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight uppercase">
            System Settings
          </h1>
        </div>
        <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.3em] ml-1">
          Account, Preferences & Application Configuration
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {settingsCards.map((card) => (
          <div
            key={card.title}
            onClick={() => handleAction(card)}
            className={`group bg-card/50 border border-border ${card.borderHover} rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5`}
          >
            {/* Icon */}
            <div className={`${card.bgColor} p-3 rounded-xl w-fit mb-5`}>
              <card.icon className={`h-6 w-6 ${card.accentColor}`} />
            </div>

            {/* Text */}
            <h3 className="text-foreground text-base font-semibold mb-2">{card.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">{card.description}</p>

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
