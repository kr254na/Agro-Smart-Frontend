import { useState, useEffect } from 'react';
import { ArrowLeft, Monitor, Moon, Sun, Check, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function AppearancePage() {
  const navigate = useNavigate();
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'agrofy');
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('accentColor') || 'emerald');

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    document.documentElement.classList.remove('dark', 'agrofy');
    if (newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'agrofy') {
      document.documentElement.classList.add('agrofy');
    }
  };

  const themes = [
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'Easy on the eyes, best for night' },
    { id: 'system', name: 'System', icon: Monitor, description: 'Follows your OS settings' },
    { id: 'agrofy', name: 'Agrofy', icon: Palette, description: 'Deep space neon dark theme' },
  ];

  const colors = [
    { id: 'emerald', name: 'Emerald', value: 'bg-primary', ring: 'ring-primary' },
    { id: 'blue', name: 'Ocean', value: 'bg-blue-500', ring: 'ring-blue-500' },
    { id: 'purple', name: 'Amethyst', value: 'bg-purple-500', ring: 'ring-purple-500' },
    { id: 'amber', name: 'Amber', value: 'bg-amber-500', ring: 'ring-amber-500' },
    { id: 'rose', name: 'Rose', value: 'bg-rose-500', ring: 'ring-rose-500' },
  ];

  const handleSave = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('accentColor', accentColor);
    toast.success('Appearance settings saved successfully');
    navigate('/settings');
  };

  return (
    <div className="p-6 lg:p-10 bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/settings')}
            className="p-2 bg-card hover:bg-accent rounded-lg transition-colors border border-border"
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight uppercase">
              Appearance
            </h1>
            <p className="text-slate-500 text-sm mt-1">Customize your dashboard theme and colors</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Theme Selection */}
          <section className="bg-card/50 border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-400/10 rounded-lg">
                <Palette className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Theme Preference</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`relative p-5 rounded-xl border text-left transition-all ${theme === t.id
                      ? 'border-primary bg-primary/10'
                      : 'border-input bg-accent/50 hover:border-gray-600'
                    }`}
                >
                  {theme === t.id && (
                    <div className="absolute top-4 right-4 text-primary">
                      <Check className="h-5 w-5" />
                    </div>
                  )}
                  <t.icon className={`h-6 w-6 mb-3 ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <h3 className={`font-medium mb-1 ${theme === t.id ? 'text-foreground' : 'text-secondary-foreground'}`}>
                    {t.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t.description}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Accent Color Selection */}
          <section className="bg-card/50 border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6">Accent Color</h2>
            <div className="flex flex-wrap gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setAccentColor(color.id)}
                  className={`group relative flex flex-col items-center gap-2`}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${color.value} flex items-center justify-center transition-all
                      ${accentColor === color.id ? 'ring-4 ring-offset-2 ring-offset-gray-900 ' + color.ring : 'hover:scale-110'}
                    `}
                  >
                    {accentColor === color.id && <Check className="h-5 w-5 text-foreground drop-shadow-md" />}
                  </div>
                  <span className={`text-xs font-medium ${accentColor === color.id ? 'text-foreground' : 'text-muted-foreground group-hover:text-secondary-foreground'}`}>
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={() => navigate('/settings')}
              className="px-6 py-2.5 rounded-xl border border-input text-secondary-foreground font-medium hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-purple-500 text-foreground font-medium hover:bg-purple-600 transition-colors shadow-lg shadow-purple-500/20"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
