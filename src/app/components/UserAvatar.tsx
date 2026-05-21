import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/app/components/ui/avatar';
import { apiClient } from '@/api/apiClient';

// Global cache to prevent duplicate requests
const avatarCache = new Map<string, string | null>();
const pendingRequests = new Map<string, Promise<any>>();

interface UserAvatarProps {
  name: string;
  email: string;
  className?: string;
  onClick?: () => void;
}

export function UserAvatar({ name, email, className, onClick }: UserAvatarProps) {
  const [picUrl, setPicUrl] = useState<string | null>(avatarCache.get(email) || null);

  useEffect(() => {
    if (!email) return;
    if (avatarCache.has(email)) {
      setPicUrl(avatarCache.get(email)!);
      return;
    }

    if (!pendingRequests.has(email)) {
      const promise = apiClient(`/api/users/profile/${email}`)
        .then(res => res.json())
        .then(result => {
          const url = result.success && result.data?.profilePicUrl ? result.data.profilePicUrl : null;
          avatarCache.set(email, url);
          return url;
        })
        .catch(() => {
          avatarCache.set(email, null);
          return null;
        });
      pendingRequests.set(email, promise);
    }

    let isMounted = true;
    pendingRequests.get(email)!.then(url => {
      if (isMounted) setPicUrl(url);
    });
    
    return () => { isMounted = false; };
  }, [email]);

  return (
    <Avatar className={className} onClick={onClick}>
      {picUrl ? (
        <img src={picUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground font-black uppercase">
          {name?.[0] || 'A'}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
