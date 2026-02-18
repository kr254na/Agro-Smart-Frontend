import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, Hash, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Checkbox } from '@/app/components/ui/checkbox';

type PasswordStrength = 'weak' | 'medium' | 'strong';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('weak');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNo: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<any>({});

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return 'weak';
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    if (strength <= 2) return 'weak';
    if (strength === 3) return 'medium';
    return 'strong';
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const newErrors: any = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.password.length < 6) newErrors.password = 'Min 6 chars';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mismatch';
    if (!formData.phoneNo.trim()) newErrors.phoneNo = 'Required';
    if (!formData.city.trim()) newErrors.city = 'Required';
    if (!formData.state.trim()) newErrors.state = 'Required';
    if (!formData.district.trim()) newErrors.district = 'Required';
    if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid Pincode';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'Agreement required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role:'ROLE_USER',
          phoneNumber: formData.phoneNo,
          city: formData.city,
          district: formData.district,
          state: formData.state,
          pincode: formData.pincode
        }),
      });

      const result: ApiResponse<string> = await response.json();

      if (response.ok && result.success) {
        navigate('/login', { state: { message: 'Registration Successful!' } });
      } else {
        setErrors({ general: result.message || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ general: 'Server connection failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColor = passwordStrength === 'weak' ? 'bg-red-500' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500';
  const strengthWidth = passwordStrength === 'weak' ? 'w-1/3' : passwordStrength === 'medium' ? 'w-2/3' : 'w-full';

  return (
    <div className="flex items-center justify-center p-4 py-8 min-h-screen bg-[#0a0a0a]">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <img
              src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?q=80&w=1080"
              alt="AgroSmart IoT"
              className="w-full h-auto rounded-2xl shadow-2xl border border-gray-900"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent rounded-2xl" />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="space-y-6 bg-[#111] p-8 rounded-2xl border border-gray-800">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Register</h1>
              <p className="text-gray-400 text-sm">Create an account to manage your smart farm</p>
            </div>

            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">First Name</Label>
                  <Input
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`bg-[#0a0a0a] border-gray-800 text-white ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">Last Name</Label>
                  <Input
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`bg-[#0a0a0a] border-gray-800 text-white ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Email</Label>
                <Input
                  type="email"
                  placeholder="name@farm.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`bg-[#0a0a0a] border-gray-800 text-white ${errors.email ? 'border-red-500' : ''}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className={`bg-[#0a0a0a] border-gray-800 text-white pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">Confirm</Label>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`bg-[#0a0a0a] border-gray-800 text-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {formData.password && (
                <div className="space-y-1">
                  <div className="h-1 bg-gray-900 rounded-full"><div className={`h-full transition-all ${strengthColor} ${strengthWidth}`} /></div>
                  <p className="text-[10px] uppercase text-gray-500 font-bold">Strength: {passwordStrength}</p>
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Phone</Label>
                <Input
                  placeholder="+91"
                  value={formData.phoneNo}
                  onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })}
                  className={`bg-[#0a0a0a] border-gray-800 text-white ${errors.phoneNo ? 'border-red-500' : ''}`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">City</Label>
                  <Input
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-[#0a0a0a] border-gray-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">State</Label>
                  <Input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={`bg-[#0a0a0a] border-gray-800 text-white ${errors.state ? 'border-red-500' : ''}`}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">District</Label>
                  <Input
                    placeholder="District"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="bg-[#0a0a0a] border-gray-800 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-gray-400">Pincode</Label>
                  <Input
                    placeholder="6 Digits"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                    className={`bg-[#0a0a0a] border-gray-800 text-white ${errors.pincode ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(c) => setFormData({ ...formData, agreeToTerms: !!c })}
                  className="border-gray-700 data-[state=checked]:bg-[#48D87D]"
                />
                <label htmlFor="terms" className="text-[11px] text-gray-500">I agree to the <span className="text-[#48D87D] underline">Terms & Conditions</span></label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#48D87D] hover:bg-[#3bc56d] text-black font-bold h-10 mt-4"
              >
                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-gray-500 text-xs">
              Already a member? <Link to="/login" className="text-[#48D87D] hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}