import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sprout, ArrowRight, CheckCircle2, User, Camera } from 'lucide-react';
import { Checkbox } from '@/app/components/ui/checkbox';
import { apiClient } from '../api/apiClient';

type PasswordStrength = 'weak' | 'medium' | 'strong';
interface ApiResponse<T> { success: boolean; message: string; data: T; timestamp: string; }

const steps = [
  { id: 1, label: 'Account' },
  { id: 2, label: 'Location' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const validateStep1 = () => {
    const e: any = {};
    if (!formData.firstName.trim()) e.firstName = 'Required';
    if (!formData.lastName.trim()) e.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (formData.password.length < 6) e.password = 'Min 6 characters';
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!formData.phoneNo.trim()) e.phoneNo = 'Required';
    return e;
  };

  const validateStep2 = () => {
    const e: any = {};
    if (!formData.city.trim()) e.city = 'Required';
    if (!formData.state.trim()) e.state = 'Required';
    if (!formData.district.trim()) e.district = 'Required';
    if (!/^\d{6}$/.test(formData.pincode)) e.pincode = 'Must be 6 digits';
    if (!formData.agreeToTerms) e.agreeToTerms = 'You must agree to continue';
    return e;
  };

  const handleNext = () => {
    const e = validateStep1();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validateStep2();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', 'ROLE_USER');
      formDataToSend.append('phoneNumber', formData.phoneNo);
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
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch {
      setErrors({ general: 'Server connection failed. Please try again.' });
    } finally {
      setIsLoading(false);
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
        <div className="bg-gray-900/60 border border-gray-800/60 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
          {/* Step Progress Bar */}
          <div className="bg-gray-900/80 border-b border-gray-800/60 px-8 py-4">
            <div className="flex items-center gap-3">
              {steps.map((s, i) => (
                <div key={s.id} className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                      step > s.id ? 'bg-[#48D87D] text-black' :
                      step === s.id ? 'bg-[#48D87D]/20 border-2 border-[#48D87D] text-[#48D87D]' :
                      'bg-gray-800 border border-gray-700 text-slate-500'
                    }`}>
                      {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
                    </div>
                    <span className={`text-xs font-semibold transition-colors ${step >= s.id ? 'text-white' : 'text-slate-600'}`}>{s.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-800 relative overflow-hidden rounded-full">
                      <div className={`absolute inset-y-0 left-0 bg-[#48D87D] transition-all duration-500 ${step > 1 ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                </div>
              ))}
              <span className="text-slate-600 text-[10px] font-bold ml-2">{step}/2</span>
            </div>
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white mb-1">
                {step === 1 ? 'Create your account' : 'Your farm location'}
              </h1>
              <p className="text-slate-500 text-sm">
                {step === 1 ? 'Start managing your smart farm in minutes' : 'Help us set up your regional weather and market data'}
              </p>
            </div>

            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400 mb-5 flex items-start gap-2">
                <span>⚠️</span><span>{errors.general}</span>
              </div>
            )}

            {/* ── STEP 1 ── */}
            {step === 1 && (
              <div className="space-y-4">
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

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Email Address</label>
                  <input type="email" placeholder="name@farm.com" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    className={fc('email', !!errors.email)} />
                  {errors.email && <p className="text-[10px] text-red-400">✕ {errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Phone Number</label>
                  <input placeholder="+91 98765 43210" value={formData.phoneNo}
                    onChange={e => setFormData({ ...formData, phoneNo: e.target.value })}
                    onFocus={() => setFocusedField('phoneNo')} onBlur={() => setFocusedField(null)}
                    className={fc('phoneNo', !!errors.phoneNo)} />
                  {errors.phoneNo && <p className="text-[10px] text-red-400">✕ {errors.phoneNo}</p>}
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

                <button type="button" onClick={handleNext}
                  className="w-full bg-[#48D87D] hover:bg-[#3bc56d] text-black font-bold h-12 rounded-xl transition-all duration-200 group flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(72,216,125,0.2)] hover:shadow-[0_4px_28px_rgba(72,216,125,0.35)] active:scale-[0.98] mt-2">
                  Continue to Location <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* ── STEP 2 ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">City</label>
                    <input placeholder="e.g. Lucknow" value={formData.city}
                      onChange={e => setFormData({ ...formData, city: e.target.value })}
                      onFocus={() => setFocusedField('city')} onBlur={() => setFocusedField(null)}
                      className={fc('city', !!errors.city)} />
                    {errors.city && <p className="text-[10px] text-red-400">✕ {errors.city}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">District</label>
                    <input placeholder="e.g. Barabanki" value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      onFocus={() => setFocusedField('district')} onBlur={() => setFocusedField(null)}
                      className={fc('district', !!errors.district)} />
                    {errors.district && <p className="text-[10px] text-red-400">✕ {errors.district}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">State</label>
                    <input placeholder="e.g. Uttar Pradesh" value={formData.state}
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

                {/* Terms */}
                <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox id="terms" checked={formData.agreeToTerms}
                      onCheckedChange={c => setFormData({ ...formData, agreeToTerms: !!c })}
                      className="mt-0.5 border-gray-600 data-[state=checked]:bg-[#48D87D] data-[state=checked]:border-[#48D87D]" />
                    <label htmlFor="terms" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
                      I agree to AgroSmart's{' '}
                      <span className="text-[#48D87D] underline underline-offset-2">Terms of Service</span>{' '}
                      and{' '}
                      <span className="text-[#48D87D] underline underline-offset-2">Privacy Policy</span>.
                      Your data is encrypted and never shared.
                    </label>
                  </div>
                  {errors.agreeToTerms && <p className="text-[10px] text-red-400 mt-2 ml-7">✕ {errors.agreeToTerms}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button type="button" onClick={() => { setStep(1); setErrors({}); }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-slate-300 font-bold h-12 rounded-xl transition-all text-sm active:scale-[0.98]">
                    ← Back
                  </button>
                  <button type="submit" disabled={isLoading}
                    className="w-full bg-[#48D87D] hover:bg-[#3bc56d] disabled:opacity-60 text-black font-bold h-12 rounded-xl transition-all duration-200 group flex items-center justify-center gap-2 text-sm shadow-[0_4px_20px_rgba(72,216,125,0.2)] hover:shadow-[0_4px_28px_rgba(72,216,125,0.35)] active:scale-[0.98]">
                    {isLoading
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                      : <><span>Create Account</span><ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                    }
                  </button>
                </div>
              </form>
            )}

            {/* Sign in link */}
            <p className="text-center text-slate-500 text-xs mt-6 pt-5 border-t border-gray-800/60">
              Already have an account?{' '}
              <Link to="/login" className="text-[#48D87D] hover:underline font-semibold">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="text-slate-700 text-[10px] text-center mt-6 uppercase tracking-widest font-bold">
          AgroSmart · Secured with 256-bit SSL
        </p>
      </div>
    </div>
  );
}