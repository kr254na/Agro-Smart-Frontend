import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

// Define shapes based on your Spring Boot DTOs
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });

    // Client-side Validation
    let hasErrors = false;
    const newErrors = { email: '', password: '', general: '' };

    if (!formData.email) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // API call to your Spring Boot AuthController @PostMapping("/login")
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const result: ApiResponse<LoginResponse> = await response.json();

      if (response.ok && result.success) {
        // Sync with your TokenController requirements
        localStorage.setItem('token', result.data.accessToken);
        localStorage.setItem('refresh', result.data.refreshToken); // Saved for /refresh endpoint
        localStorage.setItem('user_email', result.data.email);
        localStorage.setItem('userRole', result.data.role);
        
        // Redirect to protected dashboard
        navigate('/dashboard');
      } else {
        setErrors(prev => ({ 
          ...prev, 
          general: result.message || 'Login failed. Please check your credentials.' 
        }));
      }
    } catch (err) {
      setErrors(prev => ({ 
        ...prev, 
        general: 'Server connection failed. Is the backend running on port 8081?' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 lg:p-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side - Illustration & Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center">
          <div className="relative w-full max-w-md mb-8">
            <img
              src="https://images.unsplash.com/photo-1744230673231-865d54a0aba4?q=80&w=1080"
              alt="AgroSmart IoT Integration"
              className="w-full h-auto rounded-3xl shadow-2xl border border-gray-800"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent rounded-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Grow Smarter, Not Harder</h2>
          <p className="text-gray-400 max-w-sm">
            Access your real-time farm analytics and AI-driven crop insights.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl">
            <div className="space-y-2 mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome Back
              </h1>
              <p className="text-gray-400">
                Enter your credentials to access your farm
              </p>
            </div>

            {errors.general && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400 mb-6 animate-in fade-in zoom-in duration-300">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="farmer@agrosmart.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`pl-10 bg-[#0a0a0a] border-gray-800 text-white placeholder:text-gray-600 focus:border-[#48D87D] transition-all ${
                      errors.email ? 'border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <Link to="/forgot-password" className="text-xs text-[#48D87D] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`pl-10 pr-10 bg-[#0a0a0a] border-gray-800 text-white focus:border-[#48D87D] transition-all ${
                      errors.password ? 'border-red-500 focus:ring-red-500/20' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#48D87D] transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#48D87D] hover:bg-[#3bc56d] text-black font-bold h-12 rounded-xl transition-all group"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Login to Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-gray-800 pt-6">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#48D87D] font-semibold hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}