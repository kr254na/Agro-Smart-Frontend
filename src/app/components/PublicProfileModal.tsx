import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { apiClient } from '@/api/apiClient';

interface FarmerProfile {
  id?: number;
  firstName: string;
  lastName?: string;
  phoneNumber?: string;
  profilePicUrl?: string;
  address?: {
    city?: string;
    state?: string;
    district?: string;
    pincode?: string;
  };
}

interface PublicProfileModalProps {
  email: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PublicProfileModal({ email, isOpen, onClose }: PublicProfileModalProps) {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && email) {
      fetchProfile();
    } else {
      setProfile(null);
      setError(null);
    }
  }, [isOpen, email]);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/users/profile/${email}`) as Response;
      const result = await response.json();
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError('Failed to fetch the profile.');
      }
    } catch (err) {
      setError('Failed to fetch the profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-background border-border text-foreground sm:max-w-[450px] !rounded-3xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tighter text-primary">Farmer Profile</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex flex-col items-center">
          {isLoading ? (
            <div className="py-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : error ? (
            <div className="py-10 text-red-500 font-bold text-center text-sm uppercase">{error}</div>
          ) : profile ? (
            <div className="w-full space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 border-4 border-primary mb-4 shadow-xl">
                  {profile.profilePicUrl ? (
                    <img src={profile.profilePicUrl} className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-700 text-3xl font-bold text-foreground">
                      {profile.firstName?.[0]}{profile.lastName?.[0] || ''}
                    </AvatarFallback>
                  )}
                </Avatar>
                <h2 className="text-2xl font-bold text-foreground capitalize">{profile.firstName} {profile.lastName}</h2>
                <Badge variant="outline" className="text-primary border-primary/30 mt-2 bg-primary/5 text-[10px] uppercase font-black">
                  Community Member
                </Badge>
              </div>
              
              <div className="bg-card/50 rounded-xl p-4 space-y-3 border border-border shadow-inner">
                {email && (
                  <div className="flex items-center gap-3 text-foreground text-sm font-medium">
                    <Mail size={16} className="text-primary shrink-0"/> 
                    <span className="truncate">{email}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-secondary-foreground text-sm">
                  <Phone size={16} className="text-primary shrink-0"/> 
                  {profile.phoneNumber || 'Contact not provided'}
                </div>
                <div className="flex items-center gap-3 text-secondary-foreground text-sm">
                  <MapPin size={16} className="text-primary shrink-0"/> 
                  {profile.address ? (
                    <span>
                      {[profile.address.city, profile.address.district, profile.address.state]
                        .filter(Boolean)
                        .join(', ') || 'Location not specified'}
                    </span>
                  ) : (
                    'Location not specified'
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
