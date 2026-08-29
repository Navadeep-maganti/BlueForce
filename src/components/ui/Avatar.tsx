import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isVerified?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isVerified = false,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (n: string) => {
    if (!n) return 'KC';
    const parts = n.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs sm:text-sm',
    lg: 'w-14 h-14 text-base font-black',
    xl: 'w-20 h-20 text-xl font-black',
  };

  const badgeSizes = {
    xs: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    sm: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    md: 'w-4 h-4 -bottom-1 -right-1',
    lg: 'w-5 h-5 -bottom-1 -right-1',
    xl: 'w-6 h-6 -bottom-1.5 -right-1.5',
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src && !imageError ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeClasses[size]} rounded-2xl object-cover border border-slate-200 shadow-2xs`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-blue-600 to-navy-900 text-white font-bold flex items-center justify-center border border-slate-200 shadow-2xs select-none`}
        >
          {getInitials(name)}
        </div>
      )}

      {isVerified && (
        <div
          className={`absolute ${badgeSizes[size]} bg-white rounded-full flex items-center justify-center shadow-xs text-blue-600 border border-white`}
          title="Verified Profile"
        >
          <ShieldCheck className="w-full h-full fill-blue-600 text-white" />
        </div>
      )}
    </div>
  );
};
