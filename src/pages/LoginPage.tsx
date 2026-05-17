import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight, Sprout, ShieldCheck, Wifi } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { setStorage } from '../utils/storage';
import { apiClient } from '../api/apiClient';
import { GoogleLogin } from '@react-oauth/google';

interface LoginResponse { accessToken: string; refreshToken: string; email: string; role: string; }
interface ApiResponse<T> { success: boolean; message: string; data: T; }

const features = [
  { icon: '🌱', title: 'Live Sensor Data', desc: 'Real-time NPK, moisture, and climate readings' },
  { icon: '🤖', title: 'AI Crop Analysis', desc: 'Predictive yield and market price insights' },
  { icon: '🗺️', title: 'Farm Mapping', desc: 'GPS field management and device tracking' },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });
    const newErrors = { email: '', password: '', general: '' };
    let hasErrors = false;
    if (!formData.email) { newErrors.email = 'Email is required'; hasErrors = true; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) { newErrors.email = 'Invalid email address'; hasErrors = true; }
    if (!formData.password) { newErrors.password = 'Password is required'; hasErrors = true; }
    if (hasErrors) { setErrors(newErrors); return; }

    setIsLoading(true);
    try {
      const response = await apiClient('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const result: ApiResponse<LoginResponse> = await response.json();
      if (response.ok && result.success) {
        setStorage('token', result.data.accessToken);
        setStorage('refresh', result.data.refreshToken);
        setStorage('user_email', result.data.email);
        setStorage('userRole', result.data.role);
        navigate('/dashboard');
      } else {
        setErrors(prev => ({ ...prev, general: 'Invalid credentials. Please try again.' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, general: 'Cannot connect to server. Please try again later.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    try {
      const response = await apiClient('/api/auth/google', {
        method: 'POST',
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const result: ApiResponse<LoginResponse> = await response.json();
      if (response.ok && result.success) {
        setStorage('token', result.data.accessToken);
        if (result.data.refreshToken) setStorage('refresh', result.data.refreshToken);
        if (result.data.email) setStorage('user_email', result.data.email);
        if (result.data.role) setStorage('userRole', result.data.role);
        navigate('/dashboard');
      } else {
        setErrors(prev => ({ ...prev, general: 'Google login failed.' }));
      }
    } catch {
      setErrors(prev => ({ ...prev, general: 'Cannot connect to server. Please try again later.' }));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const fieldClass = (name: string, hasErr?: boolean) =>
    `w-full bg-gray-900/80 border ${hasErr ? 'border-red-500/70' : focusedField === name ? 'border-[#48D87D]/60' : 'border-gray-700/60'} 
     text-white placeholder:text-slate-600 rounded-xl h-12 px-4 text-sm outline-none transition-all duration-200
     ${focusedField === name && !hasErr ? 'shadow-[0_0_0_3px_rgba(72,216,125,0.08)]' : ''}
     ${hasErr ? 'shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : ''}`;

  return (
    <div className="min-h-screen bg-gray-950 flex relative overflow-hidden">
      {isGoogleLoading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#48D87D] animate-spin mb-4" />
          <p className="text-[#48D87D] font-bold tracking-widest uppercase text-sm animate-pulse">Authenticating with Google...</p>
        </div>
      )}
      {/* Ambient background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#48D87D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex w-full max-w-6xl mx-auto px-4 lg:px-12 items-center gap-16 py-12">

        {/* ── Left Panel ── */}
        <div className="hidden lg:flex flex-col flex-1 gap-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#48D87D]/20 rounded-xl border border-[#48D87D]/20">
              <Sprout className="h-7 w-7 text-[#48D87D]" />
            </div>
            <div>
              <p className="text-white font-bold text-xl tracking-tight leading-none">AgroSmart</p>
              <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">IoT Farm Platform</p>
            </div>
          </div>

          {/* Headline */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-3">
              Intelligence for<br />
              <span className="text-[#48D87D]">Every Field.</span>
            </h2>
            <p className="text-slate-500 leading-relaxed max-w-xs">
              Monitor soil health, predict harvests, and optimize your farm operations — all in one platform.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="space-y-3">
            {features.map(f => (
              <div key={f.title} className="flex items-center gap-4 bg-gray-900/40 border border-gray-800/60 rounded-xl p-4 hover:border-[#48D87D]/20 transition-colors">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-slate-500 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            {[{ v: '2,400+', l: 'Farms' }, { v: '18K+', l: 'Sensors' }, { v: '99.9%', l: 'Uptime' }].map(s => (
              <div key={s.l} className="flex-1 bg-gray-900/40 border border-gray-800/60 rounded-xl p-3 text-center">
                <p className="text-[#48D87D] font-bold text-base">{s.v}</p>
                <p className="text-slate-600 text-[9px] uppercase tracking-widest font-bold">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel — Form ── */}
        <div className="w-full max-w-[420px] mx-auto">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-8">
            <div className="p-2 bg-[#48D87D]/20 rounded-xl">
              <Sprout className="h-5 w-5 text-[#48D87D]" />
            </div>
            <span className="text-white font-bold text-lg">AgroSmart</span>
          </div>

          <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
            {/* Header */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-[#48D87D]/10 border border-[#48D87D]/20 rounded-full px-3 py-1 mb-4">
                <ShieldCheck className="h-3 w-3 text-[#48D87D]" />
                <span className="text-[#48D87D] text-[10px] font-bold uppercase tracking-widest">Secure Login</span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
              <p className="text-slate-500 text-sm">Sign in to access your farm dashboard</p>
            </div>

            {/* Error */}
            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-6 flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'email' ? 'text-[#48D87D]' : 'text-slate-600'}`} />
                  <input
                    type="email"
                    placeholder="farmer@agrosmart.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`${fieldClass('email', !!errors.email)} pl-10`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-red-400 flex items-center gap-1"><span>✕</span>{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">Password</label>
                  <Link to="/forgot-password" className="text-[11px] text-[#48D87D] hover:underline font-semibold">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${focusedField === 'password' ? 'text-[#48D87D]' : 'text-slate-600'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`${fieldClass('password', !!errors.password)} pl-10 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#48D87D] transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-red-400 flex items-center gap-1"><span>✕</span>{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#48D87D] hover:bg-[#3bc56d] disabled:opacity-60 text-black font-bold h-12 rounded-xl transition-all duration-200 group flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(72,216,125,0.25)] hover:shadow-[0_4px_28px_rgba(72,216,125,0.4)] active:scale-[0.98]"
              >
                {isLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying credentials...</>
                  : <><span>Sign In to Dashboard</span><ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                }
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px bg-gray-800/60 flex-1"></div>
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">or</span>
              <div className="h-px bg-gray-800/60 flex-1"></div>
            </div>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setErrors(prev => ({ ...prev, general: 'Google login was unsuccessful.' }));
                }}
                theme="filled_black"
                shape="pill"
                text="signin_with"
                size="large"
              />
            </div>

            {/* Footer */}
            <div className="mt-7 pt-6 border-t border-gray-800/60 text-center space-y-3">
              <p className="text-slate-500 text-sm">
                New to AgroSmart?{' '}
                <Link to="/register" className="text-[#48D87D] font-semibold hover:underline">Create a free account</Link>
              </p>
              <div className="flex items-center justify-center gap-1.5 text-slate-700 text-[10px]">
                <Wifi className="h-3 w-3" />
                <span>Backed by 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}