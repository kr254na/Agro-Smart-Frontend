import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { apiClient } from '../api/apiClient';
import SEO from '../app/components/SEO';

type ResetStep = 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>('EMAIL');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  // Step 1: Request OTP (@PostMapping("/forgot"))
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient(`/api/auth/password/forgot?email=${formData.email}`, {
        method: 'POST'
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStep('OTP');
      } else {
        setError('Email not found or service unavailable.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP (@PostMapping("/verify-otp"))
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient(`/api/auth/password/verify-otp?email=${formData.email}&otp=${formData.otp}`, {
        method: 'POST'
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStep('PASSWORD');
      } else {
        setError('Invalid or expired OTP.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Complete Reset (@PostMapping("/reset") with ResetPasswordRequest DTO)
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/.test(formData.newPassword)) {
      setError('Password must contain digit, lowercase, uppercase, and special character.');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStep('SUCCESS');
      } else {
        setError('Reset failed. Ensure password requirements are met.');
      }
    } catch (err) {
      setError('Server connection failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEO 
        title="Forgot Password" 
        description="Reset your AgroSmart account password securely." 
        url="https://agrofy.vercel.app/forgot-password" 
      />
      <div className="w-full max-w-md bg-card p-8 rounded-2xl border border-border shadow-xl">
        
        {/* Dynamic Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            {step === 'EMAIL' && <Mail className="text-primary w-8 h-8" />}
            {step === 'OTP' && <ShieldCheck className="text-primary w-8 h-8" />}
            {step === 'PASSWORD' && <Lock className="text-primary w-8 h-8" />}
            {step === 'SUCCESS' && <CheckCircle2 className="text-primary w-8 h-8" />}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === 'EMAIL' && 'Forgot Password?'}
            {step === 'OTP' && 'Verify OTP'}
            {step === 'PASSWORD' && 'New Password'}
            {step === 'SUCCESS' && 'Reset Complete!'}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {step === 'EMAIL' && "Enter your email and we'll send a 6-digit reset code."}
            {step === 'OTP' && `Check your inbox for a code sent to ${formData.email}`}
            {step === 'PASSWORD' && "Create a secure new password for your account."}
            {step === 'SUCCESS' && "Your password has been successfully updated."}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Step-specific Forms */}
        {step === 'EMAIL' && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Email Address</Label>
              <Input
                type="email"
                required
                className="bg-background border-border text-foreground"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold h-11">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Send Code'}
            </Button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">6-Digit Code</Label>
              <Input
                type="text"
                required
                maxLength={6}
                className="bg-background border-border text-foreground text-center tracking-widest text-xl h-12"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold h-11">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Verify Code'}
            </Button>
            <button type="button" onClick={() => setStep('EMAIL')} className="w-full text-sm text-muted-foreground hover:text-primary">
              Back to change email
            </button>
          </form>
        )}

        {step === 'PASSWORD' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-secondary-foreground">New Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="bg-background border-border text-foreground pr-10"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-secondary-foreground">Confirm Password</Label>
              <Input
                type="password"
                required
                className="bg-background border-border text-foreground"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-bold h-11">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
            </Button>
          </form>
        )}

        {step === 'SUCCESS' && (
          <Button onClick={() => navigate('/login')} className="w-full bg-primary text-primary-foreground font-bold h-11">
            Back to Login
          </Button>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}