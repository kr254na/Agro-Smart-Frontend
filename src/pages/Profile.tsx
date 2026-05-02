import { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Edit, Save, Lock, 
  Loader2, AlertCircle, CheckCircle2, Trash2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Separator } from '@/app/components/ui/separator';
import { Switch } from '@/app/components/ui/switch';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Button } from '@/app/components/ui/button';
import { apiClient } from '@/api/apiClient'; 
import { getStorage, clearAllStorage } from '../utils/storage';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    state: '',
    district: '',
    pincode: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [pwdStatus, setPwdStatus] = useState<{type: 'error' | 'success', msg: string} | null>(null);
  const [preferences, setPreferences] = useState({
    aiInsights: true,
    weatherAlerts: true
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = (await apiClient('/api/users/me')) as Response;
      const result = await response.json();
      
      if (result.success) {
        const p = result.data;
        setProfileData({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          email: getStorage('user_email') || '',
          phoneNumber: p.phoneNumber || '',
          city: p.address?.city || '',
          state: p.address?.state || '',
          district: p.address?.district || '',
          pincode: p.address?.pincode || ''
        });
      }
    } catch (err) {
      console.error("Fetch profile failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = (await apiClient('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phoneNumber: profileData.phoneNumber,
          city: profileData.city,
          state: profileData.state,
          district: profileData.district,
          pincode: profileData.pincode
        })
      })) as Response;

      const result = await response.json();
      if (result.success) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdStatus(null);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwdStatus({ type: 'error', msg: "Passwords do not match" });
      return;
    }

    try {
      const response = (await apiClient('/api/users/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })) as Response;

      const result = await response.json();
      if (result.success) {
        setPwdStatus({ type: 'success', msg: "Password updated successfully!" });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPwdStatus({ type: 'error', msg: result.message || "Failed to change password" });
      }
    } catch (err) {
      setPwdStatus({ type: 'error', msg: "Server error occurred" });
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure? This will delete all your farm data permanently.")) return;
    try {
      const response = (await apiClient(`/api/users/${profileData.email}`, { method: 'DELETE' })) as Response;
      const result = await response.json();
      if (result.success) {
        clearAllStorage();
        navigate('/login');
      }
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#48D87D] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-slate-100 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto pb-20">
        
        {/* Breadcrumbs */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <Link to="/dashboard" className="hover:text-[#48D87D] transition-colors">Dashboard</Link>
            <span>/</span>
            <span className="text-[#48D87D] font-medium">Profile</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight uppercase">User Profile</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
              <CardContent className="p-6 text-center">
                <Avatar className="w-32 h-32 border-4 border-[#48D87D] mx-auto mb-4">
                  <AvatarFallback className="bg-gradient-to-br from-[#48D87D] to-emerald-700 text-3xl font-bold text-white">
                    {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                
                <h2 className="text-2xl font-bold text-white mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <Badge variant="outline" className="text-[#48D87D] border-[#48D87D]/30 mb-6 bg-[#48D87D]/5">
                  Verified Member
                </Badge>

                {/* VISIBILITY FIX: Added text-white for email and high contrast for icons */}
                <div className="space-y-4 text-left text-sm">
                  <div className="flex items-center gap-3 text-white font-medium">
                    <Mail size={16} className="text-[#48D87D] shrink-0"/> 
                    <span className="truncate">{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone size={16} className="text-[#48D87D] shrink-0"/> 
                    {profileData.phoneNumber || 'Not provided'}
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <MapPin size={16} className="text-[#48D87D] shrink-0"/> 
                    {profileData.city}, {profileData.state}
                  </div>
                </div>

                <Separator className="my-6 bg-slate-800" />

                <Dialog>
                  <DialogTrigger asChild>
                    {/* COLOR ADJUST: Changed to brand green outline */}
                    <Button variant="outline" className="w-full border-[#48D87D]/40 text-[#48D87D] hover:bg-[#48D87D] hover:text-black transition-all font-bold">
                      <Lock size={16} className="mr-2" /> Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white shadow-2xl">
                    <DialogHeader><DialogTitle className="text-white">Update Security</DialogTitle></DialogHeader>
                    <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
                      {pwdStatus && (
                        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${pwdStatus.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {pwdStatus.type === 'success' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
                          {pwdStatus.msg}
                        </div>
                      )}
                      <div className="space-y-1">
                        <Label className="text-slate-300">Current Password</Label>
                        <Input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-slate-300">New Password</Label>
                        <Input type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-slate-300">Confirm New Password</Label>
                        <Input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white" />
                      </div>
                      <Button type="submit" className="w-full bg-[#48D87D] text-black font-bold hover:bg-[#3bc56d]">Update Password</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="bg-red-950/10 border-red-900/30 shadow-lg">
              <CardHeader><CardTitle className="text-red-500 text-xs font-bold uppercase tracking-widest">Danger Zone</CardTitle></CardHeader>
              <CardContent>
                <Button onClick={handleDeleteAccount} variant="ghost" className="w-full text-red-400 hover:bg-red-500/10 hover:text-red-500 justify-start">
                  <Trash2 size={16} className="mr-2" /> Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 pb-4">
                <CardTitle className="text-xl text-white">Account Information</CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} size="sm" variant="outline" className="text-[#48D87D] border-[#48D87D]/20 hover:bg-[#48D87D]/10">
                    <Edit size={14} className="mr-2" /> Edit Details
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving} size="sm" className="bg-[#48D87D] text-black hover:bg-[#3bc56d]">
                      {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} className="mr-2" />} Save
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="ghost" size="sm" className="text-slate-400">Cancel</Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-500 font-medium">First Name</Label>
                    <Input disabled={!isEditing} value={profileData.firstName} onChange={e => setProfileData({...profileData, firstName: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500 font-medium">Last Name</Label>
                    <Input disabled={!isEditing} value={profileData.lastName} onChange={e => setProfileData({...profileData, lastName: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500 font-medium">Phone Number</Label>
                    <Input disabled={!isEditing} value={profileData.phoneNumber} onChange={e => setProfileData({...profileData, phoneNumber: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500 font-medium">Pincode</Label>
                    <Input disabled={!isEditing} value={profileData.pincode} onChange={e => setProfileData({...profileData, pincode: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500 font-medium">District</Label>
                    <Input disabled={!isEditing} value={profileData.district} onChange={e => setProfileData({...profileData, district: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white disabled:opacity-70" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-500 font-medium">City</Label>
                    <Input disabled={!isEditing} value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white disabled:opacity-70" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-500 font-medium">State</Label>
                    <Input disabled={!isEditing} value={profileData.state} onChange={e => setProfileData({...profileData, state: e.target.value})} className="bg-gray-900/50 border-gray-800 text-white disabled:opacity-70" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Preferences */}
            <Card className="bg-gray-900/50 border-gray-800 shadow-xl">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg text-white">System Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* SWITCH FIX: Added data-[state=unchecked]:bg-slate-700 to ensure background is visible when OFF */}
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-slate-800">
                  <div className="space-y-0.5">
                    <Label className="text-white text-base font-semibold">AI Crop Insights</Label>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Predictive Reports</p>
                  </div>
                  <Switch 
                    className="data-[state=checked]:bg-[#48D87D] data-[state=unchecked]:bg-slate-700"
                    checked={preferences.aiInsights} 
                    onCheckedChange={(val) => setPreferences(prev => ({...prev, aiInsights: val}))} 
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-slate-800">
                  <div className="space-y-0.5">
                    <Label className="text-white text-base font-semibold">Weather Alerts</Label>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Smart Notifications</p>
                  </div>
                  <Switch 
                    className="data-[state=checked]:bg-[#48D87D] data-[state=unchecked]:bg-slate-700"
                    checked={preferences.weatherAlerts} 
                    onCheckedChange={(val) => setPreferences(prev => ({...prev, weatherAlerts: val}))} 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}