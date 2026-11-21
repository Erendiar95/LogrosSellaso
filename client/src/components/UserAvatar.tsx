import React from 'react';

interface UserAvatarProps {
  name: string;
  avatarColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarColor = '#f59e0b',
  size = 'md',
  className = '',
}) => {
  const getInitials = (str: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0 select-none ${sizeClasses[size]} ${className}`}
      style={{ backgroundColor: avatarColor }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
