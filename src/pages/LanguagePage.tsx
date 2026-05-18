import { useState } from 'react';
import { ArrowLeft, Globe, MapPin, Clock, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function LanguagePage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en-US');
  const [region, setRegion] = useState(() => localStorage.getItem('region') || 'US');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('timezone') || 'UTC');

  const languages = [
    { id: 'en-US', name: 'English (US)', native: 'English' },
    { id: 'en-GB', name: 'English (UK)', native: 'English' },
    { id: 'es-ES', name: 'Spanish', native: 'Español' },
    { id: 'fr-FR', name: 'French', native: 'Français' },
    { id: 'hi-IN', name: 'Hindi', native: 'हिन्दी' },
    { id: 'zh-CN', name: 'Chinese (Simplified)', native: '中文(简体)' },
  ];

  const regions = [
    { id: 'US', name: 'United States' },
    { id: 'IN', name: 'India' },
    { id: 'UK', name: 'United Kingdom' },
    { id: 'EU', name: 'European Union' },
    { id: 'AU', name: 'Australia' },
  ];

  const timezones = [
    { id: 'UTC', name: 'Coordinated Universal Time (UTC)' },
    { id: 'America/New_York', name: 'Eastern Time (ET)' },
    { id: 'America/Los_Angeles', name: 'Pacific Time (PT)' },
    { id: 'Europe/London', name: 'Greenwich Mean Time (GMT)' },
    { id: 'Asia/Kolkata', name: 'India Standard Time (IST)' },
  ];

  const handleSave = () => {
    localStorage.setItem('language', language);
    localStorage.setItem('region', region);
    localStorage.setItem('timezone', timezone);
    
    // Set Google Translate cookie
    let targetLang = language.split('-')[0];
    if (language === 'zh-CN') targetLang = 'zh-CN';
    
    // Default to 'en' to clear translation if English is selected
    if (targetLang === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;
    } else {
        document.cookie = `googtrans=/en/${targetLang}; path=/`;
        document.cookie = `googtrans=/en/${targetLang}; domain=.${window.location.hostname}; path=/`;
    }

    toast.success('Language & Region settings saved successfully');
    
    setTimeout(() => {
      window.location.href = '/settings';
    }, 1000);
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
              Language & Region
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Configure your localization preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Language Selection */}
          <section className="bg-card/50 border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-400/10 rounded-lg">
                <Globe className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Display Language</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`relative p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
                    language === l.id 
                      ? 'border-blue-400 bg-blue-400/10' 
                      : 'border-input bg-accent/50 hover:border-gray-600'
                  }`}
                >
                  <div>
                    <h3 className={`font-medium mb-1 ${language === l.id ? 'text-foreground' : 'text-secondary-foreground'}`}>
                      {l.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">{l.native}</p>
                  </div>
                  {language === l.id && <Check className="h-5 w-5 text-blue-400" />}
                </button>
              ))}
            </div>
          </section>

          {/* Region & Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Region */}
            <section className="bg-card/50 border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-400/10 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Region</h2>
              </div>
              <div className="space-y-3">
                {regions.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRegion(r.id)}
                    className={`w-full relative p-3.5 rounded-xl border text-left transition-all flex justify-between items-center ${
                      region === r.id 
                        ? 'border-blue-400 bg-blue-400/10 text-foreground' 
                        : 'border-input bg-accent/50 text-secondary-foreground hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium">{r.name}</span>
                    {region === r.id && <Check className="h-5 w-5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </section>

            {/* Timezone */}
            <section className="bg-card/50 border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-400/10 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Time Zone</h2>
              </div>
              <div className="space-y-3">
                {timezones.map((tz) => (
                  <button
                    key={tz.id}
                    onClick={() => setTimezone(tz.id)}
                    className={`w-full relative p-3.5 rounded-xl border text-left transition-all flex justify-between items-center ${
                      timezone === tz.id 
                        ? 'border-blue-400 bg-blue-400/10 text-foreground' 
                        : 'border-input bg-accent/50 text-secondary-foreground hover:border-gray-600'
                    }`}
                  >
                    <span className="font-medium">{tz.name}</span>
                    {timezone === tz.id && <Check className="h-5 w-5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </section>
          </div>

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
              className="px-6 py-2.5 rounded-xl bg-blue-500 text-foreground font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
