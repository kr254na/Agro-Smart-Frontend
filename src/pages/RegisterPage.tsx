import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sprout, ArrowRight, User, Camera } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { apiClient } from '../api/apiClient';
import { GoogleLogin } from '@react-oauth/google';
import { setStorage } from '../utils/storage';

type PasswordStrength = 'weak' | 'medium' | 'strong';
interface ApiResponse<T> { success: boolean; message: string; data: T; timestamp: string; }

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!profilePic) {
      setProfilePicPreview(null);
      return;
    }
    const url = URL.createObjectURL(profilePic);
    setProfilePicPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePic]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '',
    confirmPassword: '', phoneNo: '', city: '', district: '',
    state: '', pincode: '', agreeToTerms: false,
  });
  const [errors, setErrors] = useState<any>({});

  const calcStrength = (p: string): PasswordStrength => {
    if (!p) return 'weak';
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s <= 2 ? 'weak' : s === 3 ? 'medium' : 'strong';
  };

  const validateForm = () => {
    const e: any = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.password) {
      e.password = 'Required';
    } else if (formData.password.length < 8) {
      e.password = 'Min 8 characters';
    } else if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(formData.password)) {
      e.password = 'Must contain digit, lower, upper, & special char';
    }
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    
    if (!formData.city.trim()) e.city = 'Required';
    if (!formData.state.trim()) e.state = 'Required';
    if (!formData.district.trim()) e.district = 'Required';
    if (!/^\d{6}$/.test(formData.pincode)) e.pincode = 'Must be 6 digits';
    if (!formData.agreeToTerms) e.agreeToTerms = 'You must agree to continue';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) { 
      setErrors(validationErrors); 
      return; 
    }
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', 'ROLE_USER');
      formDataToSend.append('phoneNumber', formData.phoneNo || '');
      formDataToSend.append('city', formData.city);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('state', formData.state);
      formDataToSend.append('pincode', formData.pincode);
      if (profilePic) {
        formDataToSend.append('profilePic', profilePic);
      }

      const response = await apiClient('/api/auth/register', {
        method: 'POST',
        body: formDataToSend,
      });
      const result: ApiResponse<string> = await response.json();
      if (response.ok && result.success) {
        navigate('/login', { state: { message: 'Account created! Please sign in.' } });
      } else {
        setErrors({ general: 'Registration failed. Please verify your details.' });
      }
    } catch {
      setErrors({ general: 'Server connection failed. Please try again.' });
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
      const result = await response.json();
      if (response.ok && result.success) {
        setStorage('token', result.data.accessToken);
        if (result.data.refreshToken) setStorage('refresh', result.data.refreshToken);
        if (result.data.email) setStorage('user_email', result.data.email);
        if (result.data.role) setStorage('userRole', result.data.role);
        navigate('/dashboard');
      } else {
        setErrors((prev: any) => ({ ...prev, general: 'Google signup failed.' }));
      }
    } catch {
      setErrors((prev: any) => ({ ...prev, general: 'Cannot connect to server. Please try again later.' }));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const fc = (name: string, hasErr?: boolean) =>
    `w-full bg-gray-900/80 border ${hasErr ? 'border-red-500/70 shadow-[0_0_0_3px_rgba(239,68,68,0.08)]' : focusedField === name ? 'border-[#48D87D]/60 shadow-[0_0_0_3px_rgba(72,216,125,0.08)]' : 'border-gray-700/60'} 
     text-white placeholder:text-slate-600 rounded-xl h-11 px-4 text-sm outline-none transition-all duration-200`;

  const strengthMeta = {
    weak:   { color: 'bg-red-500',    w: 'w-1/3', label: 'Weak',   text: 'text-red-400' },
    medium: { color: 'bg-amber-400',  w: 'w-2/3', label: 'Medium', text: 'text-amber-400' },
    strong: { color: 'bg-[#48D87D]',  w: 'w-full', label: 'Strong', text: 'text-[#48D87D]' },
  }[passwordStrength];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center relative overflow-hidden py-10 px-4">
      {isGoogleLoading && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#48D87D] animate-spin mb-4" />
          <p className="text-[#48D87D] font-bold tracking-widest uppercase text-sm animate-pulse">Authenticating with Google...</p>
        </div>
      )}

      {/* Ambient blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#48D87D]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="p-2.5 bg-[#48D87D]/20 rounded-xl border border-[#48D87D]/20">
            <Sprout className="h-6 w-6 text-[#48D87D]" />
          </div>
          <div>
            <p className="text-white font-bold text-xl tracking-tight leading-none">AgroSmart</p>
            <p className="text-slate-600 text-[10px] uppercase tracking-widest font-bold">IoT Farm Platform</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden p-8">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm">Start managing your smart farm in minutes</p>
          </div>

          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-5 flex items-start gap-2">
              <span>⚠️</span><span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-900/80 border border-gray-700/60 overflow-hidden flex items-center justify-center">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-600" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-1.5 bg-[#48D87D] text-black rounded-full cursor-pointer hover:bg-[#3bc56d] transition-colors shadow-lg">
                  <Camera size={12} />
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      if (e.target.files[0].size > 5 * 1024 * 1024) {
                         setErrors({...errors, profilePic: 'Max 5MB'});
                         e.target.value = '';
                         return;
                      }
                      setProfilePic(e.target.files[0]);
                      setErrors({...errors, profilePic: undefined});
                    }
                  }} />
                </label>
              </div>
            </div>
            {errors.profilePic && <p className="text-[10px] text-red-400 text-center -mt-3 mb-2">✕ {errors.profilePic}</p>}
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">First Name</label>
                <input placeholder="John" value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)}
                  className={fc('firstName', !!errors.firstName)} />
                {errors.firstName && <p className="text-[10px] text-red-400">✕ {errors.firstName}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Last Name</label>
                <input placeholder="Doe" value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)}
                  className={fc('lastName', !!errors.lastName)} />
                {errors.lastName && <p className="text-[10px] text-red-400">✕ {errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Email</label>
                <input type="email" placeholder="name@farm.com" value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  className={fc('email', !!errors.email)} />
                {errors.email && <p className="text-[10px] text-red-400">✕ {errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Phone</label>
                <input placeholder="+91 98765 43210" value={formData.phoneNo}
                  onChange={e => setFormData({ ...formData, phoneNo: e.target.value })}
                  onFocus={() => setFocusedField('phoneNo')} onBlur={() => setFocusedField(null)}
                  className={fc('phoneNo', !!errors.phoneNo)} />
                {errors.phoneNo && <p className="text-[10px] text-red-400">✕ {errors.phoneNo}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">City</label>
                <input placeholder="Lucknow" value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)}
                  className={fc('city', !!errors.city)} />
                {errors.city && <p className="text-[10px] text-red-400">✕ {errors.city}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">District</label>
                <input placeholder="Barabanki" value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  onFocus={() => setFocusedField('district')} onBlur={() => setFocusedField(null)}
                  className={fc('district', !!errors.district)} />
                {errors.district && <p className="text-[10px] text-red-400">✕ {errors.district}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">State</label>
                <input placeholder="Uttar Pradesh" value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  onFocus={() => setFocusedField('state')} onBlur={() => setFocusedField(null)}
                  className={fc('state', !!errors.state)} />
                {errors.state && <p className="text-[10px] text-red-400">✕ {errors.state}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Pincode</label>
                <input placeholder="6-digit PIN" value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  onFocus={() => setFocusedField('pincode')} onBlur={() => setFocusedField(null)}
                  className={fc('pincode', !!errors.pincode)} />
                {errors.pincode && <p className="text-[10px] text-red-400">✕ {errors.pincode}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={formData.password}
                    onChange={e => { setFormData({ ...formData, password: e.target.value }); setPasswordStrength(calcStrength(e.target.value)); }}
                    onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                    className={`${fc('password', !!errors.password)} pr-10`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#48D87D] transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] text-red-400">✕ {errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Confirm</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)}
                    className={`${fc('confirm', !!errors.confirmPassword)} pr-10`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#48D87D] transition-colors">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-400">✕ {errors.confirmPassword}</p>}
              </div>
            </div>

            {formData.password && (
              <div className="space-y-1">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${strengthMeta.color} ${strengthMeta.w}`} />
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Strength: <span className={strengthMeta.text}>{strengthMeta.label}</span>
                </p>
              </div>
            )}

            {/* Terms */}
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-4 mt-2">
              <div className="flex items-start gap-3">
                <Checkbox id="terms" checked={formData.agreeToTerms}
                  onCheckedChange={c => setFormData({ ...formData, agreeToTerms: !!c })}
                  className="mt-0.5 border-gray-600 data-[state=checked]:bg-[#48D87D] data-[state=checked]:border-[#48D87D]" />
                <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                  I agree to AgroSmart's{' '}
                  <span className="text-[#48D87D] underline underline-offset-2">Terms of Service</span>{' '}
                  and{' '}
                  <span className="text-[#48D87D] underline underline-offset-2">Privacy Policy</span>.
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-[10px] text-red-400 mt-2 ml-7">✕ {errors.agreeToTerms}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-[#48D87D] hover:bg-[#3bc56d] disabled:opacity-60 text-black font-bold h-12 rounded-xl transition-all duration-200 group flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(72,216,125,0.2)] hover:shadow-[0_4px_28px_rgba(72,216,125,0.35)] active:scale-[0.98] mt-4">
              {isLoading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating Account...</>
                : <><span>Create Account</span><ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              }
            </button>
          </form>

          <div className="mt-6 flex items-center gap-4">
            <div className="h-px bg-gray-800/60 flex-1"></div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">or continue with</span>
            <div className="h-px bg-gray-800/60 flex-1"></div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setErrors((prev: any) => ({ ...prev, general: 'Google signup was unsuccessful.' }));
              }}
              theme="filled_black"
              shape="pill"
              text="signup_with"
              size="large"
            />
          </div>

          {/* Sign in link */}
          <p className="text-center text-slate-500 text-xs mt-6 pt-5 border-t border-gray-800/60">
            Already have an account?{' '}
            <Link to="/login" className="text-[#48D87D] hover:underline font-semibold">Sign in</Link>
          </p>
        </div>

        <p className="text-slate-700 text-[10px] text-center mt-6 uppercase tracking-widest font-bold">
          AgroSmart · Secured with 256-bit SSL
        </p>
      </div>
    </div>
  );
}